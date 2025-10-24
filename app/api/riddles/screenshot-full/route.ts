import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import sharp from "sharp";

// Konfigurasi untuk production (Vercel)
const isProduction = process.env.NODE_ENV === "production";

/**
 * API Endpoint untuk capture screenshot menggunakan Puppeteer
 *
 * New Approach:
 * 1. Screenshot SEMUA slides sekaligus (full width)
 * 2. Crop/chunk per slide dari screenshot utuh
 * 3. Return array of slide images
 *
 * Benefit: Tidak ada gambar terpotong, konsisten antar slides
 */
export async function POST(request: NextRequest) {
    try {
        const { riddleId, totalSlides } = await request.json();

        if (!riddleId || !totalSlides) {
            return NextResponse.json(
                { error: "riddleId and totalSlides are required" },
                { status: 400 }
            );
        }

        // Build URL untuk screenshot
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const url = `${baseUrl}/template/${riddleId}?screenshot=true`;

        console.log(
            `📸 Capturing full screenshot: ${url} (${totalSlides} slides)`
        );

        // Launch browser
        const browser = await puppeteer.launch({
            headless: true,
            args: isProduction
                ? [
                      "--no-sandbox",
                      "--disable-setuid-sandbox",
                      "--disable-dev-shm-usage",
                      "--disable-gpu",
                      "--disable-software-rasterizer",
                      "--single-process",
                  ]
                : ["--no-sandbox"],
        });

        const page = await browser.newPage();

        // Get slide dimensions from page
        // scale = 2.5, width = 1080/2.5 = 432, height = 1350/2.5 = 540
        const scale = 2.5;
        const slideWidth = Math.floor(1080 / scale);
        const slideHeight = Math.floor(1350 / scale);
        const totalWidth = slideWidth * totalSlides;

        console.log(
            `📐 Dimensions: ${slideWidth}x${slideHeight} per slide, total width: ${totalWidth}px`
        );

        // Set viewport untuk accommodate semua slides
        await page.setViewport({
            width: totalWidth + 100, // Extra space for safety
            height: slideHeight + 100,
            deviceScaleFactor: 2, // High DPI
        });

        // Navigate ke halaman
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 30000,
        });

        // Wait untuk fonts dan images
        await page.evaluateHandle("document.fonts.ready");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Find the main container dengan semua slides
        const containerInfo = await page.evaluate(() => {
            const container = document.querySelector(
                ".bg-white.relative"
            ) as HTMLElement;
            if (!container) return null;

            const rect = container.getBoundingClientRect();
            return {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
            };
        });

        if (!containerInfo) {
            await browser.close();
            return NextResponse.json(
                { error: "Container tidak ditemukan" },
                { status: 404 }
            );
        }

        console.log(`✅ Container found:`, containerInfo);

        // Screenshot FULL container (semua slides sekaligus)
        const fullScreenshot = await page.screenshot({
            type: "png",
            encoding: "binary",
            clip: {
                x: containerInfo.x,
                y: containerInfo.y,
                width: containerInfo.width,
                height: containerInfo.height,
            },
        });

        await browser.close();

        console.log(
            `✅ Full screenshot captured, now chunking into ${totalSlides} slides...`
        );

        // Chunk/crop screenshot menjadi individual slides
        const slideImages: Array<{ slideIndex: number; dataUrl: string }> = [];

        for (let i = 0; i < totalSlides; i++) {
            // Calculate crop area untuk slide ini
            const left = i * slideWidth * 2; // * 2 karena deviceScaleFactor = 2
            const top = 0;
            const width = slideWidth * 2;
            const height = slideHeight * 2;

            // Crop menggunakan sharp
            const croppedBuffer = await sharp(fullScreenshot as Buffer)
                .extract({
                    left: Math.floor(left),
                    top: Math.floor(top),
                    width: Math.floor(width),
                    height: Math.floor(height),
                })
                .png()
                .toBuffer();

            // Convert to base64
            const base64 = croppedBuffer.toString("base64");
            const dataUrl = `data:image/png;base64,${base64}`;

            slideImages.push({
                slideIndex: i,
                dataUrl,
            });

            console.log(`✅ Slide ${i + 1}/${totalSlides} cropped`);
        }

        console.log(`🎉 All ${totalSlides} slides processed successfully`);

        // Return array of all slide images
        return NextResponse.json({
            success: true,
            totalSlides,
            slides: slideImages,
            dimensions: {
                width: slideWidth * 2, // Actual pixel dimensions
                height: slideHeight * 2,
            },
        });
    } catch (error) {
        console.error("Screenshot error:", error);
        return NextResponse.json(
            {
                error: "Failed to capture screenshot",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
