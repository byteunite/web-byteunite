import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Riddle from "@/models/Riddle";
import Site from "@/models/Site";
import Topic from "@/models/Topic";
import Tutorial from "@/models/Tutorial";
import CoverPrompt from "@/models/CoverPrompt";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { contentId, category } = body;

        if (!contentId || !category) {
            return NextResponse.json(
                { error: "contentId and category are required" },
                { status: 400 }
            );
        }

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

        if (Model) {
            const content = await Model.findById(contentId).lean();
            if (content && (content as any).coverPrompt) {
                return NextResponse.json({
                    success: true,
                    data: (content as any).coverPrompt,
                });
            }
        }

        // Fallback: return latest audit record from CoverPrompt collection
        const audit: any = await CoverPrompt.findOne({ contentId, category })
            .sort({ createdAt: -1 })
            .lean();
        if (audit) {
            return NextResponse.json({ success: true, data: audit.prompt });
        }

        return NextResponse.json({ success: true, data: null });
    } catch (error) {
        console.error("Error in get-cover-prompt API:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to get cover prompt",
            },
            { status: 500 }
        );
    }
}
