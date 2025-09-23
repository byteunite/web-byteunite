"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface Dot {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    color: string;
    initialTimestamp: number;
}

interface MouseTrailDotsProps {
    mouseX: number | null;
    mouseY: number | null;
}

const colors = ["#E0E0E0", "#CCCCCC", "#B3B3B3", "#999999", "#808080"]; // Neutral colors for pixelate effect

export const MouseTrailDots: React.FC<MouseTrailDotsProps> = ({
    mouseX,
    mouseY,
}) => {
    const [dots, setDots] = useState<Dot[]>([]);
    const dotIdRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (mouseX === null || mouseY === null) return;

        const newDots: Dot[] = [];
        const gridSize = 9; // Increased grid size for more coverage
        const spacing = 15; // Decreased spacing for closer density
        const randomness = 0.1; // Further reduced randomness for structured look
        const maxDistance = (gridSize / 2) * spacing * 1.0; // Adjusted max distance for opacity fade

        for (
            let i = -Math.floor(gridSize / 2);
            i <= Math.floor(gridSize / 2);
            i++
        ) {
            for (
                let j = -Math.floor(gridSize / 2);
                j <= Math.floor(gridSize / 2);
                j++
            ) {
                const offsetX =
                    i * spacing + (Math.random() - 0.5) * spacing * randomness; // Reduced randomness
                const offsetY =
                    j * spacing + (Math.random() - 0.5) * spacing * randomness; // Reduced randomness

                const dotX = mouseX + offsetX;
                const dotY = mouseY + offsetY;

                const distance = Math.sqrt(
                    offsetX * offsetX + offsetY * offsetY
                );
                // Use a smoother function for opacity based on distance
                const initialOpacity = Math.max(
                    0,
                    1 - Math.pow(distance / maxDistance, 1.5)
                ); // Adjusted power for fade

                newDots.push({
                    id: dotIdRef.current++,
                    x: dotX,
                    y: dotY,
                    size: Math.random() * 5 + 3, // Larger pixel size (size between 3 and 8)
                    opacity: initialOpacity,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    initialTimestamp: performance.now(),
                });
            }
        }

        setDots((prevDots) => [...prevDots, ...newDots]);
    }, [mouseX, mouseY]); // Re-run when mouseX or mouseY changes

    const animateDots = useCallback(() => {
        const now = performance.now();
        setDots((prevDots) =>
            prevDots
                .map((dot) => {
                    const age = now - dot.initialTimestamp;
                    const fadeDuration = 1000; // milliseconds
                    const newOpacity = Math.max(0, 1 - age / fadeDuration);

                    return {
                        ...dot,
                        opacity: newOpacity,
                        // Optional: make dots move slightly
                        x: dot.x + Math.sin(age / 200) * 0.5,
                        y: dot.y + Math.cos(age / 200) * 0.5,
                    };
                })
                .filter((dot) => dot.opacity > 0)
        );
        animationFrameRef.current = requestAnimationFrame(animateDots);
    }, []);

    useEffect(() => {
        animationFrameRef.current = requestAnimationFrame(animateDots);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [animateDots]);

    return (
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
            {dots.map((dot) => (
                <div
                    key={dot.id}
                    style={{
                        position: "absolute",
                        left: dot.x,
                        top: dot.y,
                        width: dot.size,
                        height: dot.size,
                        borderRadius: "0%", // Pixelate style
                        backgroundColor: dot.color,
                        opacity: dot.opacity,
                        transform: "translate(-50%, -50%)", // Center the dot on its coordinates
                        transition: "opacity 0.1s linear", // Smooth fade out
                        willChange: "opacity, transform",
                    }}
                />
            ))}
        </div>
    );
};
