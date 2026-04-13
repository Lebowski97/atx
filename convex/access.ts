import type { MutationCtx, QueryCtx } from "./_generated/server";

type AuthCtx = Pick<QueryCtx, "auth"> | Pick<MutationCtx, "auth">;

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function getEnvSet(
  name: string,
  normalize: (value: string) => string = (value) => value,
) {
  const value = process.env[name]?.trim();
  if (!value) {
    return new Set<string>();
  }

  return new Set(
    value
      .split(",")
      .map((entry) => normalize(entry.trim()))
      .filter(Boolean),
  );
}

export async function requireAdmin(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const adminIdentifiers = getEnvSet("HQ_ADMIN_IDENTIFIERS");
  if (adminIdentifiers.has(identity.tokenIdentifier)) {
    return identity;
  }

  const email = identity.email?.trim().toLowerCase();
  const adminEmails = getEnvSet("HQ_ADMIN_EMAILS", (value) =>
    value.toLowerCase(),
  );

  if (adminEmails.size === 0 && adminIdentifiers.size === 0) {
    throw new Error(
      "HQ_ADMIN_IDENTIFIERS or HQ_ADMIN_EMAILS must be configured",
    );
  }

  if (!email || !adminEmails.has(email)) {
    throw new Error("Not authorized");
  }

  return identity;
}

export function requireStorefrontServerSecret(secret: string) {
  const expectedSecret = getRequiredEnv("STOREFRONT_SERVER_SECRET");
  if (secret !== expectedSecret) {
    throw new Error("Not authorized");
  }
}
