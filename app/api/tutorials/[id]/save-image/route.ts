import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/models/Tutorial";

/**
 * POST /api/tutorials/[id]/save-image
 * Save image URL to specific slide in tutorial (carousel slides or video slides)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { slideIndex, imageUrl, slideType = "carousel" } = body;

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

        // Validasi slideType
        if (!["carousel", "video"].includes(slideType)) {
            return NextResponse.json(
                { error: "Invalid slide type. Must be 'carousel' or 'video'" },
                { status: 400 }
            );
        }

        // Koneksi ke database
        await dbConnect();

        // Cari tutorial berdasarkan ID
        const tutorial = await Tutorial.findById(id);

        if (!tutorial) {
            return NextResponse.json(
                { error: "Tutorial not found" },
                { status: 404 }
            );
        }

        // Update berdasarkan slideType
        if (slideType === "video") {
            // Save to video slides
            if (!tutorial.videoSlides || tutorial.videoSlides.length === 0) {
                return NextResponse.json(
                    { error: "No video slides found" },
                    { status: 404 }
                );
            }

            // Validasi slideIndex tidak melebihi jumlah video slides
            if (slideIndex >= tutorial.videoSlides.length) {
                return NextResponse.json(
                    { error: "Video slide index out of bounds" },
                    { status: 400 }
                );
            }

            // Update saved_image_url pada video slide yang sesuai
            tutorial.videoSlides[slideIndex].saved_image_url = imageUrl;
        } else {
            // Save to carousel slides (default behavior)
            // Validasi slideIndex tidak melebihi jumlah slides
            if (slideIndex >= tutorial.carouselData.slides.length) {
                return NextResponse.json(
                    { error: "Slide index out of bounds" },
                    { status: 400 }
                );
            }

            // Update saved_image_url pada slide yang sesuai
            tutorial.carouselData.slides[slideIndex].saved_image_url = imageUrl;
        }

        // Simpan perubahan
        await tutorial.save();

        return NextResponse.json({
            success: true,
            message: `Image URL saved successfully to ${slideType} slides`,
            data: {
                slideIndex,
                imageUrl,
                slideType,
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
