"use client";

import { useState } from "react";
import Image from "next/image";
import { SignOutButton } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SettingsPanel } from "@/components/settings-panel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col bg-background">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/40 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/name_logo.png"
              alt="Tiny Trees"
              width={100}
              height={28}
              className="drop-shadow-lg"
              style={{ height: "1.75rem", width: "auto" }}
              priority
            />
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
              <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                </SheetHeader>
                <div className="px-2 pb-6">
                  <SettingsPanel />
                </div>
              </SheetContent>
            </Sheet>
            <SignOutButton>
              <Button variant="outline" size="sm">
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </header>

        {children}
      </div>
    </TooltipProvider>
  );
}
