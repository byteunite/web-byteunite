import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";
import mongoose from "mongoose";

// GET riddle by id
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
                { error: "Invalid riddle ID format" },
                { status: 400 }
            );
        }

        const riddle = await Riddle.findById(id).lean();

        if (!riddle) {
            return NextResponse.json(
                { error: "Riddle not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: riddle,
        });
    } catch (error) {
        console.error("GET Riddle by ID Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PATCH/UPDATE riddle by id
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid riddle ID format" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title, riddle, solution, carouselData } = body;

        // Build update object with only provided fields
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (riddle !== undefined) updateData.riddle = riddle;
        if (solution !== undefined) updateData.solution = solution;
        if (carouselData !== undefined) updateData.carouselData = carouselData;

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No fields to update" },
                { status: 400 }
            );
        }

        const updatedRiddle = await Riddle.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedRiddle) {
            return NextResponse.json(
                { error: "Riddle not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Riddle updated successfully",
            data: updatedRiddle,
        });
    } catch (error) {
        console.error("PATCH Riddle Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE riddle by id
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid riddle ID format" },
                { status: 400 }
            );
        }

        const deletedRiddle = await Riddle.findByIdAndDelete(id).lean();

        if (!deletedRiddle) {
            return NextResponse.json(
                { error: "Riddle not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Riddle deleted successfully",
            data: deletedRiddle,
        });
    } catch (error) {
        console.error("DELETE Riddle Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
