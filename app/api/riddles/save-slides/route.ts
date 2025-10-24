import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";
import ImageKit from "imagekit";

// Initialize ImageKit (anda bisa ganti dengan Cloudinary jika prefer)
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

/**
 * POST /api/riddles/save-slides
 * Batch upload images to cloud storage and save URLs to database
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

        // Upload setiap gambar ke ImageKit dan simpan URL
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
                // Extract base64 data from dataUrl
                const base64Data = dataUrl.split(",")[1];

                // Upload ke ImageKit
                const uploadResponse = await imagekit.upload({
                    file: base64Data,
                    fileName: `riddle-${riddleId}-slide-${slideIndex}-${Date.now()}.png`,
                    folder: `/riddles/${riddleId}`,
                    useUniqueFileName: true,
                });

                // Update saved_slide_url pada slide yang sesuai
                riddle.carouselData.slides[slideIndex].saved_slide_url =
                    uploadResponse.url;

                uploadResults.push({
                    slideIndex,
                    imageUrl: uploadResponse.url,
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
