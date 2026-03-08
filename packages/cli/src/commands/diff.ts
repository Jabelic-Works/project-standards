import { buildPlan, renderPlan } from "@jabelic/standards-core";

import {
  createJsonPayload,
  logger,
  printJson,
  printPlain,
  printStackNotice,
  resolveTargetDir,
} from "../helpers.js";
import type { CommandOptions } from "../types.js";

export async function runDiffCommand(
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
    printJson(createJsonPayload("diff", absoluteTargetDir, options, changes));
    return 0;
  }

  logger.info(`Diff for preset=${options.preset} in ${absoluteTargetDir}`);
  printStackNotice(options.stack);
  printPlain(renderPlan(changes));

  return 0;
}
