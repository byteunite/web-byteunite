import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

interface RouteParams {
    params: {
        id: string;
    };
}

// GET category by id
export async function GET(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "Category ID is required" },
                { status: 400 }
            );
        }

        // Find category by id field (not _id)
        const category = await Category.findOne({ id }).lean();

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error("GET Category by ID Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PUT update category by id
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = params;
        const body = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "Category ID is required" },
                { status: 400 }
            );
        }

        // Update category
        const updatedCategory = await Category.findOneAndUpdate(
            { id },
            { $set: body },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedCategory) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        console.error("PUT Category Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE category by id
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "Category ID is required" },
                { status: 400 }
            );
        }

        const deletedCategory = await Category.findOneAndDelete({ id }).lean();

        if (!deletedCategory) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
            data: deletedCategory,
        });
    } catch (error) {
        console.error("DELETE Category Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
