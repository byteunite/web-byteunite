import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";
import mongoose from "mongoose";

/**
 * POST /api/riddles/[id]/video-slides
 * Save generated video slides to database
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid riddle ID format" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { videoSlides } = body;

        // Validate videoSlides
        if (!videoSlides || !Array.isArray(videoSlides)) {
            return NextResponse.json(
                { error: "Invalid videoSlides format" },
                { status: 400 }
            );
        }

        // Update riddle with videoSlides
        const updatedRiddle = await Riddle.findByIdAndUpdate(
            id,
            {
                $set: {
                    videoSlides: videoSlides,
                    videoSlidesUpdatedAt: new Date(),
                },
            },
            { new: true }
        );

        if (!updatedRiddle) {
            return NextResponse.json(
                { error: "Riddle not found" },
                { status: 404 }
            );
        }

        console.log(
            `✅ Video slides saved for riddle ${id}: ${videoSlides.length} slides`
        );

        return NextResponse.json({
            success: true,
            message: "Video slides saved successfully",
            data: {
                id: updatedRiddle._id,
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

/**
 * GET /api/riddles/[id]/video-slides
 * Get video slides for a riddle
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid riddle ID format" },
                { status: 400 }
            );
        }

        const riddle = await Riddle.findById(id)
            .select("videoSlides videoSlidesUpdatedAt")
            .lean();

        if (!riddle) {
            return NextResponse.json(
                { error: "Riddle not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                videoSlides: (riddle as any).videoSlides || [],
                updatedAt: (riddle as any).videoSlidesUpdatedAt || null,
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
