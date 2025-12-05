import { NextRequest, NextResponse } from "next/server";
import { parseCVWithGemini } from "@/lib/gemini-cv-parser";
import pdfParse from "pdf-parse-fork";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds timeout untuk processing CV

/**
 * POST /api/programmers/parse-cv
 * Upload dan parse CV PDF menggunakan AI Gemini
 */
export async function POST(request: NextRequest) {
    try {
        // Parse form data
        const formData = await request.formData();
        const file = formData.get("file") as File;

        // Validasi file
        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Validasi tipe file (hanya PDF)
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Invalid file type. Only PDF files are allowed." },
                { status: 400 }
            );
        }

        // Validasi ukuran file (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Extract text from PDF
        let cvText: string;
        try {
            // Parse PDF using pdf-parse-fork
            const data = await pdfParse(buffer);
            cvText = data.text;

            // Validasi apakah PDF berisi teks
            if (!cvText || cvText.trim().length === 0) {
                return NextResponse.json(
                    {
                        error: "PDF does not contain readable text. Please ensure the PDF is not scanned or image-based.",
                    },
                    { status: 400 }
                );
            }

            // Validasi panjang teks minimum
            if (cvText.trim().length < 100) {
                return NextResponse.json(
                    {
                        error: "CV text is too short. Please provide a more detailed CV.",
                    },
                    { status: 400 }
                );
            }
        } catch (pdfError) {
            console.error("Error parsing PDF:", pdfError);
            return NextResponse.json(
                {
                    error: "Failed to extract text from PDF. The file might be corrupted or password-protected.",
                },
                { status: 400 }
            );
        }

        // Parse CV dengan Gemini AI
        try {
            const parsedData = await parseCVWithGemini(cvText);

            return NextResponse.json(
                {
                    success: true,
                    message: "CV parsed successfully",
                    data: parsedData,
                    extractedText: cvText.substring(0, 500) + "...", // Return first 500 chars for reference
                },
                { status: 200 }
            );
        } catch (aiError) {
            console.error("Error parsing CV with AI:", aiError);
            return NextResponse.json(
                {
                    error: "Failed to parse CV with AI. Please try again or enter data manually.",
                    details:
                        aiError instanceof Error
                            ? aiError.message
                            : "Unknown error",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in parse-cv endpoint:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
