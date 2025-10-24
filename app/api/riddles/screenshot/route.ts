import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

// Konfigurasi untuk production (Vercel)
const isProduction = process.env.NODE_ENV === "production";

/**
 * API Endpoint untuk capture screenshot menggunakan Puppeteer
 * Menghasilkan gambar yang 100% identik dengan tampilan browser
 *
 * Approach: Screenshot full page dengan clip pada koordinat slide tertentu
 */
export async function POST(request: NextRequest) {
    try {
        const { riddleId, slideIndex } = await request.json();

        if (!riddleId || slideIndex === undefined) {
            return NextResponse.json(
                { error: "riddleId and slideIndex are required" },
                { status: 400 }
            );
        }

        // Build URL untuk screenshot
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const url = `${baseUrl}/template/${riddleId}?screenshot=true`;

        console.log(`📸 Capturing screenshot for slide ${slideIndex}: ${url}`);

        // Launch browser dengan config untuk production/development
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

        // Set viewport besar untuk menampung semua slides
        await page.setViewport({
            width: 2000,
            height: 1600,
            deviceScaleFactor: 2, // High DPI untuk kualitas tinggi
        });

        // Navigate ke halaman
        await page.goto(url, {
            waitUntil: "networkidle2", // Wait sampai network idle
            timeout: 30000,
        });

        // Wait untuk fonts dan images
        await page.evaluateHandle("document.fonts.ready");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Get slide dimensions dan calculate position
        const slideInfo = await page.evaluate((index) => {
            const wrapper = document.querySelector(
                `[data-slide-index="${index}"]`
            );
            if (!wrapper) {
                return null;
            }

            // Find the positioned child with actual dimensions
            const positioned = Array.from(wrapper.querySelectorAll("*")).find(
                (el) => {
                    const style = window.getComputedStyle(el as Element);
                    const elem = el as HTMLElement;
                    return (
                        style.position === "absolute" &&
                        elem.offsetWidth > 100 &&
                        elem.offsetHeight > 100 &&
                        !style.borderWidth.includes("1px")
                    ); // Skip borders
                }
            ) as HTMLElement;

            if (!positioned) {
                console.error("No positioned element found for slide", index);
                return null;
            }

            const rect = positioned.getBoundingClientRect();

            return {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
            };
        }, slideIndex);

        if (!slideInfo) {
            await browser.close();
            return NextResponse.json(
                {
                    error: `Slide ${slideIndex} tidak ditemukan atau tidak memiliki ukuran`,
                },
                { status: 404 }
            );
        }

        console.log(`✅ Slide ${slideIndex} info:`, slideInfo);

        // Screenshot dengan clip pada area slide
        const screenshot = await page.screenshot({
            type: "png",
            encoding: "base64",
            clip: {
                x: slideInfo.x,
                y: slideInfo.y,
                width: slideInfo.width,
                height: slideInfo.height,
            },
        });

        await browser.close();

        console.log(`✅ Screenshot captured for slide ${slideIndex}`);

        // Return base64 image
        return NextResponse.json({
            success: true,
            slideIndex,
            imageData: `data:image/png;base64,${screenshot}`,
            dimensions: {
                width: slideInfo.width,
                height: slideInfo.height,
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
