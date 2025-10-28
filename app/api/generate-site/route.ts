import { generateSiteCarousel } from "@/lib/gemini-site-generator";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Site from "@/models/Site";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, link, category, thumbnails, isFree } = body;

        // Validate required fields
        if (!title || !description || !link || !category) {
            return NextResponse.json(
                {
                    error: "Missing required fields: title, description, link, or category",
                },
                { status: 400 }
            );
        }

        // Validate link format
        try {
            new URL(link);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format for link" },
                { status: 400 }
            );
        }

        // Generate carousel data dari AI
        const carouselData = await generateSiteCarousel(
            title,
            description,
            link,
            category,
            isFree || false
        );

        // Connect to MongoDB
        await dbConnect();

        // Create new site document
        const newSite = await Site.create({
            title,
            description,
            link,
            category,
            thumbnails: thumbnails || [],
            isFree: isFree || false,
            carouselData,
        });

        // Return response with saved data
        return NextResponse.json({
            success: true,
            message: "Site berhasil disimpan ke database",
            data: {
                id: newSite._id,
                title: newSite.title,
                description: newSite.description,
                link: newSite.link,
                category: newSite.category,
                thumbnails: newSite.thumbnails,
                isFree: newSite.isFree,
                carouselData: newSite.carouselData,
                createdAt: newSite.createdAt,
            },
        });
    } catch (error) {
        // Menangani error dari fungsi generator atau parsing JSON
        console.error("API Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
