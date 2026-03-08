import process from "node:process";

import { runCommand } from "citty";
import { beforeEach, describe, expect, it, vi } from "vitest";

const commandMocks = vi.hoisted(() => ({
  runInitCommand: vi.fn(async () => 0),
  runApplyCommand: vi.fn(async () => 0),
  runDiffCommand: vi.fn(async () => 0),
  runDoctorCommand: vi.fn(async () => 0),
  runUpgradeCommand: vi.fn(async () => 0),
}));

vi.mock("./commands/init.js", () => ({
  runInitCommand: commandMocks.runInitCommand,
}));

vi.mock("./commands/apply.js", () => ({
  runApplyCommand: commandMocks.runApplyCommand,
}));

vi.mock("./commands/diff.js", () => ({
  runDiffCommand: commandMocks.runDiffCommand,
}));

vi.mock("./commands/doctor.js", () => ({
  runDoctorCommand: commandMocks.runDoctorCommand,
}));

vi.mock("./commands/upgrade.js", () => ({
  runUpgradeCommand: commandMocks.runUpgradeCommand,
}));

describe("cli entrypoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;
  });

  it("wires diff arguments through citty and normalizes options", async () => {
    const { createMainCommand } = await import("./index.js");
    const command = createMainCommand(["base", "react"]);

    await runCommand(command, {
      rawArgs: [
        "diff",
        "target-repository",
        "--include",
        "quality,ai",
        "--dry-run",
        "--stack",
        "node",
      ],
    });

    expect(commandMocks.runDiffCommand).toHaveBeenCalledWith(
      "target-repository",
      {
        preset: "base",
        stack: "node",
        include: ["quality", "ai"],
        dryRun: true,
        force: false,
        yes: false,
        json: false,
      },
    );
    expect(process.exitCode).toBe(0);
  });

  it("wires init-specific flags and custom presets", async () => {
    commandMocks.runInitCommand.mockResolvedValueOnce(1);

    const { createMainCommand } = await import("./index.js");
    const command = createMainCommand(["base", "react"]);

    await runCommand(command, {
      rawArgs: ["init", "new-project", "--preset", "react", "--yes"],
    });

    expect(commandMocks.runInitCommand).toHaveBeenCalledWith("new-project", {
      preset: "react",
      stack: null,
      include: [],
      dryRun: false,
      force: false,
      yes: true,
      json: false,
    });
    expect(process.exitCode).toBe(1);
  });

  it("wires apply flags including force and json", async () => {
    const { createMainCommand } = await import("./index.js");
    const command = createMainCommand(["base"]);

    await runCommand(command, {
      rawArgs: ["apply", ".", "--force", "--json"],
    });

    expect(commandMocks.runApplyCommand).toHaveBeenCalledWith(".", {
      preset: "base",
      stack: null,
      include: [],
      dryRun: false,
      force: true,
      yes: false,
      json: true,
    });
  });
});
