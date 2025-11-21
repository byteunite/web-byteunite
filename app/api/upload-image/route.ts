import { NextRequest, NextResponse } from "next/server";
// @ts-ignore - Cloudinary is optional dependency
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

/**
 * POST /api/upload-image
 * Upload a single image to Cloudinary
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { image, imageUrl, folder = "uploads", public_id } = body;

        // Validasi input - bisa dari base64 image atau URL
        if (!image && !imageUrl) {
            return NextResponse.json(
                { error: "Image data or URL is required" },
                { status: 400 }
            );
        }

        if (image && typeof image !== "string") {
            return NextResponse.json(
                { error: "Invalid image data" },
                { status: 400 }
            );
        }

        if (imageUrl && typeof imageUrl !== "string") {
            return NextResponse.json(
                { error: "Invalid image URL" },
                { status: 400 }
            );
        }

        // Gunakan imageUrl jika ada, jika tidak gunakan image (base64)
        const uploadSource = imageUrl || image;

        // Upload ke Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(uploadSource, {
            folder: folder,
            public_id: public_id || `upload-${Date.now()}`,
            resource_type: "image",
            transformation: [
                {
                    quality: "auto:good",
                    fetch_format: "auto",
                },
            ],
        });

        return NextResponse.json({
            success: true,
            data: {
                url: uploadResponse.secure_url,
                public_id: uploadResponse.public_id,
                width: uploadResponse.width,
                height: uploadResponse.height,
            },
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            {
                error: "Failed to upload image",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
