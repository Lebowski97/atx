"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "completed",
] as const;

type OrderStatus = (typeof STATUSES)[number];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  delivered: "Delivered",
  completed: "Completed",
};

const STATUS_BADGE_VARIANT: Record<
  OrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "destructive",
  confirmed: "secondary",
  preparing: "secondary",
  ready: "default",
  delivered: "outline",
  completed: "outline",
};

type StatusFilter = "all" | OrderStatus;

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const orders = useQuery(
    api.orders.listOrders,
    statusFilter === "all" ? {} : { status: statusFilter },
  );
  const updateStatus = useMutation(api.orders.updateOrderStatus);

  const stats = useMemo(() => {
    if (!orders) return { todayCount: 0, pendingCount: 0 };
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startMs = startOfToday.getTime();
    let todayCount = 0;
    let pendingCount = 0;
    for (const o of orders) {
      if (o.createdAt >= startMs) todayCount++;
      if (o.status === "pending") pendingCount++;
    }
    return { todayCount, pendingCount };
  }, [orders]);

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/40 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex flex-1 items-center gap-4 sm:gap-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Tiny Trees HQ
            </h1>
            <p className="text-xs text-muted-foreground">Order management</p>
          </div>
          <Separator orientation="vertical" className="hidden h-10 sm:block" />
          <div className="flex items-center gap-3">
            <StatChip label="Today" value={stats.todayCount} />
            <StatChip
              label="Pending"
              value={stats.pendingCount}
              accent={stats.pendingCount > 0}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/settings">Settings</Link>
          </Button>
          <SignOutButton>
            <Button variant="outline" size="sm">
              Sign out
            </Button>
          </SignOutButton>
        </div>
      </header>

      <div className="border-b border-border bg-card/20 px-4 py-3 sm:px-6">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
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
        </div>
      </div>

      <main className="flex-1 px-4 py-6 sm:px-6">
        {orders === undefined ? (
          <p className="text-sm text-muted-foreground">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm font-medium">No orders to show</p>
            <p className="text-xs text-muted-foreground">
              {statusFilter === "all"
                ? "New orders will appear here in real time."
                : `No orders with status "${STATUS_LABELS[statusFilter]}".`}
            </p>
          </div>
        ) : (
          <ul className="mx-auto flex max-w-3xl flex-col gap-3">
            {orders.map((order) => (
              <li key={order._id}>
                <OrderCard
                  order={order}
                  onStatusChange={(status) =>
                    updateStatus({ orderId: order._id, status })
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

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
    <div className="flex items-baseline gap-1.5">
      <span
        className={
          accent
            ? "text-lg font-semibold text-primary"
            : "text-lg font-semibold text-foreground"
        }
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Doc<"orders">;
  onStatusChange: (status: OrderStatus) => Promise<null> | void;
}) {
  const [expanded, setExpanded] = useState(false);
  const created = new Date(order.createdAt);
  const createdLabel = created.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const status = order.status as OrderStatus;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{order.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {order.phoneNumber}
            </span>
          </div>
          <Badge variant={STATUS_BADGE_VARIANT[status] ?? "outline"}>
            {STATUS_LABELS[status] ?? status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="capitalize">{order.deliveryType}</span>
          <span aria-hidden>·</span>
          <span>{order.deliveryTime}</span>
          <span aria-hidden>·</span>
          <span>{createdLabel}</span>
        </div>

        <Separator />

        <div>
          <div className="mb-1 text-[0.625rem] font-medium tracking-wider text-muted-foreground uppercase">
            Items
          </div>
          <div
            className={
              expanded
                ? "whitespace-pre-wrap text-xs/relaxed"
                : "line-clamp-2 whitespace-pre-wrap text-xs/relaxed"
            }
          >
            {order.items}
          </div>
          {order.items.length > 80 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs text-primary underline-offset-4 hover:underline"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {order.address && (
          <div>
            <div className="mb-1 text-[0.625rem] font-medium tracking-wider text-muted-foreground uppercase">
              Address
            </div>
            <div className="text-xs/relaxed">{order.address}</div>
          </div>
        )}

        {order.notes && (
          <div>
            <div className="mb-1 text-[0.625rem] font-medium tracking-wider text-muted-foreground uppercase">
              Notes
            </div>
            <div className="text-xs/relaxed">{order.notes}</div>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Update status</span>
          <Select
            value={status}
            onValueChange={(v) => void onStatusChange(v as OrderStatus)}
          >
            <SelectTrigger className="h-8 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
