import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Site from "@/models/Site";
import mongoose from "mongoose";

/**
 * POST /api/sites/[id]/video-slides
 * Save generated video slides to database
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid site ID format" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { videoSlides } = body;

        if (!videoSlides || !Array.isArray(videoSlides)) {
            return NextResponse.json(
                { error: "Invalid videoSlides format" },
                { status: 400 }
            );
        }

        const updatedSite = await Site.findByIdAndUpdate(
            id,
            {
                $set: {
                    videoSlides: videoSlides,
                    videoSlidesUpdatedAt: new Date(),
                },
            },
            { new: true }
        );

        if (!updatedSite) {
            return NextResponse.json(
                { error: "Site not found" },
                { status: 404 }
            );
        }

        console.log(
            `✅ Video slides saved for site ${id}: ${videoSlides.length} slides`
        );

        return NextResponse.json({
            success: true,
            message: "Video slides saved successfully",
            data: {
                id: updatedSite._id,
                videoSlidesCount: videoSlides.length,
            },
        });
    } catch (error) {
        console.error("Save video slides error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid site ID format" },
                { status: 400 }
            );
        }

        const site = await Site.findById(id)
            .select("videoSlides videoSlidesUpdatedAt")
            .lean();

        if (!site) {
            return NextResponse.json(
                { error: "Site not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                videoSlides: (site as any).videoSlides || [],
                updatedAt: (site as any).videoSlidesUpdatedAt || null,
            },
        });
    } catch (error) {
        console.error("Get video slides error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
