"use client";

import { PasscodeForm } from "@/components/settings/passcode-form";
import { StoreInfoForm } from "@/components/settings/store-info-form";
import { MenuUpload } from "@/components/settings/menu-upload";

export function SettingsPanel() {
  return (
    <div className="flex flex-col gap-6">
      <MenuUpload />
      <PasscodeForm />
      <StoreInfoForm />
    </div>
  );
}
