import React from 'react';

const LOGO_URL = "https://raw.githubusercontent.com/SporenSprout/MycoLens/877ef80ee19000edfeacfebdc5ed37fb68866e48/7B26F205-A653-4ADD-A27A-DBF397810922%202.PNG";

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="flex justify-center items-center">
                <img src={LOGO_URL} alt="MycoLens Logo" className="h-24 w-24 -mr-4" />
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-br from-neon-cyan to-blue-500 bg-clip-text text-transparent">
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