import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/models/Tutorial";
import mongoose from "mongoose";

// GET tutorial by id
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
                { error: "Invalid tutorial ID format" },
                { status: 400 }
            );
        }

        const tutorial = await Tutorial.findById(id).lean();

        if (!tutorial) {
            return NextResponse.json(
                { error: "Tutorial not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: tutorial,
        });
    } catch (error) {
        console.error("GET Tutorial by ID Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE: Hapus tutorial berdasarkan ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        const deletedTutorial = await Tutorial.findByIdAndDelete(id);

        if (!deletedTutorial) {
            return NextResponse.json(
                { success: false, error: "Tutorial not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Tutorial deleted successfully",
            data: deletedTutorial,
        });
    } catch (error) {
        console.error("Error deleting tutorial:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete tutorial" },
            { status: 500 }
        );
    }
}
