import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Programmer from "@/models/Programmer";

interface RouteParams {
    params: {
        id: string;
    };
}

// GET programmer by id
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "Programmer ID is required" },
                { status: 400 }
            );
        }

        // Find programmer by _id
        const programmer = await Programmer.findById(id).lean();

        if (!programmer) {
            return NextResponse.json(
                { error: "Programmer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: programmer,
        });
    } catch (error) {
        console.error("GET Programmer by ID Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PUT update programmer by id
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = params;
        const body = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "Programmer ID is required" },
                { status: 400 }
            );
        }

        // Update programmer
        const updatedProgrammer = await Programmer.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedProgrammer) {
            return NextResponse.json(
                { error: "Programmer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Programmer updated successfully",
            data: updatedProgrammer,
        });
    } catch (error) {
        console.error("PUT Programmer Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE programmer by id
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "Programmer ID is required" },
                { status: 400 }
            );
        }

        const deletedProgrammer = await Programmer.findByIdAndDelete(id).lean();

        if (!deletedProgrammer) {
            return NextResponse.json(
                { error: "Programmer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Programmer deleted successfully",
            data: deletedProgrammer,
        });
    } catch (error) {
        console.error("DELETE Programmer Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
