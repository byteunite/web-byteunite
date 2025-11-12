import { generateTopicCarousel } from "@/lib/gemini-topic-generator";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";

export async function POST(request: Request) {
    try {
        const { title, description, category, keywords } = await request.json();

        if (!title || !description) {
            return NextResponse.json(
                {
                    error: "Missing title or description in request body.",
                },
                { status: 400 }
            );
        }

        // Generate carousel data dari AI
        const carouselData = await generateTopicCarousel(
            title,
            description,
            category,
            keywords
        );

        // Connect ke MongoDB
        await dbConnect();

        // Simpan data topic beserta response AI ke database
        const newTopic = await Topic.create({
            title,
            description,
            category: category || "",
            keywords: keywords || [],
            carouselData,
        });

        // Return response dengan data yang tersimpan
        return NextResponse.json({
            success: true,
            message: "Topic berhasil disimpan ke database",
            data: {
                id: newTopic._id,
                title: newTopic.title,
                description: newTopic.description,
                category: newTopic.category,
                keywords: newTopic.keywords,
                carouselData: newTopic.carouselData,
                createdAt: newTopic.createdAt,
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
