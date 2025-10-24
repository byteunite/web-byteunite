"use client";
import React, { useState } from "react";

type Props = {
    prompt: string;
    model?:
        | "gpt-image-1"
        | "dall-e-3"
        | "dall-e-2"
        | "gemini-2.5-flash-image-preview";
    quality?: "low" | "medium" | "high" | "hd";
};

export const ImageGenerator: React.FC<Props> = ({
    prompt,
    model = "gpt-image-1",
    quality,
}) => {
    const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const generate = async () => {
        setLoading(true);
        setError(null);
        try {
            // @ts-ignore: Puter library loaded via script tag
            const imgEl = await (window as any).puter.ai.txt2img(prompt, {
                model,
                quality,
            });
            setImgElement(imgEl);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error generating image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={generate} disabled={loading}>
                {loading ? "Generating…" : "Generate Image"}
            </button>
            {error && <div style={{ color: "red" }}>Error: {error}</div>}
            {imgElement && (
                <div
                    ref={(el) => {
                        if (el && !el.contains(imgElement)) {
                            el.appendChild(imgElement);
                        }
                    }}
                />
            )}
        </div>
    );
};
