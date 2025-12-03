import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";

/**
 * POST /api/riddles/[id]/save-cover
 * Save cover image URL to riddle.cover_image_url (separate from slides)
 */
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

        const riddle = await Riddle.findById(id);
        if (!riddle) {
            return NextResponse.json(
                { error: "Riddle not found" },
                { status: 404 }
            );
        }

        riddle.set("cover_image_url", imageUrl);
        await riddle.save();

        return NextResponse.json({ success: true, data: { imageUrl } });
    } catch (error) {
        console.error("Error saving cover image:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
