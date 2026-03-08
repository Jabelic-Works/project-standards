export const MANAGED_MARKER = "managed-by: @jabelic/standards";

export type FileStrategy = "create_if_missing" | "replace_if_managed";

export type PlannedChangeAction = "create" | "replace" | "skip" | "noop";

export interface TemplateFileDefinition {
  source: string;
  target: string;
  strategy: FileStrategy;
  tags?: string[];
  description?: string;
}

export interface PresetManifest {
  name: string;
  version: string;
  description?: string;
  extends?: string[];
  files: TemplateFileDefinition[];
}

export interface BuildPlanOptions {
  presetName: string;
  targetDir: string;
  includeTags?: string[];
}

export interface PlannedChange {
  action: PlannedChangeAction;
  sourcePreset: string;
  sourcePath: string;
  targetPath: string;
  relativeTargetPath: string;
  strategy: FileStrategy;
  tags: string[];
  description?: string;
  reason: string;
  currentContent: string | null;
  nextContent: string;
}

export interface ApplyPlanOptions {
  dryRun?: boolean;
  force?: boolean;
}

export interface ApplyPlanResult {
  written: PlannedChange[];
  skipped: PlannedChange[];
  unchanged: PlannedChange[];
}

export interface ChangeSummary {
  total: number;
  create: number;
  replace: number;
  skip: number;
  noop: number;
}
