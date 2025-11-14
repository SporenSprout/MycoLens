import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center my-8">
            <p className="mt-4 text-neon-green font-semibold text-lg animate-pulse [filter:drop-shadow(0_0_4px_theme(colors.neon-green))]">
                ANALYZING...
            </p>
        </div>
    );
};