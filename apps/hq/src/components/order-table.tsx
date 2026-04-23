"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderRow } from "@/components/order-row";
import { EmptyState } from "@/components/empty-state";
import {
  STATUSES,
  STATUS_LABELS,
  type StatusFilter,
} from "@/components/order-types";

function StatChip({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <dl className="flex items-baseline gap-1.5">
      <dd
        className={
          accent
            ? "text-lg font-semibold text-primary tabular-nums"
            : "text-lg font-semibold text-foreground tabular-nums"
        }
      >
        {value}
      </dd>
      <dt className="text-xs text-muted-foreground">{label}</dt>
    </dl>
  );
}

function ScrollHintWrapper({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollWidth - el.scrollLeft - el.clientWidth > 1);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  return (
    <div className="relative -mx-4 sm:mx-0">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="overflow-x-auto px-4 sm:px-0"
      >
        {children}
      </div>
      {canScrollRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/80 to-transparent sm:hidden" />
      )}
    </div>
  );
}

function OrderTableSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-l-[3px] border-l-transparent px-3 py-3 sm:px-4"
        >
          <div className="h-3.5 w-3.5 shrink-0" />
          <div className="flex w-16 shrink-0 flex-col gap-1 sm:w-20">
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-10 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-3 w-28 flex-1 animate-pulse rounded bg-muted" />
          <div className="hidden h-3 w-16 animate-pulse rounded bg-muted sm:block" />
          <div className="hidden h-3 w-32 animate-pulse rounded bg-muted lg:block" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function OrderTable() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const allOrders = useQuery(api.orders.listOrders, {});
  const filteredOrders = useQuery(
    api.orders.listOrders,
    statusFilter === "all" ? "skip" : { status: statusFilter },
  );

  const orders = statusFilter === "all" ? allOrders : filteredOrders;

  const stats = useMemo(() => {
    if (!allOrders)
      return { todayCount: 0, pendingCount: 0, preparingCount: 0, readyCount: 0 };
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startMs = startOfToday.getTime();
    let todayCount = 0;
    let pendingCount = 0;
    let preparingCount = 0;
    let readyCount = 0;
    for (const o of allOrders) {
      if (o.createdAt >= startMs) todayCount++;
      if (o.status === "pending") pendingCount++;
      if (o.status === "preparing") preparingCount++;
      if (o.status === "ready") readyCount++;
    }
    return { todayCount, pendingCount, preparingCount, readyCount };
  }, [allOrders]);

  return (
    <div className="flex flex-1 flex-col">
      {/* Stats bar */}
      <div className="flex items-center gap-4 border-b border-border bg-card/20 px-4 py-2.5 sm:px-6">
        <StatChip label="Today" value={stats.todayCount} />
        <Separator orientation="vertical" className="h-6" />
        <StatChip
          label="Pending"
          value={stats.pendingCount}
          accent={stats.pendingCount > 0}
        />
        <StatChip
          label="Preparing"
          value={stats.preparingCount}
          accent={stats.preparingCount > 0}
        />
        <StatChip label="Ready" value={stats.readyCount} />
      </div>

      {/* Filter tabs */}
      <div className="border-b border-border bg-card/10 px-4 py-2.5 sm:px-6">
        <ScrollHintWrapper>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {STATUSES.map((s) => (
                <TabsTrigger key={s} value={s}>
                  {STATUS_LABELS[s]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </ScrollHintWrapper>
      </div>

      {/* Order rows */}
      <main className="flex-1">
        {orders === undefined ? (
          <OrderTableSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders to show"
            description={
              statusFilter === "all"
                ? "New orders will appear here in real time."
                : `No orders with status \u201c${STATUS_LABELS[statusFilter]}\u201d.`
            }
          />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {orders.map((order, i) => (
              <OrderRow
                key={order._id}
                order={order}
                style={{ animationDelay: `${i * 30}ms` }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
