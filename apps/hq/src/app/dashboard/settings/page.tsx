"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
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

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/40 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
            <p className="text-xs text-muted-foreground">
              Passcode and menu management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">Back to orders</Link>
          </Button>
          <SignOutButton>
            <Button variant="outline" size="sm">
              Sign out
            </Button>
          </SignOutButton>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <PasscodeCard />
          <MenuCard />
        </div>
      </main>
    </div>
  );
}

function PasscodeCard() {
  const currentPasscode = useQuery(api.settings.getPasscode, {});
  const updatePasscode = useMutation(api.settings.updatePasscode);

  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  useEffect(() => {
    if (currentPasscode !== undefined && currentPasscode !== null) {
      setDraft(currentPasscode);
    }
  }, [currentPasscode]);

  const dirty =
    currentPasscode !== undefined &&
    draft.trim().length > 0 &&
    draft !== (currentPasscode ?? "");

  async function handleSave() {
    setStatus({ kind: "saving" });
    try {
      await updatePasscode({ passcode: draft.trim() });
      setStatus({ kind: "saved" });
      setTimeout(
        () => setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s)),
        2000,
      );
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Failed to update passcode",
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
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              currentPasscode === undefined
                ? "Loading…"
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
            {status.kind === "saving" ? "Saving…" : "Save passcode"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MenuCard() {
  const menuImageUrl = useQuery(api.files.getMenuImageUrl, {});
  const generateUploadUrl = useMutation(api.files.generateMenuUploadUrl);
  const setMenuImage = useMutation(api.files.setMenuImage);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "uploading" } | { kind: "saved" } | { kind: "error"; message: string }
  >({ kind: "idle" });

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
        message: err instanceof Error ? err.message : "Failed to upload menu",
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
          <div className="overflow-hidden border border-border bg-card/40">
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
            <div className="overflow-hidden border border-border bg-card/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Menu preview" className="h-auto w-full" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <StatusLine status={status} />
          <Button
            onClick={handleUpload}
            disabled={!pendingFile || status.kind === "uploading"}
          >
            {status.kind === "uploading" ? "Uploading…" : "Save menu"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusLine({
  status,
}: {
  status:
    | { kind: "idle" }
    | { kind: "saving" }
    | { kind: "uploading" }
    | { kind: "saved" }
    | { kind: "error"; message: string };
}) {
  if (status.kind === "saved") {
    return <span className="text-xs text-primary">Saved.</span>;
  }
  if (status.kind === "error") {
    return <span className="text-xs text-destructive">{status.message}</span>;
  }
  return <span className="text-xs text-muted-foreground" />;
}
