"use client";

import { useState } from "react";
import Image from "next/image";
import { useActionState } from "react";
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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
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
            className="w-full bg-foreground text-background hover:bg-foreground/80 font-medium py-3"
          >
            {isPending ? "Checking..." : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
