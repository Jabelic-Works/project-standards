export interface CommandOptions {
  preset: string;
  stack: string | null;
  include: string[];
  dryRun: boolean;
  force: boolean;
  yes: boolean;
  json: boolean;
}

export interface CommandArgInput {
  targetDir?: string;
  preset?: string;
  stack?: string;
  include?: string;
  "dry-run"?: boolean;
  force?: boolean;
  yes?: boolean;
  json?: boolean;
}
