import { generateTutorialCarousel } from "@/lib/gemini-tutorial-generator";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/models/Tutorial";

export async function POST(request: Request) {
    try {
        const {
            title,
            description,
            category,
            keywords,
            difficulty,
            estimatedTime,
        } = await request.json();

        if (!title || !description) {
            return NextResponse.json(
                {
                    error: "Missing title or description in request body.",
                },
                { status: 400 }
            );
        }

        // Validate difficulty if provided
        if (
            difficulty &&
            !["beginner", "intermediate", "advanced"].includes(difficulty)
        ) {
            return NextResponse.json(
                {
                    error: "Invalid difficulty level. Must be: beginner, intermediate, or advanced.",
                },
                { status: 400 }
            );
        }

        // Generate carousel data dari AI
        const carouselData = await generateTutorialCarousel(
            title,
            description,
            category,
            keywords,
            difficulty
        );

        // Connect ke MongoDB
        await dbConnect();

        // Simpan data tutorial beserta response AI ke database
        const newTutorial = await Tutorial.create({
            title,
            description,
            category: category || "",
            keywords: keywords || [],
            difficulty: difficulty || "beginner",
            estimatedTime: estimatedTime || "",
            carouselData,
        });

        // Return response dengan data yang tersimpan
        return NextResponse.json({
            success: true,
            message: "Tutorial berhasil disimpan ke database",
            data: {
                id: newTutorial._id,
                title: newTutorial.title,
                description: newTutorial.description,
                category: newTutorial.category,
                keywords: newTutorial.keywords,
                difficulty: newTutorial.difficulty,
                estimatedTime: newTutorial.estimatedTime,
                carouselData: newTutorial.carouselData,
                createdAt: newTutorial.createdAt,
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
