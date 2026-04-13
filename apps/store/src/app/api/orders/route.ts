import { NextRequest, NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import { getStorefrontServerSecret } from "../../../lib/storefront-server";
import {
  STOREFRONT_SESSION_COOKIE_NAME,
  verifyStorefrontSessionToken,
} from "../../../lib/storefront-session";

type OrderRequestBody = {
  name?: unknown;
  phoneNumber?: unknown;
  address?: unknown;
  items?: unknown;
  deliveryType?: unknown;
  deliveryTime?: unknown;
  notes?: unknown;
};

function readRequiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }
  return value.trim();
}

function readOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: NextRequest) {
  const sessionToken =
    request.cookies.get(STOREFRONT_SESSION_COOKIE_NAME)?.value;

  if (!(await verifyStorefrontSessionToken(sessionToken))) {
    const response = NextResponse.json(
      { error: "Your store session has expired. Please enter the passcode again." },
      { status: 401 },
    );
    response.cookies.delete(STOREFRONT_SESSION_COOKIE_NAME);
    return response;
  }

  let body: OrderRequestBody;
  try {
    body = (await request.json()) as OrderRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
  }

  try {
    await fetchMutation(api.orders.createOrder, {
      name: readRequiredString(body.name, "Name"),
      phoneNumber: readRequiredString(body.phoneNumber, "Phone number"),
      address: readRequiredString(body.address, "Address"),
      items: readRequiredString(body.items, "Items"),
      deliveryType:
        typeof body.deliveryType === "string" ? body.deliveryType.trim() : "delivery",
      deliveryTime: typeof body.deliveryTime === "string" ? body.deliveryTime.trim() : "",
      notes: readOptionalString(body.notes),
      storefrontSecret: getStorefrontServerSecret(),
    });
  } catch (error) {
    if (error instanceof Error && error.message.endsWith("is required.")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create order", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
