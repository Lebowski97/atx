"use client";

import { useState } from "react";
import Image from "next/image";
import { useActionState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { validateAndSetCookie } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PasscodePage() {
  const [showPasscode, setShowPasscode] = useState(false);
  const [state, formAction, isPending] = useActionState(
    validateAndSetCookie,
    null
  );

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Image
              src="/name_logo.png"
              alt="Tiny Trees ATX"
              width={120}
              height={120}
              priority
              className="drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-light tracking-wide">Welcome!</h1>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="passcode"
              className="text-sm font-medium text-muted-foreground"
            >
              Enter Passcode
            </label>
            <div className="relative">
              <Input
                id="passcode"
                type={showPasscode ? "text" : "password"}
                name="passcode"
                placeholder="••••••"
                autoComplete="off"
                autoFocus
                required
                className="bg-muted/50 border-border text-foreground placeholder-muted-foreground text-center text-lg tracking-widest px-12"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasscode ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-medium py-3"
            size="lg"
          >
            {isPending ? "Checking..." : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
