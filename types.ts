export interface AlternateGuess {
  name: string;
  scientificName: string;
  confidence: number; // 0–1
}

export interface IdentificationResult {
  name: string;
  scientificName: string;
  confidence: number; // 0–1
  disclaimer: string;
  summary: string;

  // New field (optional so nothing breaks)
  alternates?: AlternateGuess[];
}
