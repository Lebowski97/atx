"use client";

import type { Doc } from "../../../../convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import { StatusSelect } from "@/components/status-select";
import type { OrderStatus } from "@/components/order-types";

export function OrderDetail({
  order,
  onStatusChange,
}: {
  order: Doc<"orders">;
  onStatusChange: (status: OrderStatus) => Promise<null> | void;
}) {
  return (
    <div className="flex flex-col gap-3 bg-muted/30 px-4 py-3 sm:px-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailSection label="Phone">{order.phoneNumber}</DetailSection>
        <DetailSection label="Delivery">
          <span className="capitalize">{order.deliveryType}</span>
          {" \u00b7 "}
          {order.deliveryTime}
        </DetailSection>
      </div>

      <DetailSection label="Items">
        <div className="whitespace-pre-wrap">{order.items}</div>
      </DetailSection>

      {order.address && (
        <DetailSection label="Address">{order.address}</DetailSection>
      )}

      {order.notes && (
        <DetailSection label="Notes">{order.notes}</DetailSection>
      )}

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Update status</span>
        <StatusSelect
          currentStatus={order.status as OrderStatus}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}

function DetailSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-0.5 text-[0.625rem] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </div>
      <div className="text-xs/relaxed">{children}</div>
    </div>
  );
}
