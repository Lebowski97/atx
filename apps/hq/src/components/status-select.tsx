"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUSES, STATUS_LABELS, type OrderStatus } from "@/components/order-types";

export function StatusSelect({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => Promise<null> | void;
}) {
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  function handleSelectChange(value: string) {
    const next = value as OrderStatus;
    if (next === currentStatus) {
      setPendingStatus(null);
      return;
    }
    setPendingStatus(next);
  }

  async function confirmStatusChange() {
    if (!pendingStatus) return;
    await onStatusChange(pendingStatus);
    setPendingStatus(null);
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={pendingStatus ?? currentStatus}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="h-8 w-36">
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
      {pendingStatus && (
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="default"
            className="h-7 w-7"
            onClick={confirmStatusChange}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => setPendingStatus(null)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
