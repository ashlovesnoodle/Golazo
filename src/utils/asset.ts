export function sanitizeAsset(path: string) {
  try {
    return encodeURI(path);
  } catch {
    return path;
  }
}
