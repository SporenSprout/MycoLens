import React from 'react';

const MushroomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neon-green [filter:drop-shadow(0_0_5px_theme(colors.neon-green))]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.95,13.5A7.05,7.05,0,0,0,13,12.06V7A5,5,0,0,0,8,2H8A5,5,0,0,0,3,7V7.27A8,8,0,0,0,4,21H20A8,8,0,0,0,19.95,13.5Z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="flex justify-center items-center gap-3">
                <MushroomIcon />
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)] [filter:drop-shadow(0_0_2px_white)]">
                    MycoLens
                </h1>
            </div>
            <p className="mt-2 text-lg text-neon-cyan [filter:drop-shadow(0_0_2px_theme(colors.neon-cyan))]">
                Free Mushroom Identification Tool
            </p>
            <p className="mt-1 text-md text-neon-pink [filter:drop-shadow(0_0_2px_theme(colors.neon-pink))]">
                Provided by Spore n' Sprout
            </p>
        </header>
    );
};