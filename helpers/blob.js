/**
 * Create a data URL from `Blob`.
 * @param {Blob} blob `Blob` data object.
 * @returns A URL representing the `Blob` data.
 */
export default async function toDataUrl(blob) {
  return URL.createObjectURL(blob);
}
