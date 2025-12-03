import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CoverPrompt from "@/models/CoverPrompt";
import Riddle from "@/models/Riddle";
import Site from "@/models/Site";
import Topic from "@/models/Topic";
import Tutorial from "@/models/Tutorial";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { contentId, category, coverPrompt } = body;

        if (!contentId || !category || !coverPrompt) {
            return NextResponse.json(
                { error: "contentId, category, and coverPrompt are required" },
                { status: 400 }
            );
        }

        // Save to CoverPrompt collection (audit/log)
        const doc = await CoverPrompt.create({
            contentId,
            category,
            prompt: coverPrompt,
        });

        // Also persist into the main content document (like save-video-script does)
        let Model: any;
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
                Model = null;
        }

        let savedContent = null;
        if (Model) {
            const content = await Model.findById(contentId);
            if (content) {
                content.coverPrompt = coverPrompt;
                await content.save({ validateBeforeSave: false });
                savedContent = await Model.findById(contentId).lean();
            }
        }

        return NextResponse.json({
            success: true,
            data: { audit: doc, content: savedContent },
        });
    } catch (error) {
        console.error("Error in save-cover-prompt API:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to save cover prompt",
            },
            { status: 500 }
        );
    }
}
