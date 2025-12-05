import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Programmer from "@/models/Programmer";
import mongoose from "mongoose";
import { generateProgrammerSlug } from "@/lib/slug";

interface RouteParams {
    params: {
        id: string;
    };
}

// GET programmer by id or slug
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = params;
        const { searchParams } = new URL(request.url);
        const publicOnly = searchParams.get("publicOnly") === "true";

        if (!id) {
            return NextResponse.json(
                { error: "Programmer ID or slug is required" },
                { status: 400 }
            );
        }

        // Build query - check if id is MongoDB ObjectId or slug
        const isObjectId = mongoose.Types.ObjectId.isValid(id);
        const query: any = isObjectId ? { _id: id } : { slug: id };

        // For public pages, only return published programmers
        if (publicOnly) {
            query.isPublished = true;
        }

        // Find programmer by _id or slug
        const programmer = await Programmer.findOne(query).lean();

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
        console.error("GET Programmer by ID/Slug Error:", error);
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

        // Get current programmer
        const currentProgrammer = await Programmer.findById(id);
        if (!currentProgrammer) {
            return NextResponse.json(
                { error: "Programmer not found" },
                { status: 404 }
            );
        }

        // If name is being updated, regenerate slug
        if (body.name && body.name !== currentProgrammer.name) {
            let newSlug = generateProgrammerSlug(body.name);

            // Check if new slug already exists (excluding current programmer)
            let slugExists = await Programmer.findOne({
                slug: newSlug,
                _id: { $ne: id },
            });

            let counter = 1;
            while (slugExists) {
                newSlug = `${generateProgrammerSlug(body.name)}-${counter}`;
                slugExists = await Programmer.findOne({
                    slug: newSlug,
                    _id: { $ne: id },
                });
                counter++;
            }

            body.slug = newSlug;
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
