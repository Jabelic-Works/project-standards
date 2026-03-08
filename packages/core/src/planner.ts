import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MANAGED_MARKER,
  type ApplyPlanOptions,
  type ApplyPlanResult,
  type BuildPlanOptions,
  type PlannedChange,
  type PresetManifest,
  type TemplateFileDefinition,
} from "./contracts.js";

const templatesRoot = fileURLToPath(new URL("../../../templates/", import.meta.url));

interface ResolvedTemplateFileDefinition extends TemplateFileDefinition {
  presetName: string;
}

export async function listAvailablePresets(): Promise<string[]> {
  const entries = await fs.readdir(templatesRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

export async function loadPresetManifest(presetName: string): Promise<PresetManifest> {
  const manifestPath = path.join(templatesRoot, presetName, "preset.json");
  const manifestContent = await fs.readFile(manifestPath, "utf8");

  return JSON.parse(manifestContent) as PresetManifest;
}

export function isManagedContent(content: string | null): boolean {
  return content?.includes(MANAGED_MARKER) ?? false;
}

export async function buildPlan(options: BuildPlanOptions): Promise<PlannedChange[]> {
  const includeTags = normalizeTags(options.includeTags);
  const files = await resolvePresetFiles(options.presetName);
  const changes: PlannedChange[] = [];

  for (const file of files) {
    const fileTags = normalizeTags(file.tags);

    if (includeTags.length > 0 && !fileTags.some((tag) => includeTags.includes(tag))) {
      continue;
    }

    const sourcePath = path.join(templatesRoot, file.presetName, "files", file.source);
    const targetPath = path.resolve(options.targetDir, file.target);
    const nextContent = await fs.readFile(sourcePath, "utf8");
    const currentContent = await readFileIfExists(targetPath);
    const { action, reason } = determineChange(file, currentContent, nextContent);

    changes.push({
      action,
      sourcePreset: file.presetName,
      sourcePath,
      targetPath,
      relativeTargetPath: path.relative(options.targetDir, targetPath) || ".",
      strategy: file.strategy,
      tags: fileTags,
      description: file.description,
      reason,
      currentContent,
      nextContent,
    });
  }

  return changes.sort((left, right) =>
    left.relativeTargetPath.localeCompare(right.relativeTargetPath),
  );
}

export async function applyPlan(
  changes: PlannedChange[],
  options: ApplyPlanOptions = {},
): Promise<ApplyPlanResult> {
  const result: ApplyPlanResult = {
    written: [],
    skipped: [],
    unchanged: [],
  };

  for (const change of changes) {
    if (change.action === "noop") {
      result.unchanged.push(change);
      continue;
    }

    if (change.action === "skip" && !options.force) {
      result.skipped.push(change);
      continue;
    }

    const appliedChange =
      change.action === "skip"
        ? {
            ...change,
            action: "replace" as const,
            reason: `${change.reason}; replaced because --force was used`,
          }
        : change;

    if (!options.dryRun) {
      await fs.mkdir(path.dirname(appliedChange.targetPath), { recursive: true });
      await fs.writeFile(appliedChange.targetPath, appliedChange.nextContent, "utf8");
    }

    result.written.push(appliedChange);
  }

  return result;
}

async function resolvePresetFiles(
  presetName: string,
  lineage: string[] = [],
): Promise<ResolvedTemplateFileDefinition[]> {
  if (lineage.includes(presetName)) {
    throw new Error(
      `Preset cycle detected: ${[...lineage, presetName].join(" -> ")}`,
    );
  }

  const manifest = await loadPresetManifest(presetName);
  const inheritedFiles: ResolvedTemplateFileDefinition[] = [];

  for (const parentPresetName of manifest.extends ?? []) {
    inheritedFiles.push(
      ...(await resolvePresetFiles(parentPresetName, [...lineage, presetName])),
    );
  }

  const ownFiles = manifest.files.map((file) => ({
    ...file,
    presetName,
  }));

  const fileByTarget = new Map<string, ResolvedTemplateFileDefinition>();

  for (const file of [...inheritedFiles, ...ownFiles]) {
    fileByTarget.set(file.target, file);
  }

  return [...fileByTarget.values()];
}

function determineChange(
  file: TemplateFileDefinition,
  currentContent: string | null,
  nextContent: string,
): Pick<PlannedChange, "action" | "reason"> {
  if (currentContent === null) {
    return {
      action: "create",
      reason: "target file does not exist",
    };
  }

  if (currentContent === nextContent) {
    return {
      action: "noop",
      reason: "target already matches the template",
    };
  }

  if (file.strategy === "replace_if_managed" && isManagedContent(currentContent)) {
    return {
      action: "replace",
      reason: "existing file is managed and differs from the template",
    };
  }

  if (file.strategy === "replace_if_managed") {
    return {
      action: "skip",
      reason: "existing file differs and is not managed by this tool",
    };
  }

  return {
    action: "skip",
    reason: "existing file already exists and create-only mode is active",
  };
}

function normalizeTags(tags: string[] | undefined): string[] {
  if (!tags) {
    return [];
  }

  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

async function readFileIfExists(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}
