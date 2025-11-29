export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Detect if running on Vercel
const isVercel = !!process.env.VERCEL_ENV;

/**
 * API Endpoint untuk capture screenshot menggunakan Puppeteer untuk Tutorials
 *
 * Approach:
 * 1. Screenshot SEMUA slides sekaligus (full width)
 * 2. Crop/chunk per slide dari screenshot utuh (using ACTUAL screenshot dimensions)
 * 3. Downscale/minor upscale dengan Sharp menggunakan Lanczos3 algorithm
 * 4. Return array of slide images
 *
 * HIGH QUALITY Strategy (Vercel-Optimized):
 * - Use deviceScaleFactor: 2 on Vercel, 2.5 on local (balance quality vs stability)
 * - CSS viewport: 432x540 per slide
 * - Actual render: 864x1080 (2x) or 1080x1350 (2.5x) per slide
 * - Resize to 1080x1350 using Sharp's Lanczos3
 * - Adaptive sharpening based on actual resize ratio
 * - JPEG quality 98 with advanced compression
 *
 * Why deviceScaleFactor 2-2.5 (not 3):
 * - deviceScaleFactor 3 causes overlap bug in Vercel/Chromium
 * - deviceScaleFactor 2 = stable, no overlap, still sharp (864x1080)
 * - deviceScaleFactor 2.5 = best local quality (1080x1350 = perfect fit!)
 * - With proper sharpening, 2x still produces HD results
 * - More reliable across different environments
 *
 * How we FIXED the overlap bug:
 * - OLD approach: Used calculated dimensions (slideWidth * dpr) for crop
 * - Problem: Calculated ≠ actual screenshot dimensions → overlap
 * - NEW approach: Use ACTUAL screenshot dimensions from metadata
 * - Calculate: actualSlideWidth = actualScreenshotWidth / totalSlides
 * - Crop using actual dimensions = NEVER fails, NO overlap!
 *
 * Why THIS combination works:
 * - deviceScaleFactor 2-2.5 = sharp rendering, no overlap bug
 * - Actual dimension crop = reliable, stable
 * - Lanczos3 resize = professional quality
 * - Adaptive sharpening = compensates for minor upscaling
 * - Advanced JPEG = maximum quality, reasonable size
 *
 * Result: HIGH HD quality (1080x1350) tanpa bug overlap! ✅
 */
