import type { IdentificationResult } from '../types';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export async function identifyMushroom(imageFile: File): Promise<IdentificationResult> {
  const base64Image = await fileToBase64(imageFile);

  const response = await fetch(
    "https://mycolens-proxy.sporensprout.workers.dev/identify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: base64Image,
        mimeType: imageFile.type
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    // Use the error from the worker if available, otherwise provide a generic message.
    const errorMessage = errorText || "Identification request failed with status: " + response.status;
    throw new Error(errorMessage);
  }

  return await response.json();
}
