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

export async function runApplyCommand(
  targetDir: string,
  options: CommandOptions,
): Promise<number> {
  const absoluteTargetDir = resolveTargetDir(targetDir);
  const changes = await buildPlan({
    presetName: options.preset,
    targetDir: absoluteTargetDir,
    includeTags: options.include,
  });

  if (options.json) {
    printJson(createJsonPayload("apply", absoluteTargetDir, options, changes));
    return 0;
  }

  logger.start(`Applying preset=${options.preset} to ${absoluteTargetDir}`);
  printStackNotice(options.stack);
  printPlain(renderPlan(changes));

  const result = await applyPlan(changes, {
    dryRun: options.dryRun,
    force: options.force,
  });

  logger.success(options.dryRun ? "Dry run completed." : "Apply completed.");
  printPlain(formatApplyResult(result, options.dryRun));

  return result.skipped.length > 0 && !options.force ? 1 : 0;
}
