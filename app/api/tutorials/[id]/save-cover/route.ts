import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/models/Tutorial";

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

        const tutorial = await Tutorial.findById(id);
        if (!tutorial)
            return NextResponse.json(
                { error: "Tutorial not found" },
                { status: 404 }
            );

        tutorial.set("cover_image_url", imageUrl);
        await tutorial.save();

        return NextResponse.json({ success: true, data: { imageUrl } });
    } catch (error) {
        console.error("Error saving tutorial cover:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
