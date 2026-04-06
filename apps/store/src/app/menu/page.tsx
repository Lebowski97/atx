"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function MenuPage() {
  const menuImageUrl = useQuery(api.files.getMenuImageUrl);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      {/* Header info section */}
      <div className="w-full max-w-md text-center space-y-3 mt-4 mb-8">
        <div className="bg-card rounded-lg p-4 space-y-2 text-sm">
          <p className="font-semibold">[Open Monday - Sunday]</p>
          <p>Deliveries by appointment</p>
          <p className="font-semibold">
            *6pm cutoff for same day delivery*
          </p>
          <p>$50 minimum order</p>
          <p className="font-semibold">-CASH PREFERRED-</p>
        </div>
        <div className="rounded-lg p-4 space-y-2 text-sm">
          <Button size="lg" asChild className="w-full font-semibold text-lg">
            <Link href="/order">Place Order</Link>
          </Button>
        </div>
      </div>

      {/* Menu image section */}
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
      <div className="mt-8" />
    </div>
  );
}
