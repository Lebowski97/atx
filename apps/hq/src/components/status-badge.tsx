"use client";

import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/components/order-types";

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

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant={STATUS_BADGE_VARIANT[status] ?? "outline"}
      className="transition-colors duration-200"
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
