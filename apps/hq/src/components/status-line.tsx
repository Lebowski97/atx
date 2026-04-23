"use client";

export type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "uploading" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function StatusLine({ status }: { status: SaveStatus }) {
  if (status.kind === "saved") {
    return <span className="text-xs text-primary">Saved.</span>;
  }
  if (status.kind === "error") {
    return <span className="text-xs text-destructive">{status.message}</span>;
  }
  return <span className="text-xs text-muted-foreground" />;
}
