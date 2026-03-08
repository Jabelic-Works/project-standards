import path from "node:path";
import process from "node:process";

import { createConsola } from "consola";

import {
  summarizeChanges,
  type ApplyPlanResult,
  type PlannedChange,
} from "@jabelic/standards-core";

import type { CommandArgInput, CommandOptions } from "./types.js";

export const logger = createConsola({}).withTag("standards");

export function resolveTargetDir(targetDir?: string): string {
  return path.resolve(process.cwd(), targetDir ?? ".");
}

export function printJson(payload: unknown): void {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

export function printPlain(text: string): void {
  process.stdout.write(`${text}\n`);
}

export function normalizeCommandOptions(args: CommandArgInput): CommandOptions {
  return {
    preset: args.preset ?? "base",
    stack: args.stack ?? null,
    include: parseIncludeTags(args.include),
    dryRun: Boolean(args["dry-run"]),
    force: Boolean(args.force),
    yes: Boolean(args.yes),
    json: Boolean(args.json),
  };
}

export function createJsonPayload(
  commandName: string,
  targetDir: string,
  options: CommandOptions,
  changes: PlannedChange[],
): Record<string, unknown> {
  return {
    command: commandName,
    targetDir,
    preset: options.preset,
    stack: options.stack,
    include: options.include,
    dryRun: options.dryRun,
    force: options.force,
    summary: summarizeChanges(changes),
    changes,
  };
}

export function formatApplyResult(
  result: ApplyPlanResult,
  dryRun: boolean,
): string {
  const writeLabel = dryRun ? "Would write" : "Wrote";

  return [
    `${writeLabel}: ${result.written.length}`,
    `Skipped: ${result.skipped.length}`,
    `Unchanged: ${result.unchanged.length}`,
  ].join("\n");
}

export function printStackNotice(stack: string | null): void {
  if (!stack) {
    return;
  }

  logger.info(
    `stack=${stack} is reserved for future preset composition in this MVP.`,
  );
}

function parseIncludeTags(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}
