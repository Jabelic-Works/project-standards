import { type ChangeSummary, type PlannedChange } from "./contracts.js";

export function summarizeChanges(changes: PlannedChange[]): ChangeSummary {
  const summary: ChangeSummary = {
    total: changes.length,
    create: 0,
    replace: 0,
    skip: 0,
    noop: 0,
  };

  for (const change of changes) {
    summary[change.action] += 1;
  }

  return summary;
}

export function renderPlan(
  changes: PlannedChange[],
  options: { includeNoop?: boolean } = {},
): string {
  const summary = summarizeChanges(changes);
  const lines = [
    `Summary: total=${summary.total}, create=${summary.create}, replace=${summary.replace}, skip=${summary.skip}, noop=${summary.noop}`,
  ];

  for (const change of changes) {
    if (!options.includeNoop && change.action === "noop") {
      continue;
    }

    lines.push("");
    lines.push(renderChange(change));
  }

  return lines.join("\n");
}

export function renderChange(change: PlannedChange): string {
  const header = `[${change.action.toUpperCase()}] ${change.relativeTargetPath}`;
  const metadata = `preset=${change.sourcePreset}, strategy=${change.strategy}, reason=${change.reason}`;

  if (change.action === "noop") {
    return [header, metadata].join("\n");
  }

  return [
    header,
    metadata,
    ...renderUnifiedDiff(change.currentContent, change.nextContent),
  ].join("\n");
}

function renderUnifiedDiff(currentContent: string | null, nextContent: string): string[] {
  const beforeLines = toLines(currentContent ?? "");
  const afterLines = toLines(nextContent);
  const parts = diffLines(beforeLines, afterLines);
  const lines = ["--- current", "+++ template"];

  for (const part of parts) {
    const prefix =
      part.type === "context" ? " " : part.type === "remove" ? "-" : "+";

    lines.push(`${prefix}${part.line}`);
  }

  return lines;
}

function toLines(content: string): string[] {
  const normalized = content.replace(/\r\n/g, "\n");

  if (normalized.length === 0) {
    return [];
  }

  const lines = normalized.split("\n");

  if (lines.at(-1) === "") {
    lines.pop();
  }

  return lines;
}

function diffLines(
  beforeLines: string[],
  afterLines: string[],
): Array<{ type: "context" | "remove" | "add"; line: string }> {
  const longestCommonSubsequence = Array.from({ length: beforeLines.length + 1 }, () =>
    Array<number>(afterLines.length + 1).fill(0),
  );

  for (let beforeIndex = beforeLines.length - 1; beforeIndex >= 0; beforeIndex -= 1) {
    for (let afterIndex = afterLines.length - 1; afterIndex >= 0; afterIndex -= 1) {
      if (beforeLines[beforeIndex] === afterLines[afterIndex]) {
        longestCommonSubsequence[beforeIndex][afterIndex] =
          longestCommonSubsequence[beforeIndex + 1][afterIndex + 1] + 1;
        continue;
      }

      longestCommonSubsequence[beforeIndex][afterIndex] = Math.max(
        longestCommonSubsequence[beforeIndex + 1][afterIndex],
        longestCommonSubsequence[beforeIndex][afterIndex + 1],
      );
    }
  }

  const diff: Array<{ type: "context" | "remove" | "add"; line: string }> = [];
  let beforeIndex = 0;
  let afterIndex = 0;

  while (beforeIndex < beforeLines.length && afterIndex < afterLines.length) {
    if (beforeLines[beforeIndex] === afterLines[afterIndex]) {
      diff.push({ type: "context", line: beforeLines[beforeIndex] });
      beforeIndex += 1;
      afterIndex += 1;
      continue;
    }

    if (
      longestCommonSubsequence[beforeIndex + 1][afterIndex] >=
      longestCommonSubsequence[beforeIndex][afterIndex + 1]
    ) {
      diff.push({ type: "remove", line: beforeLines[beforeIndex] });
      beforeIndex += 1;
      continue;
    }

    diff.push({ type: "add", line: afterLines[afterIndex] });
    afterIndex += 1;
  }

  while (beforeIndex < beforeLines.length) {
    diff.push({ type: "remove", line: beforeLines[beforeIndex] });
    beforeIndex += 1;
  }

  while (afterIndex < afterLines.length) {
    diff.push({ type: "add", line: afterLines[afterIndex] });
    afterIndex += 1;
  }

  return diff;
}
