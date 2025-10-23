"use client";

import { useState } from "react";

interface ClickableImageProps {
    prompt: string;
    width: number;
    height: number;
    className?: string;
    style?: React.CSSProperties;
    alt?: string;
}

export default function ClickableImage({
    prompt,
    width,
    height,
    className = "",
    style = {},
    alt = "Generated image",
}: ClickableImageProps) {
    const [seed, setSeed] = useState<number>(
        Math.ceil(Math.random() * 1000000)
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleImageClick = () => {
        setIsLoading(true);
        setSeed(Math.ceil(Math.random() * 1000000));
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const encodedPrompt = encodeURIComponent(prompt);

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center dark:bg-gray-800 rounded p-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            Loading...
                        </span>
                    </div>
                </div>
            )}
            <img
                className={`cursor-pointer hover:opacity-90 transition-opacity ${className} ${
                    isLoading ? "hidden" : "block"
                }`}
                src={`https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=kontext&seed=${seed}`}
                style={style}
                onClick={handleImageClick}
                onLoad={handleImageLoad}
                title="Klik untuk mengganti gambar"
                alt={alt}
            />
        </>
    );
}
