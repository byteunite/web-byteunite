import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/models/Tutorial";
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
                { error: "Invalid tutorial ID format" },
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

        const updatedTutorial = await Tutorial.findByIdAndUpdate(
            id,
            {
                $set: {
                    videoSlides: videoSlides,
                    videoSlidesUpdatedAt: new Date(),
                },
            },
            { new: true }
        );

        if (!updatedTutorial) {
            return NextResponse.json(
                { error: "Tutorial not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Video slides saved successfully",
            data: {
                id: updatedTutorial._id,
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
                { error: "Invalid tutorial ID format" },
                { status: 400 }
            );
        }

        const tutorial = await Tutorial.findById(id)
            .select("videoSlides videoSlidesUpdatedAt")
            .lean();

        if (!tutorial) {
            return NextResponse.json(
                { error: "Tutorial not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                videoSlides: (tutorial as any).videoSlides || [],
                updatedAt: (tutorial as any).videoSlidesUpdatedAt || null,
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
