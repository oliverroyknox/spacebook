export async function toDataUrl(blob) {
  // create a data url from blob.
  return URL.createObjectURL(blob);
}

export async function fetchFromUri(uri) {
  // gets blob data from image uri.
  const response = await fetch(uri);
  return response.blob();
}
