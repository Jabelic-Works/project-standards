import path from "node:path";

import { describe, expect, it } from "vitest";

import { createJsonPayload, formatApplyResult, normalizeCommandOptions, resolveTargetDir } from "./helpers.js";

describe("cli helpers", () => {
  it("normalizes command options with defaults", () => {
    expect(normalizeCommandOptions({})).toEqual({
      preset: "base",
      stack: null,
      include: [],
      dryRun: false,
      force: false,
      yes: false,
      json: false,
    });
  });

  it("parses include tags and kebab-case dry-run flag", () => {
    expect(
      normalizeCommandOptions({
        preset: "react",
        stack: "node",
        include: " AI,quality,ai,cursor ",
        "dry-run": true,
        force: true,
        yes: true,
        json: true,
      }),
    ).toEqual({
      preset: "react",
      stack: "node",
      include: ["ai", "quality", "cursor"],
      dryRun: true,
      force: true,
      yes: true,
      json: true,
    });
  });

  it("creates machine-readable payloads with a computed summary", () => {
    const payload = createJsonPayload(
      "diff",
      "/tmp/example",
      normalizeCommandOptions({ include: "quality" }),
      [
        {
          action: "create",
          sourcePreset: "base",
          sourcePath: "/templates/one",
          targetPath: "/tmp/example/renovate.json",
          relativeTargetPath: "renovate.json",
          strategy: "create_if_missing",
          tags: ["quality"],
          reason: "missing",
          currentContent: null,
          nextContent: "{}",
        },
      ],
    );

    expect(payload).toMatchObject({
      command: "diff",
      targetDir: "/tmp/example",
      summary: {
        total: 1,
        create: 1,
        replace: 0,
        skip: 0,
        noop: 0,
      },
    });
  });

  it("formats apply results for terminal output", () => {
    expect(
      formatApplyResult(
        {
          written: [{ action: "create" }] as never[],
          skipped: [{ action: "skip" }] as never[],
          unchanged: [{ action: "noop" }] as never[],
        },
        true,
      ),
    ).toBe("Would write: 1\nSkipped: 1\nUnchanged: 1");
  });

  it("resolves target directories relative to the current working directory", () => {
    expect(resolveTargetDir("packages")).toBe(path.resolve(process.cwd(), "packages"));
    expect(resolveTargetDir()).toBe(path.resolve(process.cwd(), "."));
  });
});
