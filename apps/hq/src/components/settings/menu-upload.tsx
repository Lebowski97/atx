"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StatusLine, type SaveStatus } from "@/components/status-line";

export function MenuUpload() {
  const menuImageUrl = useQuery(api.files.getMenuImageUrl, {});
  const generateUploadUrl = useMutation(api.files.generateMenuUploadUrl);
  const setMenuImage = useMutation(api.files.setMenuImage);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });

  useEffect(() => {
    if (!pendingFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPendingFile(file);
    setStatus({ kind: "idle" });
  }

  async function handleUpload() {
    if (!pendingFile) return;
    setStatus({ kind: "uploading" });
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": pendingFile.type },
        body: pendingFile,
      });
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
      }
      const { storageId } = (await res.json()) as {
        storageId: Id<"_storage">;
      };
      await setMenuImage({ storageId });
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus({ kind: "saved" });
      setTimeout(
        () => setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s)),
        2000,
      );
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Failed to upload menu",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu image</CardTitle>
        <p className="text-xs text-muted-foreground">
          The customer-facing menu PNG. Uploading a new image replaces the
          current one immediately for everyone.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-[0.625rem] font-medium tracking-wider text-muted-foreground uppercase">
            Current
          </div>
          <div className="overflow-hidden rounded-md border border-border bg-card/40">
            {menuImageUrl === undefined ? (
              <div className="aspect-[4/5] w-full animate-pulse bg-muted" />
            ) : menuImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={menuImageUrl}
                alt="Current menu"
                className="h-auto w-full"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center text-xs text-muted-foreground">
                No menu image yet
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label htmlFor="menu-file">Upload new menu</Label>
          <Input
            id="menu-file"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {previewUrl && (
          <div className="flex flex-col gap-2">
            <div className="text-[0.625rem] font-medium tracking-wider text-muted-foreground uppercase">
              Preview
            </div>
            <div className="overflow-hidden rounded-md border border-border bg-card/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Menu preview"
                className="h-auto w-full"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <StatusLine status={status} />
          <Button
            onClick={handleUpload}
            disabled={!pendingFile || status.kind === "uploading"}
          >
            {status.kind === "uploading" ? "Uploading..." : "Save menu"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
