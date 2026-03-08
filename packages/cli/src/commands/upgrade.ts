import { logger, printJson, resolveTargetDir } from "../helpers.js";
import type { CommandOptions } from "../types.js";

export async function runUpgradeCommand(
  targetDir: string,
  options: CommandOptions,
): Promise<number> {
  const absoluteTargetDir = resolveTargetDir(targetDir);
  const payload = {
    command: "upgrade",
    targetDir: absoluteTargetDir,
    preset: options.preset,
    status: "stub",
    message:
      "upgrade will refresh managed files and shared preset versions in a future iteration.",
  };

  if (options.json) {
    printJson(payload);
    return 0;
  }

  logger.info(`upgrade is reserved for a future iteration: ${absoluteTargetDir}`);
  logger.info(payload.message);

  return 0;
}
