import { NextRequest, NextResponse } from "next/server";
import { generateCoverPrompt } from "@/lib/gemini-cover-prompt-generator";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { caption, slides, category } = body;

        if (!caption || !slides || !Array.isArray(slides)) {
            return NextResponse.json(
                { error: "Caption and slides are required" },
                { status: 400 }
            );
        }

        if (slides.length === 0) {
            return NextResponse.json(
                { error: "At least one slide is required" },
                { status: 400 }
            );
        }

        const promptData = await generateCoverPrompt(
            caption,
            slides,
            category || "riddles"
        );

        return NextResponse.json({ success: true, data: promptData });
    } catch (error) {
        console.error("Error in generate-cover-prompt API:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to generate cover prompt",
            },
            { status: 500 }
        );
    }
}
