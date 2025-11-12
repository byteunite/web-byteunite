import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Topic from "@/models/Topic";
import ImageKit from "imagekit";

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

/**
 * POST /api/topics/save-slide-single
 * Upload SINGLE slide image to cloud storage and save URL to database
 *
 * This endpoint solves 413 Content Too Large error by processing one slide at a time
 * instead of sending all slides in one large payload
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topicId, slideIndex, dataUrl } = body;

        // Validasi input
        if (!topicId || typeof topicId !== "string") {
            return NextResponse.json(
                { error: "Invalid topic ID" },
                { status: 400 }
            );
        }

        if (typeof slideIndex !== "number") {
            return NextResponse.json(
                { error: "Invalid slide index" },
                { status: 400 }
            );
        }

        if (!dataUrl || typeof dataUrl !== "string") {
            return NextResponse.json(
                { error: "Invalid data URL" },
                { status: 400 }
            );
        }

        // Log payload size for monitoring
        const payloadSizeKB = (dataUrl.length / 1024).toFixed(2);
        console.log(
            `📦 Uploading slide ${slideIndex}, payload: ${payloadSizeKB} KB`
        );

        // Koneksi ke database
        await dbConnect();

        // Cari topic berdasarkan ID
        const topic = await Topic.findById(topicId);

        if (!topic) {
            return NextResponse.json(
                { error: "Topic not found" },
                { status: 404 }
            );
        }

        // Validasi slideIndex tidak melebihi jumlah slides
        if (slideIndex >= topic.carouselData.slides.length) {
            return NextResponse.json(
                { error: "Slide index out of bounds" },
                { status: 400 }
            );
        }

        try {
            // Extract base64 data from dataUrl
            const base64Data = dataUrl.split(",")[1];

            // Upload ke ImageKit
            const uploadResponse = await imagekit.upload({
                file: base64Data,
                fileName: `topic-${topicId}-slide-${slideIndex}-${Date.now()}.jpg`,
                folder: `/topics/${topicId}`,
                useUniqueFileName: true,
            });

            console.log(
                `✅ Uploaded slide ${slideIndex} to ImageKit: ${uploadResponse.url}`
            );

            // Update saved_slide_url pada slide yang sesuai
            topic.carouselData.slides[slideIndex].saved_slide_url =
                uploadResponse.url;

            // Simpan perubahan ke database
            await topic.save();

            console.log(`✅ Saved slide ${slideIndex} URL to database`);

            return NextResponse.json({
                success: true,
                message: `Successfully saved slide ${slideIndex}`,
                data: {
                    topicId,
                    slideIndex,
                    imageUrl: uploadResponse.url,
                },
            });
        } catch (uploadError) {
            console.error(
                `❌ Error uploading slide ${slideIndex}:`,
                uploadError
            );
            return NextResponse.json(
                {
                    success: false,
                    error: "Upload failed",
                    message:
                        uploadError instanceof Error
                            ? uploadError.message
                            : "Unknown error",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error saving slide:", error);
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
