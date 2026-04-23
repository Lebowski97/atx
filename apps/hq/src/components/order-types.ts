export const STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "completed",
] as const;

export type OrderStatus = (typeof STATUSES)[number];

export type StatusFilter = "all" | OrderStatus;

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  delivered: "Delivered",
  completed: "Completed",
};

export const STATUS_BORDER_COLORS: Record<OrderStatus, string> = {
  pending: "border-l-[var(--status-pending)]",
  confirmed: "border-l-[var(--status-confirmed)]",
  preparing: "border-l-[var(--status-preparing)]",
  ready: "border-l-[var(--status-ready)]",
  delivered: "border-l-[var(--status-delivered)]",
  completed: "border-l-[var(--status-completed)]",
};
