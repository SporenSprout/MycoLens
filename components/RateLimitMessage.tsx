import React from 'react';

export const RateLimitMessage: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-blue-900/50 border border-neon-cyan/80 text-cyan-200 rounded-lg text-center shadow-neon-cyan/50">
      <p className="font-semibold">Free Limit Reached</p>
      <p className="text-sm mt-1">
        You've used all your free identifications for today. This limit ensures MycoLens can remain free for everyone. Please come back tomorrow!
      </p>
    </div>
  );
};