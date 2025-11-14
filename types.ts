
export interface IdentificationResult {
  name: string;
  confidence: number; // A value between 0 and 1
  disclaimer: string;
  summary: string;
}