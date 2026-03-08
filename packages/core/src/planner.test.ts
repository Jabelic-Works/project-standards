import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { MANAGED_MARKER } from "./contracts.js";
import {
  applyPlan,
  buildPlan,
  isManagedContent,
  listAvailablePresets,
  loadPresetManifest,
} from "./planner.js";

const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("planner", () => {
  it("lists and loads available presets", async () => {
    await expect(listAvailablePresets()).resolves.toContain("base");

    const manifest = await loadPresetManifest("base");

    expect(manifest.name).toBe("base");
    expect(manifest.files.length).toBeGreaterThan(0);
  });

  it("builds create actions for an empty target directory", async () => {
    const targetDir = await createTempTargetDir();

    const changes = await buildPlan({
      presetName: "base",
      targetDir,
      includeTags: ["quality"],
    });

    expect(changes.map((change) => change.relativeTargetPath)).toEqual([
      ".cursor/commands/quality-check.md",
      ".oxfmtrc.json",
      ".oxlintrc.json",
      "eslint.config.mjs",
      "renovate.json",
    ]);
    expect(changes.every((change) => change.action === "create")).toBe(true);
  });

  it("distinguishes noop, replace, and skip based on file strategy", async () => {
    const targetDir = await createTempTargetDir();

    const baseline = await buildPlan({
      presetName: "base",
      targetDir,
      includeTags: ["ai", "quality"],
    });

    const agentsFile = getChange(baseline, "AGENTS.md");
    const eslintFile = getChange(baseline, "eslint.config.mjs");

    await writeFile(path.join(targetDir, "AGENTS.md"), agentsFile.nextContent, "utf8");
    await writeFile(
      path.join(targetDir, "eslint.config.mjs"),
      `// ${MANAGED_MARKER}\nexport default [];`,
      "utf8",
    );
    await writeFile(
      path.join(targetDir, "renovate.json"),
      JSON.stringify({ extends: ["local>custom/renovate"] }, null, 2),
      "utf8",
    );

    const updated = await buildPlan({
      presetName: "base",
      targetDir,
      includeTags: ["ai", "quality"],
    });

    expect(getChange(updated, "AGENTS.md").action).toBe("noop");
    expect(getChange(updated, "eslint.config.mjs").action).toBe("replace");
    expect(getChange(updated, "renovate.json").action).toBe("skip");
  });

  it("supports dry-run without writing files", async () => {
    const targetDir = await createTempTargetDir();
    const changes = await buildPlan({
      presetName: "base",
      targetDir,
      includeTags: ["quality"],
    });

    const result = await applyPlan(changes, { dryRun: true });

    expect(result.written).toHaveLength(5);
    await expect(readFile(path.join(targetDir, "renovate.json"), "utf8")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("forces skipped files to be replaced when requested", async () => {
    const targetDir = await createTempTargetDir();

    await writeFile(
      path.join(targetDir, "renovate.json"),
      JSON.stringify({ extends: ["local>custom/renovate"] }, null, 2),
      "utf8",
    );

    const changes = await buildPlan({
      presetName: "base",
      targetDir,
      includeTags: ["quality"],
    });
    const renovateChange = getChange(changes, "renovate.json");

    const result = await applyPlan([renovateChange], { force: true });
    const writtenContent = await readFile(path.join(targetDir, "renovate.json"), "utf8");

    expect(result.written).toHaveLength(1);
    expect(result.written[0].action).toBe("replace");
    expect(writtenContent).toBe(renovateChange.nextContent);
  });

  it("detects the managed marker in file content", () => {
    expect(isManagedContent(`header\n${MANAGED_MARKER}\nfooter`)).toBe(true);
    expect(isManagedContent("header\nfooter")).toBe(false);
    expect(isManagedContent(null)).toBe(false);
  });
});

async function createTempTargetDir(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "project-standards-core-"));
  tempDirectories.push(directory);
  return directory;
}

function getChange<T extends { relativeTargetPath: string }>(
  changes: T[],
  relativeTargetPath: string,
): T {
  const change = changes.find(
    (candidate) => candidate.relativeTargetPath === relativeTargetPath,
  );

  if (!change) {
    throw new Error(`Change not found: ${relativeTargetPath}`);
  }

  return change;
}
