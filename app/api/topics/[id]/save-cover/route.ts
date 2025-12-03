import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { imageUrl } = body;

        if (!imageUrl || typeof imageUrl !== "string") {
            return NextResponse.json(
                { error: "Invalid image URL" },
                { status: 400 }
            );
        }

        await dbConnect();

        const topic = await Topic.findById(id);
        if (!topic)
            return NextResponse.json(
                { error: "Topic not found" },
                { status: 404 }
            );

        topic.set("cover_image_url", imageUrl);
        await topic.save();

        return NextResponse.json({ success: true, data: { imageUrl } });
    } catch (error) {
        console.error("Error saving topic cover:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
