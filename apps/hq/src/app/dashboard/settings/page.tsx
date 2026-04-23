"use client";

import { SettingsPanel } from "@/components/settings-panel";

export default function SettingsPage() {
  return (
    <main className="flex-1 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SettingsPanel />
      </div>
    </main>
  );
}
