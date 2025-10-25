export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

// Detect if running on Vercel
const isVercel = !!process.env.VERCEL_ENV;

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
            };
        } else {
            // Local development: use full puppeteer
            puppeteer = await import("puppeteer");
            launchOptions = {
                ...launchOptions,
                args: ["--no-sandbox"],
                executablePath:
                    process.platform === "win32"
                        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
                        : process.platform === "darwin"
                        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
                        : "/usr/bin/google-chrome",
            };
        }

        // Launch browser dengan config yang sudah ditentukan
        const browser = await puppeteer.launch(launchOptions);

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
        const slideInfo = await page.evaluate((index: number) => {
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
