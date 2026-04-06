"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const DEFAULT_FROM = "orders@tinytreesatx.com";
const DEFAULT_ORDER_TO = "joseph@tinytreesfarm.com";

export const sendOrderNotification = internalAction({
  args: {
    orderId: v.id("orders"),
    name: v.string(),
    phoneNumber: v.string(),
    items: v.string(),
    deliveryTime: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY is not set. Add it under Settings → Environment Variables in the Convex dashboard.",
      );
    }

    const from = process.env.RESEND_FROM?.trim() || DEFAULT_FROM;
    const to =
      process.env.RESEND_ORDER_TO?.trim() ||
      process.env.RESEND_TO?.trim() ||
      DEFAULT_ORDER_TO;

    const resend = new Resend(apiKey);
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
    });

    const deliveryTimeRow = args.deliveryTime
      ? `<tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Time:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(args.deliveryTime)}</td>
        </tr>`
      : "";

    const notesRow = args.notes
      ? `<tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Notes:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(args.notes)}</td>
        </tr>`
      : "";

    const orderIdStr = String(args.orderId);

    const html = `
      <h2>New Order Received</h2>
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h3>Order Details:</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Order ID:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(orderIdStr)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Customer Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(args.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone Number:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(args.phoneNumber)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Items:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(args.items)}</td>
          </tr>
          ${deliveryTimeRow}
          ${notesRow}
        </table>
        <p style="margin-top: 20px; color: #666;">Order submitted at: ${timestamp}</p>
      </div>
    `;

    const textLines = [
      "New Order Received - Tiny Trees ATX",
      "",
      `Order ID: ${orderIdStr}`,
      `Customer Name: ${args.name}`,
      `Phone Number: ${args.phoneNumber}`,
      `Items: ${args.items}`,
      ...(args.deliveryTime ? [`Preferred Time: ${args.deliveryTime}`] : []),
      ...(args.notes ? [`Notes: ${args.notes}`] : []),
      "",
      `Order submitted at: ${timestamp}`,
    ];
    const text = textLines.join("\n");

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `New Order Received - Tiny Trees ATX (${orderIdStr})`,
      html,
      text,
    });
    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }
    console.log(
      `Resend order email sent: resendId=${data?.id ?? "?"} orderId=${orderIdStr} to=${to}`,
    );
  },
});
