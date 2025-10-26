export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Detect if running on Vercel
const isVercel = !!process.env.VERCEL_ENV;

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

        // Dynamic import of puppeteer based on environment
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let puppeteer: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let launchOptions: any = {
            headless: true,
        };

        if (isVercel) {
            // On Vercel: use puppeteer-core with @sparticuz/chromium
            const chromium = (await import("@sparticuz/chromium")).default;
            puppeteer = await import("puppeteer-core");
            launchOptions = {
                ...launchOptions,
                args: chromium.args,
                executablePath: await chromium.executablePath(),
                defaultViewport: {
                    width: 1920,
                    height: 1080,
                },
            };
        } else {
            // Local development: use full puppeteer
            puppeteer = await import("puppeteer");
            launchOptions = {
                ...launchOptions,
                args: ["--no-sandbox"],
                defaultViewport: {
                    width: 1920,
                    height: 1080,
                },
                executablePath:
                    process.platform === "win32"
                        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
                        : process.platform === "darwin"
                        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
                        : "/usr/bin/google-chrome",
            };
        }

        // Launch browser dengan konfigurasi yang sudah ditentukan
        const browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();

        // Get slide dimensions from page
        // scale = 2.5, width = 1080/2.5 = 432, height = 1350/2.5 = 540
        // Untuk hasil HD, kita gunakan scale yang sama tapi deviceScaleFactor lebih tinggi
        const scale = 2.5;
        const slideWidth = Math.floor(1080 / scale);
        const slideHeight = Math.floor(1350 / scale);
        const totalWidth = slideWidth * totalSlides;

        console.log(
            `📐 Dimensions: ${slideWidth}x${slideHeight} per slide, total width: ${totalWidth}px`
        );

        // Set viewport untuk accommodate semua slides dengan deviceScaleFactor tinggi untuk HD quality
        await page.setViewport({
            width: totalWidth + 100, // Extra space for safety
            height: slideHeight + 100,
            deviceScaleFactor: 3, // Increased from 2 to 3 for sharper HD quality
        });

        // Navigate ke halaman
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 30000,
        });

        // Wait untuk fonts dan images
        await page.evaluateHandle("document.fonts.ready");

        // Force repaint untuk ensure proper rendering
        await page.evaluate(() => {
            document.body.offsetHeight; // Trigger reflow
        });

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
            optimizeForSpeed: false, // Prioritize quality over speed
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
            // Sekarang dengan deviceScaleFactor = 3
            const left = i * slideWidth * 3; // * 3 karena deviceScaleFactor = 3
            const top = 0;
            const width = slideWidth * 3;
            const height = slideHeight * 3;

            // Crop menggunakan sharp dengan kualitas maksimal
            const croppedBuffer = await sharp(fullScreenshot as Buffer)
                .extract({
                    left: Math.floor(left),
                    top: Math.floor(top),
                    width: Math.floor(width),
                    height: Math.floor(height),
                })
                // Resize ke dimensi Instagram story (1080x1350) dengan algoritma high-quality
                .resize(1080, 1350, {
                    kernel: sharp.kernel.lanczos3, // Algoritma terbaik untuk quality
                    fit: "fill",
                })
                .png({
                    quality: 100, // Maksimal quality
                    compressionLevel: 6, // Balance antara quality dan file size
                    palette: false, // Full color, bukan palette
                })
                // Add metadata untuk social media
                .withMetadata({
                    density: 300, // 300 DPI untuk print-quality
                })
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
                width: 1080, // Dimensi Instagram Story standard
                height: 1350,
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
