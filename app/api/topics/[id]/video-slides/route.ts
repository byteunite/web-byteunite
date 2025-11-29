import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";
import mongoose from "mongoose";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid topic ID format" },
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

        const updatedTopic = await Topic.findByIdAndUpdate(
            id,
            {
                $set: {
                    videoSlides: videoSlides,
                    videoSlidesUpdatedAt: new Date(),
                },
            },
            { new: true }
        );

        if (!updatedTopic) {
            return NextResponse.json(
                { error: "Topic not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Video slides saved successfully",
            data: {
                id: updatedTopic._id,
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
                { error: "Invalid topic ID format" },
                { status: 400 }
            );
        }

        const topic = await Topic.findById(id)
            .select("videoSlides videoSlidesUpdatedAt")
            .lean();

        if (!topic) {
            return NextResponse.json(
                { error: "Topic not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                videoSlides: (topic as any).videoSlides || [],
                updatedAt: (topic as any).videoSlidesUpdatedAt || null,
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
