import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";

// GET: Fetch all topics with pagination
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [topics, total] = await Promise.all([
            Topic.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Topic.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            data: topics,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching topics:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch topics" },
            { status: 500 }
        );
    }
}
