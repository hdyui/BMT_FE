const allowedRemoteImageHosts = new Set([
  "res.cloudinary.com",
  "bmt-deploy-latest.onrender.com",
]);

export function isSafeAdminImageSrc(value: string) {
  const src = value.trim();
  if (!src) return false;

  if (
    src.startsWith("/") ||
    src.startsWith("data:image/") ||
    src.startsWith("blob:")
  ) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "https:" && allowedRemoteImageHosts.has(url.hostname);
  } catch {
    return false;
  }
}
