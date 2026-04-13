export function getStorefrontServerSecret() {
  const secret = process.env.STOREFRONT_SERVER_SECRET?.trim();
  if (!secret) {
    throw new Error("STOREFRONT_SERVER_SECRET is not configured");
  }
  return secret;
}
