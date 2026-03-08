import { promises as fs } from "node:fs";

import { applyPlan, buildPlan, renderPlan } from "@jabelic/standards-core";

import {
  createJsonPayload,
  formatApplyResult,
  logger,
  printJson,
  printPlain,
  printStackNotice,
  resolveTargetDir,
} from "../helpers.js";
import type { CommandOptions } from "../types.js";

export async function runInitCommand(
  targetDir: string,
  options: CommandOptions,
): Promise<number> {
  const absoluteTargetDir = resolveTargetDir(targetDir);

  if ((await directoryHasEntries(absoluteTargetDir)) && !options.yes) {
    logger.error(`Target directory is not empty: ${absoluteTargetDir}`);
    logger.info(
      "Run again with --yes or use diff/apply for an existing repository.",
    );
    return 1;
  }

  const changes = await buildPlan({
    presetName: options.preset,
    targetDir: absoluteTargetDir,
    includeTags: options.include,
  });

  if (options.json) {
    printJson(createJsonPayload("init", absoluteTargetDir, options, changes));
    return 0;
  }

  logger.start(`Initializing preset=${options.preset} in ${absoluteTargetDir}`);
  printStackNotice(options.stack);
  printPlain(renderPlan(changes));

  const result = await applyPlan(changes, {
    dryRun: options.dryRun,
    force: options.force,
  });

  logger.success(
    options.dryRun ? "Dry run completed." : "Initialization completed.",
  );
  printPlain(formatApplyResult(result, options.dryRun));

  return result.skipped.length > 0 && !options.force ? 1 : 0;
}

async function directoryHasEntries(targetDir: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(targetDir);
    return entries.length > 0;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }

    throw error;
  }
}
