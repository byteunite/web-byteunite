import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Riddle from "@/models/Riddle";
import Site from "@/models/Site";
import Topic from "@/models/Topic";
import Tutorial from "@/models/Tutorial";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { contentId, category, videoScript } = body;

        // Validasi input
        if (!contentId || !category || !videoScript) {
            return NextResponse.json(
                {
                    error: "contentId, category, and videoScript are required",
                },
                { status: 400 }
            );
        }

        // Validasi videoScript structure (support both new and legacy formats)
        const isLegacyFormat =
            "script" in videoScript &&
            "estimatedDuration" in videoScript &&
            "tips" in videoScript &&
            !("parts" in videoScript);

        const isNewFormat = "parts" in videoScript && "tips" in videoScript;

        if (!isLegacyFormat && !isNewFormat) {
            return NextResponse.json(
                {
                    error: "Invalid videoScript structure. Must be either legacy format or new format with 'parts' field",
                },
                { status: 400 }
            );
        }

        // Additional validation for new format
        if (isNewFormat) {
            if (videoScript.parts === 1) {
                if (
                    !videoScript.script ||
                    !videoScript.estimatedDuration ||
                    !videoScript.keyPoints ||
                    !videoScript.videoPrompts
                ) {
                    return NextResponse.json(
                        {
                            error: "Invalid single-part videoScript structure",
                        },
                        { status: 400 }
                    );
                }
            } else if (videoScript.parts === 2) {
                if (
                    !videoScript.part1 ||
                    !videoScript.part2 ||
                    !videoScript.part1.videoPrompts ||
                    !videoScript.part2.videoPrompts
                ) {
                    return NextResponse.json(
                        {
                            error: "Invalid multi-part videoScript structure",
                        },
                        { status: 400 }
                    );
                }
            } else {
                return NextResponse.json(
                    {
                        error: "Invalid parts value. Must be 1 or 2",
                    },
                    { status: 400 }
                );
            }
        }

        // Pilih model berdasarkan category
        let Model;
        switch (category) {
            case "riddles":
                Model = Riddle;
                break;
            case "sites":
                Model = Site;
                break;
            case "topics":
                Model = Topic;
                break;
            case "tutorials":
                Model = Tutorial;
                break;
            default:
                return NextResponse.json(
                    {
                        error: "Invalid category. Must be riddles, sites, or topics",
                    },
                    { status: 400 }
                );
        }

        // Update document dengan video script
        // Save entire videoScript object to preserve all fields
        console.log("=== SAVING VIDEO SCRIPT ===");
        console.log("Input videoScript:", JSON.stringify(videoScript, null, 2));

        // Find the document first
        const content = await Model.findById(contentId);

        if (!content) {
            return NextResponse.json(
                {
                    error: `${category} not found`,
                },
                { status: 404 }
            );
        }

        // Set videoScript directly
        content.videoScript = videoScript;

        // Save without validation
        await content.save({ validateBeforeSave: false });

        // Retrieve the saved document
        const savedContent = await Model.findById(contentId).lean();

        console.log("=== SAVED VIDEO SCRIPT ===");
        console.log(
            "Stored in DB:",
            JSON.stringify((savedContent as any)?.videoScript, null, 2)
        );

        return NextResponse.json({
            success: true,
            message: "Video script saved successfully",
            data: (savedContent as any)?.videoScript,
        });
    } catch (error) {
        console.error("Error in save-video-script API:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to save video script",
            },
            { status: 500 }
        );
    }
}
