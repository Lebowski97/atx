"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusLine, type SaveStatus } from "@/components/status-line";

export function PasscodeForm() {
  const currentPasscode = useQuery(api.settings.getPasscode, {});
  const updatePasscode = useMutation(api.settings.updatePasscode);

  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });

  const displayValue = draft ?? currentPasscode ?? "";
  const dirty =
    currentPasscode !== undefined &&
    displayValue.trim().length > 0 &&
    displayValue !== (currentPasscode ?? "");

  async function handleSave() {
    setStatus({ kind: "saving" });
    try {
      await updatePasscode({ passcode: displayValue.trim() });
      setDraft(null);
      setStatus({ kind: "saved" });
      setTimeout(
        () => setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s)),
        2000,
      );
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Failed to update passcode",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer passcode</CardTitle>
        <p className="text-xs text-muted-foreground">
          Customers must enter this passcode to access the store. Rotate it any
          time without redeploying.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="passcode">Passcode</Label>
          <Input
            id="passcode"
            value={displayValue}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              currentPasscode === undefined
                ? "Loading..."
                : currentPasscode === null
                  ? "No passcode set"
                  : ""
            }
            disabled={currentPasscode === undefined}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <StatusLine status={status} />
          <Button
            onClick={handleSave}
            disabled={!dirty || status.kind === "saving"}
          >
            {status.kind === "saving" ? "Saving..." : "Save passcode"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
