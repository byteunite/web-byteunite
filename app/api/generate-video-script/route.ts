import { NextRequest, NextResponse } from "next/server";
import { generateVideoScript } from "@/lib/gemini-video-script-generator";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { caption, slides, category } = body;

        // Validasi input
        if (!caption || !slides || !Array.isArray(slides)) {
            return NextResponse.json(
                {
                    error: "Caption and slides are required",
                },
                { status: 400 }
            );
        }

        if (slides.length === 0) {
            return NextResponse.json(
                {
                    error: "At least one slide is required",
                },
                { status: 400 }
            );
        }

        // Generate video script menggunakan Gemini AI
        const scriptData = await generateVideoScript(
            caption,
            slides,
            category || "riddles"
        );

        return NextResponse.json({
            success: true,
            data: scriptData,
        });
    } catch (error) {
        console.error("Error in generate-video-script API:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to generate video script",
            },
            { status: 500 }
        );
    }
}
