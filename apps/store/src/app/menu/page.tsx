"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function MenuPage() {
  const menuImageUrl = useQuery(api.files.getMenuImageUrl);
  const storeInfo = useQuery(api.settings.getStoreInfo);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 pb-12 md:p-8 md:pb-12">
      <div className="w-full max-w-md text-center space-y-4 mt-4 mb-8">
        <div className="flex justify-center">
          <Image
            src="/name_logo.png"
            alt="Tiny Trees ATX"
            width={100}
            height={100}
            priority
            className="drop-shadow-lg"
          />
        </div>

        {storeInfo !== undefined && storeInfo && (
          <div className="bg-card rounded-lg p-4 text-sm whitespace-pre-line leading-relaxed">
            {storeInfo}
          </div>
        )}

        <Button size="lg" asChild className="w-full font-semibold text-lg">
          <Link href="/order">Place Order</Link>
        </Button>
      </div>

      <div className="w-full max-w-4xl flex justify-center">
        <div className="relative w-full max-w-3xl">
          {menuImageUrl === undefined ? (
            <div className="w-full aspect-square rounded-lg bg-card animate-pulse" />
          ) : menuImageUrl ? (
            <Image
              src={menuImageUrl}
              alt="Tiny Trees ATX Menu"
              width={800}
              height={800}
              className="w-full h-auto rounded-lg shadow-lg border border-border"
              priority
            />
          ) : (
            <div className="w-full aspect-square rounded-lg bg-card flex items-center justify-center">
              <p className="text-muted-foreground">
                Menu image not available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
