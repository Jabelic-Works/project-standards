import { describe, expect, it } from "vitest";

import type { PlannedChange } from "./contracts.js";
import { renderChange, renderPlan, summarizeChanges } from "./diff.js";

describe("diff helpers", () => {
  it("summarizes planned changes by action", () => {
    const changes = [
      createChange({ action: "create", relativeTargetPath: "a.txt" }),
      createChange({ action: "replace", relativeTargetPath: "b.txt" }),
      createChange({ action: "skip", relativeTargetPath: "c.txt" }),
      createChange({ action: "noop", relativeTargetPath: "d.txt" }),
    ];

    expect(summarizeChanges(changes)).toEqual({
      total: 4,
      create: 1,
      replace: 1,
      skip: 1,
      noop: 1,
    });
  });

  it("omits noop changes by default when rendering a plan", () => {
    const output = renderPlan([
      createChange({
        action: "create",
        relativeTargetPath: "renovate.json",
        currentContent: null,
        nextContent: "{\n  \"enabled\": true\n}",
      }),
      createChange({
        action: "noop",
        relativeTargetPath: "eslint.config.mjs",
      }),
    ]);

    expect(output).toContain("Summary: total=2, create=1, replace=0, skip=0, noop=1");
    expect(output).toContain("[CREATE] renovate.json");
    expect(output).not.toContain("[NOOP] eslint.config.mjs");
  });

  it("renders noop changes when explicitly requested", () => {
    const output = renderPlan(
      [
        createChange({
          action: "noop",
          relativeTargetPath: "eslint.config.mjs",
        }),
      ],
      { includeNoop: true },
    );

    expect(output).toContain("[NOOP] eslint.config.mjs");
  });

  it("renders a simple unified diff for non-noop changes", () => {
    const output = renderChange(
      createChange({
        action: "replace",
        relativeTargetPath: "eslint.config.mjs",
        currentContent: "export default [];",
        nextContent: "export default [1];",
      }),
    );

    expect(output).toContain("--- current");
    expect(output).toContain("+++ template");
    expect(output).toContain("-export default [];");
    expect(output).toContain("+export default [1];");
  });
});

function createChange(overrides: Partial<PlannedChange>): PlannedChange {
  return {
    action: "create",
    sourcePreset: "base",
    sourcePath: "/templates/base/example",
    targetPath: "/target/example",
    relativeTargetPath: "example",
    strategy: "create_if_missing",
    tags: ["quality"],
    reason: "test fixture",
    currentContent: null,
    nextContent: "content",
    ...overrides,
  };
}
