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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusLine, type SaveStatus } from "@/components/status-line";

export function StoreInfoForm() {
  const currentStoreInfo = useQuery(api.settings.getStoreInfoAdmin, {});
  const updateStoreInfo = useMutation(api.settings.updateStoreInfo);

  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });

  const displayValue = draft ?? currentStoreInfo ?? "";
  const dirty =
    currentStoreInfo !== undefined && displayValue !== (currentStoreInfo ?? "");

  async function handleSave() {
    setStatus({ kind: "saving" });
    try {
      await updateStoreInfo({ storeInfo: displayValue });
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
          err instanceof Error ? err.message : "Failed to update store info",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store info heading</CardTitle>
        <p className="text-xs text-muted-foreground">
          Shown above the menu on the customer-facing store. Use this for hours,
          delivery rules, minimums, etc. Leave blank to hide entirely.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="store-info">Info text</Label>
          <Textarea
            id="store-info"
            value={displayValue}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              currentStoreInfo === undefined
                ? "Loading..."
                : "e.g. Open Monday - Sunday\nDeliveries by appointment\n$50 minimum order"
            }
            disabled={currentStoreInfo === undefined}
            rows={5}
            className="min-h-28"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <StatusLine status={status} />
          <Button
            onClick={handleSave}
            disabled={!dirty || status.kind === "saving"}
          >
            {status.kind === "saving" ? "Saving..." : "Save info"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
