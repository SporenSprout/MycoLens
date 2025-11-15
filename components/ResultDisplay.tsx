import React from 'react';
import type { IdentificationResult, AlternateGuess } from '../types';

interface ResultDisplayProps {
  result: IdentificationResult;
}

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  const percentage = Math.round(score * 100);
  let barColor = 'bg-red-500 shadow-[0_0_4px_#f00]';

  if (percentage >= 75) {
    barColor = 'bg-green-500 shadow-[0_0_6px_theme(colors.neon-green)]';
  } else if (percentage >= 40) {
    barColor = 'bg-yellow-400 shadow-[0_0_5px_#ff0]';
  }

  return (
    <div className="w-full bg-gray-700 rounded-full h-4 my-2">
      <div
        className={`${barColor} h-4 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const confidencePercentage = (result.confidence * 100).toFixed(1);

  return (
    <div className="mt-6 p-6 bg-black/20 border border-neon-green/50 rounded-xl animate-fade-in shadow-neon-green">

      {/* Primary Species Name */}
      <h2 className="text-2xl font-bold text-center text-light-text [filter:drop-shadow(0_0_3px_theme(colors.neon-green))]">
        {result.name}
      </h2>

      {/* Scientific Name */}
      <p className="mt-2 text-center text-neon-cyan text-sm italic">
        {result.scientificName}
      </p>

      {/* Summary */}
      {result.summary && (
        <div className="mt-4 text-left border-t border-neon-green/20 pt-4">
          <h3 className="text-lg font-semibold text-neon-cyan [filter:drop-shadow(0_0_2px_theme(colors.neon-cyan))]">
            Summary
          </h3>
          <p className="mt-1 text-gray-300 text-sm leading-relaxed">{result.summary}</p>
        </div>
      )}

      {/* Confidence */}
      <div className="mt-5">
        <div className="flex justify-between items-center font-semibold text-sm">
          <span>Confidence Score</span>
          <span>{confidencePercentage}%</span>
        </div>
        <ConfidenceBar score={result.confidence} />
      </div>


      {/* ===================== */}
      {/*   ALTERNATE GUESSES   */}
      {/* ===================== */}

      {result.alternates && result.alternates.length > 0 && (
        <div className="mt-8 border-t border-neon-green/20 pt-5">
          <h3 className="text-lg font-bold text-neon-yellow [filter:drop-shadow(0_0_3px_theme(colors.neon-yellow))] mb-3">
            Other Possible Matches
          </h3>

          {result.alternates.map((alt: AlternateGuess, index: number) => (
            <div
              key={index}
              className="mb-5 p-4 bg-black/30 border border-neon-yellow/40 rounded-lg shadow-neon-yellow/20"
            >
              <p className="text-lg font-semibold text-neon-yellow">
                {alt.name}
              </p>
              <p className="text-sm italic text-neon-cyan">
                {alt.scientificName}
              </p>

              <div className="mt-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Confidence</span>
                  <span>{Math.round(alt.confidence * 100)}%</span>
                </div>
                <ConfidenceBar score={alt.confidence} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning */}
      <div className="mt-6 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-200">
        <p className="font-bold text-lg">CRITICAL WARNING</p>
        <p className="mt-1">{result.disclaimer}</p>
      </div>
    </div>
  );
};
