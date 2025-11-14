import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="p-4 mb-6 bg-yellow-900/50 border-l-4 border-yellow-400 text-yellow-200 rounded-r-lg shadow-neon-yellow/50">
      <h3 className="font-bold">Safety First!</h3>
      <p className="text-sm">
        This tool is for educational purposes only. It can make mistakes.
        <strong> Never eat a wild mushroom based on an app identification.</strong> Many poisonous mushrooms look like edible ones.
        When in doubt, throw it out.
      </p>
    </div>
  );
};
