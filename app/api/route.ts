import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Inisialisasi Gemini AI client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

/**
 * POST /api/generate-image
 * Generate image using Gemini's Imagen API
 *
 * Request body:
 * {
 *   "prompt": "A detailed description of the image to generate",
 *   "numberOfImages": 1, // optional, default 1, max 4
 *   "aspectRatio": "1:1" // optional, options: "1:1", "3:4", "4:3", "9:16", "16:9"
 * }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, numberOfImages = 1, aspectRatio = "1:1" } = body;

        // Validasi input
        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { error: "Prompt is required and must be a string" },
                { status: 400 }
            );
        }

        if (numberOfImages < 1 || numberOfImages > 4) {
            return NextResponse.json(
                { error: "numberOfImages must be between 1 and 4" },
                { status: 400 }
            );
        }

        const validAspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
        if (!validAspectRatios.includes(aspectRatio)) {
            return NextResponse.json(
                {
                    error: `aspectRatio must be one of: ${validAspectRatios.join(
                        ", "
                    )}`,
                },
                { status: 400 }
            );
        }

        // Validasi API Key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured" },
                { status: 500 }
            );
        }

        // Generate image menggunakan Gemini Imagen
        const response = await ai.models.generateImages({
            model: "imagen-3.0-generate-002",
            prompt: prompt,
            config: {
                numberOfImages: numberOfImages,
                aspectRatio: aspectRatio,
            },
        });

        // Ekstrak image data dari response
        // GeneratedImage memiliki property 'image' yang berisi data gambar
        const generatedImages = response.generatedImages || [];
        const images = generatedImages.map((img) => {
            // Kembalikan objek image langsung
            return {
                image: img.image, // Object Image dari Gemini
            };
        });

        return NextResponse.json({
            success: true,
            prompt: prompt,
            numberOfImages: images.length,
            aspectRatio: aspectRatio,
            images: images,
        });
    } catch (error: any) {
        console.error("Error generating image with Gemini:", error);

        return NextResponse.json(
            {
                error: "Failed to generate image",
                message: error.message || "Unknown error occurred",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    return NextResponse.json({
        message:
            "Image generation API endpoint. Use POST method with a prompt to generate images.",
        usage: {
            method: "POST",
            endpoint: "/api/generate-image",
            body: {
                prompt: "A detailed description of the image (required)",
                numberOfImages:
                    "Number of images to generate (1-4, default: 1)",
                aspectRatio:
                    "Image aspect ratio (1:1, 3:4, 4:3, 9:16, 16:9, default: 1:1)",
            },
            example: {
                prompt: "A cat sitting on a windowsill, black and white photography",
                numberOfImages: 1,
                aspectRatio: "1:1",
            },
        },
    });
}
