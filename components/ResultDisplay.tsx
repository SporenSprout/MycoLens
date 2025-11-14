import React from 'react';
import type { IdentificationResult } from '../types';

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
        <h2 className="text-2xl font-bold text-center text-light-text [filter:drop-shadow(0_0_3px_theme(colors.neon-green))]">{result.name}</h2>
        
        {result.summary && (
             <div className="mt-4 text-left border-t border-neon-green/20 pt-4">
                <h3 className="text-lg font-semibold text-neon-cyan [filter:drop-shadow(0_0_2px_theme(colors.neon-cyan))]">Summary</h3>
                <p className="mt-1 text-gray-300 text-sm leading-relaxed">{result.summary}</p>
            </div>
        )}

        <div className="mt-5">
            <div className="flex justify-between items-center font-semibold text-sm">
                <span>Confidence Score</span>
                <span>{confidencePercentage}%</span>
            </div>
            <ConfidenceBar score={result.confidence} />
        </div>

        <div className="mt-6 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-200">
            <p className="font-bold text-lg">CRITICAL WARNING</p>
            <p className="mt-1">{result.disclaimer}</p>
        </div>
    </div>
  );
};