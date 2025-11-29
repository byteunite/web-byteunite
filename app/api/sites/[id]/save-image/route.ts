import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Site from "@/models/Site";

/**
 * POST /api/sites/[id]/save-image
 * Save image URL to specific slide in site (carousel slides or video slides)
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

        // Cari site berdasarkan ID
        const site = await Site.findById(id);

        if (!site) {
            return NextResponse.json(
                { error: "Site not found" },
                { status: 404 }
            );
        }

        // Update berdasarkan slideType
        if (slideType === "video") {
            // Save to video slides
            if (!site.videoSlides || site.videoSlides.length === 0) {
                return NextResponse.json(
                    { error: "No video slides found" },
                    { status: 404 }
                );
            }

            // Validasi slideIndex tidak melebihi jumlah video slides
            if (slideIndex >= site.videoSlides.length) {
                return NextResponse.json(
                    { error: "Video slide index out of bounds" },
                    { status: 400 }
                );
            }

            // Update saved_image_url pada video slide yang sesuai
            site.videoSlides[slideIndex].saved_image_url = imageUrl;
        } else {
            // Save to carousel slides (default behavior)
            // Validasi slideIndex tidak melebihi jumlah slides
            if (slideIndex >= site.carouselData.slides.length) {
                return NextResponse.json(
                    { error: "Slide index out of bounds" },
                    { status: 400 }
                );
            }

            // Update saved_image_url pada slide yang sesuai
            site.carouselData.slides[slideIndex].saved_image_url = imageUrl;
        }

        // Simpan perubahan
        await site.save();

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
