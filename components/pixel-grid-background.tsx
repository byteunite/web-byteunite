"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PixelGridBackgroundProps {
    mouseX: number | null;
    mouseY: number | null;
    gridSize?: number; // Size of each pixel square
    pixelColor?: string; // Base color for pixels (e.g., "rgba(255, 214, 0, 0.1)")
    hoverColor?: string; // Color on hover (e.g., "rgba(255, 214, 0, 0.5)")
    hoverRadius?: number; // Radius around mouse for hover effect
    className?: string;
}

export const PixelGridBackground: React.FC<PixelGridBackgroundProps> = ({
    mouseX,
    mouseY,
    gridSize = 40, // Default pixel size
    pixelColor = "rgba(255, 214, 0, 0.1)", // Default pixel color (yellow with low opacity)
    hoverColor = "rgba(255, 214, 0, 0.5)", // Default hover color (yellow with higher opacity)
    hoverRadius = 100, // Default hover radius
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const updateDimensions = useCallback(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
            });
        }
    }, []);

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [updateDimensions]);

    const numCols = Math.ceil(dimensions.width / gridSize);
    const numRows = Math.ceil(dimensions.height / gridSize);

    const pixels = [];
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const pixelX = c * gridSize + gridSize / 2;
            const pixelY = r * gridSize + gridSize / 2;

            let currentPixelColor = pixelColor;
            let opacity = 0.1 + Math.random() * 0.1; // Base random opacity

            if (mouseX !== null && mouseY !== null) {
                const distance = Math.sqrt(
                    (mouseX - pixelX) ** 2 + (mouseY - pixelY) ** 2
                );

                if (distance < hoverRadius) {
                    const intensity = 1 - distance / hoverRadius;
                    currentPixelColor = hoverColor;
                    opacity = 0.2 + intensity * 0.6; // Increase opacity based on proximity
                }
            }

            // Random opacity variation for accent (more pronounced on left/bottom)
            if (c < numCols / 4 || r > (numRows * 3) / 4) {
                // Left quarter or bottom quarter
                opacity = Math.max(opacity, 0.1 + Math.random() * 0.2); // Slightly higher random opacity
            }

            pixels.push(
                <div
                    key={`${r}-${c}`}
                    className="absolute"
                    style={{
                        left: c * gridSize,
                        top: r * gridSize,
                        width: gridSize,
                        height: gridSize,
                        backgroundColor: currentPixelColor,
                        opacity: opacity,
                        transition:
                            "opacity 0.1s ease-out, background-color 0.1s ease-out",
                    }}
                />
            );
        }
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute inset-0 w-full h-full overflow-hidden",
                className
            )}
        >
            {pixels}
        </div>
    );
};
