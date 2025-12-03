import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Site from "@/models/Site";

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

        const site = await Site.findById(id);
        if (!site)
            return NextResponse.json(
                { error: "Site not found" },
                { status: 404 }
            );

        site.set("cover_image_url", imageUrl);
        await site.save();

        return NextResponse.json({ success: true, data: { imageUrl } });
    } catch (error) {
        console.error("Error saving site cover:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
