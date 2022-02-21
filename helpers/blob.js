/**
 * Create a data URL from `Blob`.
 * @param {Blob} blob `Blob` data object.
 * @returns A URL representing the `Blob` data.
 */
export async function toDataUrl(blob) {
	return URL.createObjectURL(blob);
}

/**
 * Fetch an image `Blob` from a URI.
 * @param {string} uri URI of image.
 * @returns `Blob` data of image.
 */
export async function fetchFromUri(uri) {
	const response = await fetch(uri);
	return response.blob();
}
