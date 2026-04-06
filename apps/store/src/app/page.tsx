"use client";

import Image from "next/image";
import { useActionState } from "react";
import { validateAndSetCookie } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PasscodePage() {
  const [state, formAction, isPending] = useActionState(
    validateAndSetCookie,
    null
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
      <Image
        src="/name_logo.png"
        alt="Tiny Trees ATX"
        width={280}
        height={80}
        priority
        className="h-auto w-[280px]"
      />
      <form action={formAction} className="flex w-full max-w-xs flex-col gap-4">
        <Input
          type="password"
          name="passcode"
          placeholder="Enter passcode"
          autoComplete="off"
          autoFocus
          required
        />
        {state?.error && (
          <p className="text-sm text-center text-destructive">{state.error}</p>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Checking..." : "Enter"}
        </Button>
      </form>
    </div>
  );
}
