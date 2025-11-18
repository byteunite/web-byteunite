import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Riddle from "@/models/Riddle";
import Site from "@/models/Site";
import Topic from "@/models/Topic";

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

        // Validasi videoScript structure
        if (
            !videoScript.script ||
            !videoScript.estimatedDuration ||
            !videoScript.tips
        ) {
            return NextResponse.json(
                {
                    error: "Invalid videoScript structure",
                },
                { status: 400 }
            );
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
            default:
                return NextResponse.json(
                    {
                        error: "Invalid category. Must be riddles, sites, or topics",
                    },
                    { status: 400 }
                );
        }

        // Update document dengan video script
        const updatedContent = await Model.findByIdAndUpdate(
            contentId,
            {
                $set: {
                    videoScript: {
                        script: videoScript.script,
                        estimatedDuration: videoScript.estimatedDuration,
                        tips: videoScript.tips,
                    },
                },
            },
            { new: true }
        );

        if (!updatedContent) {
            return NextResponse.json(
                {
                    error: `${category} not found`,
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Video script saved successfully",
            data: updatedContent.videoScript,
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
