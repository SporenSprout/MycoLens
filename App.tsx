import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Disclaimer } from './components/Disclaimer';
import { RateLimitMessage } from './components/RateLimitMessage';
import { identifyMushroom } from './services/geminiService';
import type { IdentificationResult } from './types';

const MAX_REQUESTS = 5; // Simulate a free daily limit

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResult(null); // Reset result when a new image is uploaded
      setError(null);
    };
    reader.onerror = () => {
        setError("Failed to read the image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleIdentify = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    
    if (requestCount >= MAX_REQUESTS) {
      setError("You have reached your free identification limit for today. Please try again tomorrow.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const identifiedResult = await identifyMushroom(imageFile);
      setResult(identifiedResult);
      setRequestCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Could not identify the mushroom. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, requestCount]);

  const handleReset = () => {
    setImage(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const isRateLimited = requestCount >= MAX_REQUESTS;

  return (
    <div className="min-h-screen bg-dark-bg font-sans text-light-text flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8 bg-black/30 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-neon-cyan/30 shadow-neon-cyan/20">
          <Disclaimer />

          {!image ? (
            <ImageUploader onImageUpload={handleImageUpload} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-md border-2 border-neon-cyan/50 shadow-neon-cyan">
                <img src={image} alt="Mushroom upload" className="object-cover w-full h-auto" />
                {isLoading && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 overflow-hidden">
                        <div className="absolute left-0 w-full h-1 bg-neon-cyan/70 shadow-[0_0_10px_theme(colors.neon-cyan)] animate-scan-light"></div>
                    </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            {image && !isLoading && !result && (
              <button
                onClick={handleIdentify}
                disabled={isLoading || isRateLimited}
                className="w-full sm:w-auto bg-transparent text-neon-pink font-bold py-3 px-8 rounded-full border-2 border-neon-pink hover:bg-neon-pink/20 transition-all duration-300 ease-in-out shadow-neon-pink transform hover:scale-105 disabled:border-gray-600 disabled:text-gray-600 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              >
                Identify Mushroom
              </button>
            )}

            {image && (
                <button
                onClick={handleReset}
                className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 bg-transparent text-neon-cyan font-semibold py-3 px-6 rounded-full border-2 border-neon-cyan hover:bg-neon-cyan/20 transition-colors"
                >
                Upload New Photo
                </button>
            )}
          </div>
          
          {isLoading && <Loader />}
          
          {error && !isLoading && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg text-center shadow-neon-red">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {isRateLimited && <RateLimitMessage />}

          {result && !isLoading && <ResultDisplay result={result} />}

        </main>
         <footer className="text-center mt-8 text-sm text-gray-400 flex flex-col items-center gap-4">
            <div>
              <p>MycoLens identifications are for educational purposes only.</p>
              <p>Free uses remaining today: {Math.max(0, MAX_REQUESTS - requestCount)}</p>
            </div>
            <a
              href="https://www.paypal.com/ncp/payment/64QAX8H8N3M7E"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-transparent text-neon-yellow font-bold py-2 px-6 rounded-full border-2 border-neon-yellow hover:bg-neon-yellow/20 transition-all duration-300 ease-in-out shadow-neon-yellow transform hover:scale-105"
            >
              Donate ❤️
            </a>
        </footer>
      </div>
    </div>
  );
}