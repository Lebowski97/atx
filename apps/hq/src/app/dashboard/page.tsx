"use client";

import { Authenticated, AuthLoading } from "convex/react";
import { OrderTable } from "@/components/order-table";

export default function DashboardPage() {
  return (
    <>
      <AuthLoading>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </AuthLoading>
      <Authenticated>
        <OrderTable />
      </Authenticated>
    </>
  );
}
