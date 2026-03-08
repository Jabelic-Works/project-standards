import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../helpers.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../helpers.js")>();

  return {
    ...actual,
    logger: {
      start: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
    },
    printJson: vi.fn(),
    printPlain: vi.fn(),
    printStackNotice: vi.fn(),
  };
});

import * as helpers from "../helpers.js";
import { runApplyCommand } from "./apply.js";
import { runDiffCommand } from "./diff.js";
import { runDoctorCommand } from "./doctor.js";
import { runInitCommand } from "./init.js";
import { runUpgradeCommand } from "./upgrade.js";

const tempDirectories: string[] = [];

const baseOptions = {
  preset: "base",
  stack: null,
  include: [] as string[],
  dryRun: false,
  force: false,
  yes: false,
  json: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(async () => {
  await Promise.all(
    tempDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("cli commands", () => {
  it("refuses to init a non-empty directory without --yes", async () => {
    const targetDir = await createTempTargetDir();
    await writeFile(path.join(targetDir, "README.md"), "# existing\n", "utf8");

    const exitCode = await runInitCommand(targetDir, baseOptions);

    expect(exitCode).toBe(1);
    expect(helpers.logger.error).toHaveBeenCalled();
  });

  it("supports dry-run init without writing files", async () => {
    const targetDir = await createTempTargetDir();

    const exitCode = await runInitCommand(targetDir, {
      ...baseOptions,
      include: ["renovate"],
      dryRun: true,
    });

    expect(exitCode).toBe(0);
    await expect(
      readFile(path.join(targetDir, "renovate.json"), "utf8"),
    ).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("returns a failing exit code when apply encounters skipped files", async () => {
    const targetDir = await createTempTargetDir();
    const targetFile = path.join(targetDir, "renovate.json");
    await writeFile(
      targetFile,
      JSON.stringify({ extends: ["local>custom/renovate"] }, null, 2),
      "utf8",
    );

    const exitCode = await runApplyCommand(targetDir, {
      ...baseOptions,
      include: ["renovate"],
    });

    expect(exitCode).toBe(1);
    await expect(readFile(targetFile, "utf8")).resolves.toContain(
      "local>custom/renovate",
    );
  });

  it("can force apply over an unmanaged file", async () => {
    const targetDir = await createTempTargetDir();
    const targetFile = path.join(targetDir, "renovate.json");
    await writeFile(
      targetFile,
      JSON.stringify({ extends: ["local>custom/renovate"] }, null, 2),
      "utf8",
    );

    const exitCode = await runApplyCommand(targetDir, {
      ...baseOptions,
      include: ["renovate"],
      force: true,
    });

    expect(exitCode).toBe(0);
    await expect(readFile(targetFile, "utf8")).resolves.toContain(
      "config:best-practices",
    );
  });

  it("renders diff payloads as JSON without writing files", async () => {
    const targetDir = await createTempTargetDir();

    const exitCode = await runDiffCommand(targetDir, {
      ...baseOptions,
      include: ["renovate"],
      json: true,
    });

    expect(exitCode).toBe(0);
    expect(helpers.printJson).toHaveBeenCalledTimes(1);
    expect(helpers.printJson).toHaveBeenCalledWith(
      expect.objectContaining({
        command: "diff",
        targetDir,
        preset: "base",
        summary: expect.objectContaining({
          total: 1,
          create: 1,
        }),
      }),
    );
    await expect(
      readFile(path.join(targetDir, "renovate.json"), "utf8"),
    ).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("returns stub payloads for doctor and upgrade", async () => {
    const targetDir = await createTempTargetDir();

    await expect(
      runDoctorCommand(targetDir, { ...baseOptions, json: true }),
    ).resolves.toBe(0);
    expect(helpers.printJson).toHaveBeenCalledWith(
      expect.objectContaining({
        command: "doctor",
        targetDir,
        status: "stub",
      }),
    );

    vi.clearAllMocks();

    await expect(
      runUpgradeCommand(targetDir, { ...baseOptions, json: true }),
    ).resolves.toBe(0);
    expect(helpers.printJson).toHaveBeenCalledWith(
      expect.objectContaining({
        command: "upgrade",
        targetDir,
        status: "stub",
      }),
    );
  });
});

async function createTempTargetDir(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "project-standards-cli-"));
  tempDirectories.push(directory);
  return directory;
}
