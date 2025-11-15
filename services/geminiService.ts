import type { IdentificationResult } from '../types';

/* Convert file to base64 */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to read image file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* Custom error class */
export type MycoLensErrorCode =
  | "BAD_INPUT"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "NETWORK"
  | "UNKNOWN";

export class MycoLensError extends Error {
  code: MycoLensErrorCode;
  constructor(code: MycoLensErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

/* Identify Mushroom */
export async function identifyMushroom(imageFile: File): Promise<IdentificationResult> {
  let base64Image: string;

  try {
    base64Image = await fileToBase64(imageFile);
  } catch {
    throw new MycoLensError(
      "BAD_INPUT",
      "We couldn't read that photo. Try a clear close-up picture of a single mushroom."
    );
  }

  try {
    const response = await fetch(
      "https://mycolens-proxy.sporensprout.workers.dev/identify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: imageFile.type,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 400) {
        throw new MycoLensError(
          "BAD_INPUT",
          "We couldn't understand this image. Try a sharper photo with the mushroom centered."
        );
      }

      if (response.status === 429) {
        throw new MycoLensError(
          "RATE_LIMITED",
          "There's a lot of activity right now. Please wait a moment and try again."
        );
      }

      if (response.status === 503 || response.status >= 500) {
        throw new MycoLensError(
          "SERVICE_UNAVAILABLE",
          "The server is a little busy at the moment. Please try again shortly."
        );
      }

      const txt = await response.text();
      throw new MycoLensError(
        "UNKNOWN",
        txt || `Unexpected error (status ${response.status}). Please try again.`
      );
    }

    return (await response.json()) as IdentificationResult;
  } catch (err: any) {
    if (err instanceof MycoLensError) throw err;

    if (err?.name === "TypeError") {
      throw new MycoLensError(
        "NETWORK",
        "We're having trouble connecting. Check your internet connection and try again."
      );
    }

    throw new MycoLensError(
      "UNKNOWN",
      "Something went wrong. Please try again in a moment."
    );
  }
}

