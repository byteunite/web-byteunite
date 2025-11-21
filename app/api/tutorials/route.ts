import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/models/Tutorial";

// GET: Fetch all tutorials with pagination
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [tutorials, total] = await Promise.all([
            Tutorial.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Tutorial.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            data: tutorials,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching tutorials:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch tutorials" },
            { status: 500 }
        );
    }
}
