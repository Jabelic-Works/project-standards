export {
  MANAGED_MARKER,
  type ApplyPlanOptions,
  type ApplyPlanResult,
  type BuildPlanOptions,
  type ChangeSummary,
  type FileStrategy,
  type PlannedChange,
  type PlannedChangeAction,
  type PresetManifest,
  type TemplateFileDefinition,
} from "./contracts.js";
export { renderChange, renderPlan, summarizeChanges } from "./diff.js";
export {
  applyPlan,
  buildPlan,
  isManagedContent,
  listAvailablePresets,
  loadPresetManifest,
} from "./planner.js";
