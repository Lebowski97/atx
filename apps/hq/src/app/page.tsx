"use client";

import { SignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <AuthLoading>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </AuthLoading>
      <Authenticated>
        <RedirectToDashboard />
      </Authenticated>
      <Unauthenticated>
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-sm space-y-4">
            <div className="text-center">
              <h1 className="text-xl font-semibold">Tiny Trees HQ</h1>
              <p className="text-sm text-muted-foreground">Admin sign in</p>
            </div>
            <SignIn
              routing="hash"
              signUpUrl={undefined}
              forceRedirectUrl="/dashboard"
            />
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}

function RedirectToDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}
