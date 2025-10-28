import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Site from "@/models/Site";
import mongoose from "mongoose";

// GET site by id
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
                { error: "Invalid site ID format" },
                { status: 400 }
            );
        }

        const site = await Site.findById(id).lean();

        if (!site) {
            return NextResponse.json(
                { error: "Site not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: site,
        });
    } catch (error) {
        console.error("GET Site by ID Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PATCH/UPDATE site by id
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
                { error: "Invalid site ID format" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const {
            title,
            description,
            link,
            category,
            thumbnails,
            isFree,
            carouselData,
        } = body;

        // Build update object with only provided fields
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (link !== undefined) updateData.link = link;
        if (category !== undefined) updateData.category = category;
        if (thumbnails !== undefined) updateData.thumbnails = thumbnails;
        if (isFree !== undefined) updateData.isFree = isFree;
        if (carouselData !== undefined) updateData.carouselData = carouselData;

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No fields to update" },
                { status: 400 }
            );
        }

        const updatedSite = await Site.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedSite) {
            return NextResponse.json(
                { error: "Site not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Site updated successfully",
            data: updatedSite,
        });
    } catch (error) {
        console.error("PATCH Site Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE site by id
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
                { error: "Invalid site ID format" },
                { status: 400 }
            );
        }

        const deletedSite = await Site.findByIdAndDelete(id).lean();

        if (!deletedSite) {
            return NextResponse.json(
                { error: "Site not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Site deleted successfully",
            data: deletedSite,
        });
    } catch (error) {
        console.error("DELETE Site Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
