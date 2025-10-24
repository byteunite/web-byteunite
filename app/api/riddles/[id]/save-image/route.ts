import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";

/**
 * POST /api/riddles/[id]/save-image
 * Save image URL to specific slide in riddle
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { slideIndex, imageUrl } = body;

        // Validasi input
        if (typeof slideIndex !== "number" || slideIndex < 0) {
            return NextResponse.json(
                { error: "Invalid slide index" },
                { status: 400 }
            );
        }

        if (!imageUrl || typeof imageUrl !== "string") {
            return NextResponse.json(
                { error: "Invalid image URL" },
                { status: 400 }
            );
        }

        // Koneksi ke database
        await dbConnect();

        // Cari riddle berdasarkan ID
        const riddle = await Riddle.findById(id);

        if (!riddle) {
            return NextResponse.json(
                { error: "Riddle not found" },
                { status: 404 }
            );
        }

        // Validasi slideIndex tidak melebihi jumlah slides
        if (slideIndex >= riddle.carouselData.slides.length) {
            return NextResponse.json(
                { error: "Slide index out of bounds" },
                { status: 400 }
            );
        }

        // Update saved_image_url pada slide yang sesuai
        riddle.carouselData.slides[slideIndex].saved_image_url = imageUrl;

        // Simpan perubahan
        await riddle.save();

        return NextResponse.json({
            success: true,
            message: "Image URL saved successfully",
            data: {
                slideIndex,
                imageUrl,
            },
        });
    } catch (error) {
        console.error("Error saving image URL:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