export async function POST(request: NextRequest) {
    try {
        const {
            tutorialId,
            totalSlides,
            slideType = "carousel",
        } = await request.json();

        if (!tutorialId || !totalSlides) {
            return NextResponse.json(
                { error: "tutorialId and totalSlides are required" },
                { status: 400 }
            );
        }

        // Validate slideType
        if (slideType !== "carousel" && slideType !== "video") {
            return NextResponse.json(
                { error: "Invalid slide type. Must be 'carousel' or 'video'" },
                { status: 400 }
            );
        }

        // Build URL untuk screenshot berdasarkan slideType
        const templatePath =
            slideType === "video" ? "template-video" : "template";
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const url = `${baseUrl}/${templatePath}/${tutorialId}?screenshot=true&data=tutorials`;

        console.log(
            `📸 Capturing ${slideType} full screenshot: ${url} (${totalSlides} slides)`
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
                defaultViewport: null, // ✅ Allow custom viewport size via page.setViewport()
            };
        } else {
            // Local development: use full puppeteer
            puppeteer = await import("puppeteer");
            launchOptions = {
                ...launchOptions,
                args: ["--no-sandbox"],
                defaultViewport: null, // ✅ Allow custom viewport size via page.setViewport()
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

        // Get slide dimensions based on slideType
        // Carousel: 1080x1350 (4:5 ratio) scaled to 432x540
        // Video: 1080x1920 (9:16 ratio) scaled to 432x768
        const scale = 2.5;
        let slideWidth: number, slideHeight: number;

        if (slideType === "video") {
            // Video slides: 9:16 ratio (TikTok/Reels/Shorts)
            slideWidth = Math.floor(1080 / scale); // 432px
            slideHeight = Math.floor(1920 / scale); // 768px
        } else {
            // Carousel slides: 4:5 ratio (Instagram)
            slideWidth = Math.floor(1080 / scale); // 432px
            slideHeight = Math.floor(1350 / scale); // 540px
        }

        const totalWidth = slideWidth * totalSlides;

        // Use deviceScaleFactor 2 for balance between quality and stability
        // 2x gives us 864x1080 per slide, still sharp, but more reliable in Vercel
        const dpr = isVercel ? 2 : 2.5; // 2x on Vercel (stable), 2.5x local (max quality)

        console.log(
            `📐 Base dimensions (${slideType}): ${slideWidth}x${slideHeight} per slide`
        );
        console.log(`📊 Total layout width: ${totalWidth}px`);
        console.log(
            `🔍 deviceScaleFactor: ${dpr}x (${Math.floor(
                slideWidth * dpr
            )}x${Math.floor(slideHeight * dpr)} per slide)`
        );
        console.log(
            `🌐 Environment: ${isVercel ? "Vercel (Chromium)" : "Local"}`
        );

        // Set viewport dengan deviceScaleFactor untuk maximum quality
        // CRITICAL: defaultViewport di launchOptions HARUS null agar page.setViewport() bisa override
        await page.setViewport({
            width: totalWidth + 100, // Extra space for safety
            height: slideHeight + 100,
            deviceScaleFactor: dpr, // 2-2.5x for sharp quality without overlap bug
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

        // Get actual screenshot dimensions to validate
        const screenshotMetadata = await sharp(
            fullScreenshot as Buffer
        ).metadata();
        console.log(`📊 Screenshot metadata:`, {
            width: screenshotMetadata.width,
            height: screenshotMetadata.height,
            format: screenshotMetadata.format,
        });

        // CRITICAL: Calculate actual slide width from screenshot
        // Jangan pakai captureSlideWidth yang calculated, pakai actual screenshot width
        const actualScreenshotWidth = screenshotMetadata.width || 0;
        const actualScreenshotHeight = screenshotMetadata.height || 0;
        const actualSlideWidth = Math.floor(
            actualScreenshotWidth / totalSlides
        );

        console.log(`📏 Actual slide dimensions:`, {
            slideWidth: actualSlideWidth,
            slideHeight: actualScreenshotHeight,
            totalSlides,
        });

        // Calculate expected dimensions with deviceScaleFactor
        const expectedScreenshotWidth = slideWidth * totalSlides * dpr;
        const expectedScreenshotHeight = slideHeight * dpr;

        console.log(
            `📐 Expected screenshot size: ${expectedScreenshotWidth}x${expectedScreenshotHeight}px`
        );

        // Validate screenshot dimensions
        if (actualScreenshotWidth < expectedScreenshotWidth * 0.9) {
            // Allow 10% tolerance
            console.warn(
                `⚠️ WARNING: Screenshot width (${actualScreenshotWidth}px) is less than expected (${expectedScreenshotWidth}px)`
            );
            console.warn(
                `⚠️ This may indicate viewport/deviceScaleFactor issue. Proceeding with actual dimensions...`
            );
        }

        // Chunk/crop screenshot menjadi individual slides
        const slideImages: Array<{ slideIndex: number; dataUrl: string }> = [];

        for (let i = 0; i < totalSlides; i++) {
            // Calculate crop area menggunakan ACTUAL screenshot dimensions
            // Ini lebih reliable karena berdasarkan screenshot real, bukan calculated
            const left = i * actualSlideWidth;
            const top = 0;
            const width = actualSlideWidth;
            const height = actualScreenshotHeight;

            console.log(`📐 Slide ${i + 1}/${totalSlides} crop params:`, {
                left: Math.floor(left),
                top: Math.floor(top),
                width: Math.floor(width),
                height: Math.floor(height),
                screenshotWidth: actualScreenshotWidth,
            });

            // Determine if we're upscaling or downscaling
            const isDownscaling = actualSlideWidth >= 1080;
            const resizeMethod = isDownscaling ? "downscale" : "upscale";
            const resizeRatio = actualSlideWidth / 1080;
            console.log(
                `🔄 Resize: ${resizeMethod} ${resizeRatio.toFixed(
                    2
                )}x (${actualSlideWidth}px → 1080px)`
            );

            // Set target dimensions based on slideType
            const targetWidth = 1080;
            const targetHeight = slideType === "video" ? 1920 : 1350;

            console.log(
                `🎯 Target dimensions: ${targetWidth}x${targetHeight} (${slideType})`
            );

            // Crop menggunakan sharp dengan kualitas maksimal
            let sharpPipeline = sharp(fullScreenshot as Buffer)
                .extract({
                    left: Math.floor(left),
                    top: Math.floor(top),
                    width: Math.floor(width),
                    height: Math.floor(height),
                })
                // Resize ke dimensi target berdasarkan slideType
                // Carousel: 1080x1350 (Instagram)
                // Video: 1080x1920 (TikTok/Reels/Shorts)
                .resize(targetWidth, targetHeight, {
                    kernel: sharp.kernel.lanczos3, // Best algorithm
                    fit: "fill",
                });

            // Apply optimal sharpening based on resize ratio
            if (resizeRatio >= 1.2) {
                // Significant downscaling (e.g., 1296→1080 or more)
                // Light sharpening to preserve natural look
                sharpPipeline = sharpPipeline.sharpen({
                    sigma: 0.4,
                    m1: 0.6,
                    m2: 0.15,
                });
                console.log(
                    `✨ Applied light sharpening (downscale ${resizeRatio.toFixed(
                        2
                    )}x)`
                );
            } else if (resizeRatio < 1.0) {
                // Upscaling - need stronger sharpening
                sharpPipeline = sharpPipeline.sharpen({
                    sigma: 0.8,
                    m1: 1.3,
                    m2: 0.35,
                });
                console.log(
                    `✨ Applied strong sharpening (upscale ${resizeRatio.toFixed(
                        2
                    )}x)`
                );
            } else {
                // Minor resize - moderate sharpening
                sharpPipeline = sharpPipeline.sharpen({
                    sigma: 0.5,
                    m1: 0.8,
                    m2: 0.2,
                });
                console.log(
                    `✨ Applied moderate sharpening (resize ${resizeRatio.toFixed(
                        2
                    )}x)`
                );
            }

            // Process to buffer dengan maximum quality
            const croppedBuffer = await sharpPipeline
                .jpeg({
                    quality: 98, // Maximum quality
                    chromaSubsampling: "4:4:4", // No chroma subsampling
                    mozjpeg: true, // Use mozjpeg
                    trellisQuantisation: true, // Extra optimization
                    overshootDeringing: true, // Reduce ringing artifacts
                    optimizeScans: true, // Progressive JPEG
                })
                .withMetadata({
                    density: 300, // 300 DPI
                })
                .toBuffer();

            // Track file size untuk monitoring
            const fileSizeKB = (croppedBuffer.length / 1024).toFixed(2);
            console.log(`📦 Slide ${i + 1} size: ${fileSizeKB} KB`);

            // Convert to base64
            const base64 = croppedBuffer.toString("base64");
            const dataUrl = `data:image/jpeg;base64,${base64}`;

            slideImages.push({
                slideIndex: i,
                dataUrl,
            });

            console.log(
                `✅ Slide ${
                    i + 1
                }/${totalSlides} cropped successfully (${fileSizeKB} KB)`
            );
        }

        console.log(`🎉 All ${totalSlides} slides processed successfully`);

        // Calculate total payload size
        const totalPayloadSize = slideImages.reduce(
            (acc, slide) => acc + slide.dataUrl.length,
            0
        );
        const totalPayloadMB = (totalPayloadSize / (1024 * 1024)).toFixed(2);
        console.log(`📦 Total payload size: ${totalPayloadMB} MB`);

        // Warn if payload is getting large (Vercel has ~4.5MB limit for body)
        if (totalPayloadSize > 4 * 1024 * 1024) {
            console.warn(
                `⚠️ Warning: Payload size (${totalPayloadMB} MB) is approaching Vercel's limit`
            );
        }

        // Return array of all slide images
        return NextResponse.json({
            success: true,
            totalSlides,
            slides: slideImages,
            slideType,
            dimensions: {
                width: 1080,
                height: slideType === "video" ? 1920 : 1350,
            },
            metadata: {
                totalPayloadMB,
                avgSizePerSlideKB: (
                    totalPayloadSize /
                    1024 /
                    totalSlides
                ).toFixed(2),
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
