import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";

/**
 * POST /api/topics/[id]/save-image
 * Save image URL to specific slide in topic (carousel slides or video slides)
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

        // Cari topic berdasarkan ID
        const topic = await Topic.findById(id);

        if (!topic) {
            return NextResponse.json(
                { error: "Topic not found" },
                { status: 404 }
            );
        }

        // Update berdasarkan slideType
        if (slideType === "video") {
            // Save to video slides
            if (!topic.videoSlides || topic.videoSlides.length === 0) {
                return NextResponse.json(
                    { error: "No video slides found" },
                    { status: 404 }
                );
            }

            // Validasi slideIndex tidak melebihi jumlah video slides
            if (slideIndex >= topic.videoSlides.length) {
                return NextResponse.json(
                    { error: "Video slide index out of bounds" },
                    { status: 400 }
                );
            }

            // Update saved_image_url pada video slide yang sesuai
            topic.videoSlides[slideIndex].saved_image_url = imageUrl;
        } else {
            // Save to carousel slides (default behavior)
            // Validasi slideIndex tidak melebihi jumlah slides
            if (slideIndex >= topic.carouselData.slides.length) {
                return NextResponse.json(
                    { error: "Slide index out of bounds" },
                    { status: 400 }
                );
            }

            // Update saved_image_url pada slide yang sesuai
            topic.carouselData.slides[slideIndex].saved_image_url = imageUrl;
        }

        // Simpan perubahan
        await topic.save();

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
