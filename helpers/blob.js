/**
 * Converts blob data into a data URL.
 * @param {Blob} blob `Blob` data object.
 * @returns Data URL encoded as `Base64.`
 */
export default async function toDataUrl(blob) {
  const header = 'data:image/png;base64,';

  const buffer = Buffer.from(await blob.arrayBuffer());
  const data = buffer.toString('base64');

  return header + data;
}
