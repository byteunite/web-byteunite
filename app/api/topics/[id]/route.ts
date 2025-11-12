import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";
import mongoose from "mongoose";

// GET topic by id
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid topic ID format" },
                { status: 400 }
            );
        }

        const topic = await Topic.findById(id).lean();

        if (!topic) {
            return NextResponse.json(
                { error: "Topic not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: topic,
        });
    } catch (error) {
        console.error("GET Topic by ID Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE: Hapus topic berdasarkan ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        const deletedTopic = await Topic.findByIdAndDelete(id);

        if (!deletedTopic) {
            return NextResponse.json(
                { success: false, error: "Topic not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Topic deleted successfully",
            data: deletedTopic,
        });
    } catch (error) {
        console.error("Error deleting topic:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete topic" },
            { status: 500 }
        );
    }
}
