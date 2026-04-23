"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { OrderDetail } from "@/components/order-detail";
import {
  STATUS_BORDER_COLORS,
  STATUSES,
  STATUS_LABELS,
  type OrderStatus,
} from "@/components/order-types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUSES.indexOf(current);
  if (idx < 0 || idx >= STATUSES.length - 1) return null;
  return STATUSES[idx + 1];
}

export function OrderRow({
  order,
  style,
}: {
  order: Doc<"orders">;
  style?: React.CSSProperties;
}) {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useMutation(api.orders.updateOrderStatus);
  const status = order.status as OrderStatus;
  const nextStatus = getNextStatus(status);

  const created = new Date(order.createdAt);
  const timeLabel = created.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const dateLabel = created.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="animate-[fade-in-up_0.2s_ease-out_both]"
      style={style}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        className={cn(
          "flex w-full items-center gap-3 border-l-[3px] px-3 py-2.5 text-left transition-colors hover:bg-muted/50 sm:px-4",
          STATUS_BORDER_COLORS[status] ?? "border-l-transparent"
        )}
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
            expanded && "rotate-90"
          )}
        />

        {/* Time */}
        <div className="flex w-16 shrink-0 flex-col text-xs sm:w-20">
          <span className="font-medium tabular-nums">{timeLabel}</span>
          <span className="text-[0.625rem] text-muted-foreground">
            {dateLabel}
          </span>
        </div>

        {/* Name */}
        <div className="min-w-0 flex-1">
          <span className="truncate text-sm font-medium">{order.name}</span>
        </div>

        {/* Type — hidden on mobile */}
        <div className="hidden w-20 shrink-0 text-xs text-muted-foreground capitalize sm:block">
          {order.deliveryType}
        </div>

        {/* Items preview — hidden on mobile */}
        <div className="hidden w-40 shrink-0 truncate text-xs text-muted-foreground lg:block">
          {order.items.split("\n")[0]}
        </div>

        {/* Status badge */}
        <div className="shrink-0">
          <StatusBadge status={status} />
        </div>

        {/* Quick advance — hidden on mobile */}
        {nextStatus && (
          <div className="hidden shrink-0 sm:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus({ orderId: order._id, status: nextStatus });
                  }}
                >
                  {STATUS_LABELS[nextStatus]}
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Advance to {STATUS_LABELS[nextStatus]}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {expanded && (
        <OrderDetail
          order={order}
          onStatusChange={(s) =>
            updateStatus({ orderId: order._id, status: s })
          }
        />
      )}
    </div>
  );
}
