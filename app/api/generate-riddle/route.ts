import { generateRiddleCarousel } from "@/lib/gemini-riddle-generator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { title, riddle, solution } = await request.json();

        if (!title || !riddle || !solution) {
            return NextResponse.json(
                {
                    error: "Missing title, riddle, or solution in request body.",
                },
                { status: 400 }
            );
        }

        const carouselData = await generateRiddleCarousel(
            title,
            riddle,
            solution
        );

        return NextResponse.json(carouselData);
    } catch (error) {
        // Menangani error dari fungsi generator atau parsing JSON
        console.error("API Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
