import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

// GET all categories
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "100");
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await Category.countDocuments();

        // Get categories with pagination
        const categories = await Category.find()
            .select(
                "-programmers -projects -events -resources -longDescription"
            )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: categories,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET Categories Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST new category
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        // Validate required fields
        if (!body.id || !body.title || !body.description) {
            return NextResponse.json(
                { error: "Missing required fields: id, title, description" },
                { status: 400 }
            );
        }

        // Check if category with same id already exists
        const existingCategory = await Category.findOne({ id: body.id });
        if (existingCategory) {
            return NextResponse.json(
                { error: "Category with this ID already exists" },
                { status: 409 }
            );
        }

        // Create new category
        const category = await Category.create(body);

        return NextResponse.json(
            {
                success: true,
                message: "Category created successfully",
                data: category,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Category Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
