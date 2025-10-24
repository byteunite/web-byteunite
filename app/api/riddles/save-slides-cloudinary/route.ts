import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";
// @ts-ignore - Cloudinary is optional dependency, install with: npm install cloudinary
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

/**
 * POST /api/riddles/save-slides-cloudinary
 * Batch upload images to Cloudinary and save URLs to database
 * Alternative version using Cloudinary instead of ImageKit
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { riddleId, images } = body;

        // Validasi input
        if (!riddleId || typeof riddleId !== "string") {
            return NextResponse.json(
                { error: "Invalid riddle ID" },
                { status: 400 }
            );
        }

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { error: "Invalid images array" },
                { status: 400 }
            );
        }

        // Koneksi ke database
        await dbConnect();

        // Cari riddle berdasarkan ID
        const riddle = await Riddle.findById(riddleId);

        if (!riddle) {
            return NextResponse.json(
                { error: "Riddle not found" },
                { status: 404 }
            );
        }

        // Upload setiap gambar ke Cloudinary dan simpan URL
        const uploadResults = [];

        for (const image of images) {
            const { slideIndex, dataUrl } = image;

            if (typeof slideIndex !== "number" || !dataUrl) {
                console.error("Invalid image data:", image);
                continue;
            }

            // Validasi slideIndex tidak melebihi jumlah slides
            if (slideIndex >= riddle.carouselData.slides.length) {
                console.error("Slide index out of bounds:", slideIndex);
                continue;
            }

            try {
                // Upload ke Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(
                    dataUrl,
                    {
                        folder: `riddles/${riddleId}`,
                        public_id: `slide-${slideIndex}-${Date.now()}`,
                        resource_type: "image",
                        transformation: [
                            {
                                quality: "auto:good",
                                fetch_format: "auto",
                            },
                        ],
                    }
                );

                // Update saved_image_url pada slide yang sesuai
                riddle.carouselData.slides[slideIndex].saved_image_url =
                    uploadResponse.secure_url;

                uploadResults.push({
                    slideIndex,
                    imageUrl: uploadResponse.secure_url,
                    success: true,
                });
            } catch (uploadError) {
                console.error(
                    `Error uploading slide ${slideIndex}:`,
                    uploadError
                );
                uploadResults.push({
                    slideIndex,
                    success: false,
                    error:
                        uploadError instanceof Error
                            ? uploadError.message
                            : "Unknown error",
                });
            }
        }

        // Simpan perubahan ke database
        await riddle.save();

        // Hitung success rate
        const successCount = uploadResults.filter(
            (result) => result.success
        ).length;
        const totalCount = uploadResults.length;

        return NextResponse.json({
            success: true,
            message: `Successfully saved ${successCount} out of ${totalCount} slides`,
            data: {
                riddleId,
                uploadResults,
                successCount,
                totalCount,
            },
        });
    } catch (error) {
        console.error("Error saving slides:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
