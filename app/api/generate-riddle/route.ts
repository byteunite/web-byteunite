import { generateRiddleCarousel } from "@/lib/gemini-riddle-generator";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";

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

        // Generate carousel data dari AI
        const carouselData = await generateRiddleCarousel(
            title,
            riddle,
            solution
        );

        // Connect ke MongoDB
        await dbConnect();

        // Simpan data riddle beserta response AI ke database
        const newRiddle = await Riddle.create({
            title,
            riddle,
            solution,
            carouselData,
        });

        // Return response dengan data yang tersimpan
        return NextResponse.json({
            success: true,
            message: "Riddle berhasil disimpan ke database",
            data: {
                id: newRiddle._id,
                title: newRiddle.title,
                riddle: newRiddle.riddle,
                solution: newRiddle.solution,
                carouselData: newRiddle.carouselData,
                createdAt: newRiddle.createdAt,
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
