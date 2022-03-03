export async function toDataUrl(blob) {
  // create a data url from blob.
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = () => {
      reject(fileReader.error.message);
    };

    fileReader.readAsDataURL(blob);
  });
}

export async function fetchFromUri(uri) {
  // gets blob data from image uri.
  const response = await fetch(uri);
  return response.blob();
}
