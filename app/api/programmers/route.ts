import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Programmer from "@/models/Programmer";

// GET all programmers
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "100");
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const sortBy = searchParams.get("sortBy") || "name";

        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        if (category && category !== "all") {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
                { stack: { $in: [new RegExp(search, "i")] } },
            ];
        }

        // Build sort
        let sort: any = {};
        switch (sortBy) {
            case "name":
                sort = { name: 1 };
                break;
            case "rating":
                sort = { rating: -1 };
                break;
            case "projects":
                sort = { projects: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        // Get total count for pagination
        const total = await Programmer.countDocuments(query);

        // Get programmers with pagination
        const programmers = await Programmer.find(query)
            .select(
                "-fullBio -skills -recentProjects -testimonials -linkedin -twitter -email"
            )
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: programmers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET Programmers Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST new programmer
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.role || !body.email) {
            return NextResponse.json(
                {
                    error: "Missing required fields: name, role, email",
                },
                { status: 400 }
            );
        }

        // Check if programmer with same email already exists
        const existingProgrammer = await Programmer.findOne({
            email: body.email,
        });
        if (existingProgrammer) {
            return NextResponse.json(
                { error: "Programmer with this email already exists" },
                { status: 409 }
            );
        }

        // Create new programmer
        const programmer = await Programmer.create(body);

        return NextResponse.json(
            {
                success: true,
                message: "Programmer created successfully",
                data: programmer,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Programmer Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
