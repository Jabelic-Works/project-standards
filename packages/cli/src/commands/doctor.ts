import { logger, printJson, resolveTargetDir } from "../helpers.js";
import type { CommandOptions } from "../types.js";

export async function runDoctorCommand(
  targetDir: string,
  options: CommandOptions,
): Promise<number> {
  const absoluteTargetDir = resolveTargetDir(targetDir);
  const payload = {
    command: "doctor",
    targetDir: absoluteTargetDir,
    preset: options.preset,
    status: "stub",
    message:
      "doctor will validate managed files, installed shared packages, and stack-specific checks in a future iteration.",
  };

  if (options.json) {
    printJson(payload);
    return 0;
  }

  logger.info(`doctor is reserved for a future iteration: ${absoluteTargetDir}`);
  logger.info(payload.message);

  return 0;
}
