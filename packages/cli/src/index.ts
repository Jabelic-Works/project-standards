#!/usr/bin/env node

import process from "node:process";
import { pathToFileURL } from "node:url";

import { listAvailablePresets } from "@jabelic/standards-core";
import { defineCommand, runMain } from "citty";

import { runApplyCommand } from "./commands/apply.js";
import { runDiffCommand } from "./commands/diff.js";
import { runDoctorCommand } from "./commands/doctor.js";
import { runInitCommand } from "./commands/init.js";
import { runUpgradeCommand } from "./commands/upgrade.js";
import { logger, normalizeCommandOptions } from "./helpers.js";

export const CLI_VERSION = "0.1.0";

export function createMainCommand(presets: string[]) {
  const presetDescription = `Preset name (available: ${presets.join(", ")})`;

  const repositoryArgs = {
    targetDir: {
      type: "positional" as const,
      description: "Target repository directory",
      default: ".",
    },
  };
  const sharedArgs = {
    preset: {
      type: "string" as const,
      description: presetDescription,
      default: "base",
    },
    stack: {
      type: "string" as const,
      description: "Reserved for future stack composition",
    },
    include: {
      type: "string" as const,
      description: "Comma-separated tag filter such as ai,cursor,quality",
      valueHint: "tags",
    },
    "dry-run": {
      type: "boolean" as const,
      description: "Compute writes without touching the target repository",
    },
    force: {
      type: "boolean" as const,
      description: "Replace skipped files even when they are not managed",
    },
    json: {
      type: "boolean" as const,
      description: "Print machine-readable output",
    },
  };

  return defineCommand({
    meta: {
      name: "standards",
      version: CLI_VERSION,
      description: "Apply shared repository standards through reusable presets",
    },
    subCommands: {
      init: defineCommand({
        meta: {
          name: "init",
          description: "Initialize a new repository with managed standard files",
        },
        args: {
          ...repositoryArgs,
          ...sharedArgs,
          yes: {
            type: "boolean" as const,
            description: "Allow init to run in a non-empty directory",
          },
        },
        async run({ args }) {
          process.exitCode = await runInitCommand(
            args.targetDir,
            normalizeCommandOptions(args),
          );
        },
      }),
      apply: defineCommand({
        meta: {
          name: "apply",
          description: "Apply the selected preset to an existing repository",
        },
        args: {
          ...repositoryArgs,
          ...sharedArgs,
        },
        async run({ args }) {
          process.exitCode = await runApplyCommand(
            args.targetDir,
            normalizeCommandOptions(args),
          );
        },
      }),
      diff: defineCommand({
        meta: {
          name: "diff",
          description: "Show the planned file-level diff without writing changes",
        },
        args: {
          ...repositoryArgs,
          ...sharedArgs,
        },
        async run({ args }) {
          process.exitCode = await runDiffCommand(
            args.targetDir,
            normalizeCommandOptions(args),
          );
        },
      }),
      doctor: defineCommand({
        meta: {
          name: "doctor",
          description: "Reserved for future repository diagnostics",
        },
        args: {
          ...repositoryArgs,
          ...sharedArgs,
        },
        async run({ args }) {
          process.exitCode = await runDoctorCommand(
            args.targetDir,
            normalizeCommandOptions(args),
          );
        },
      }),
      upgrade: defineCommand({
        meta: {
          name: "upgrade",
          description: "Reserved for future managed-file updates",
        },
        args: {
          ...repositoryArgs,
          ...sharedArgs,
        },
        async run({ args }) {
          process.exitCode = await runUpgradeCommand(
            args.targetDir,
            normalizeCommandOptions(args),
          );
        },
      }),
    },
  });
}

export async function safeListAvailablePresets(): Promise<string[]> {
  try {
    return await listAvailablePresets();
  } catch {
    return ["base"];
  }
}

export async function main(rawArgs = process.argv.slice(2)): Promise<void> {
  const presets = await safeListAvailablePresets();
  const mainCommand = createMainCommand(presets);

  await runMain(mainCommand, { rawArgs });
}

function isExecutedDirectly(): boolean {
  return Boolean(process.argv[1]) &&
    import.meta.url === pathToFileURL(process.argv[1]).href;
}

if (isExecutedDirectly()) {
  main().catch((error) => {
    logger.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
