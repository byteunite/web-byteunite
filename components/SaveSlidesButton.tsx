"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface SaveSlidesButtonProps {
    riddleId: string;
    totalSlides: number;
    category?: string;
}

export default function SaveSlidesButton({
    riddleId,
    totalSlides,
    category = "riddles",
}: SaveSlidesButtonProps) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>("");

    const captureAndSaveSlides = async () => {
        setLoading(true);
        setProgress(0);
        setStatus("Memulai proses capture...");

        try {
            // Step 1: Screenshot FULL page (semua slides sekaligus)
            setStatus("Capturing semua slides sekaligus...");
            setProgress(10);

            // Validasi kategori yang valid
            const validCategories = ["riddles", "sites"];
            const validatedCategory = validCategories.includes(category)
                ? category
                : "riddles";

            const screenshotResponse = await fetch(
                `/api/${validatedCategory}/screenshot-full`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        riddleId,
                        totalSlides,
                    }),
                }
            );

            if (!screenshotResponse.ok) {
                const errorText = await screenshotResponse.text();
                console.error("Screenshot failed:", errorText);
                throw new Error("Gagal capture screenshots");
            }

            const screenshotData = await screenshotResponse.json();

            if (!screenshotData.success || !screenshotData.slides) {
                throw new Error("Invalid screenshot data");
            }

            console.log(`✅ Got ${screenshotData.slides.length} slide images`);
            setProgress(30);

            // Step 2: Upload slides SATU PER SATU untuk menghindari 413 error
            setStatus("Mengupload slides ke cloud storage...");

            const uploadResults = [];
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < screenshotData.slides.length; i++) {
                const slide = screenshotData.slides[i];

                // Update progress
                const uploadProgress =
                    30 + (i / screenshotData.slides.length) * 60;
                setProgress(uploadProgress);
                setStatus(
                    `Mengupload slide ${i + 1}/${
                        screenshotData.slides.length
                    }...`
                );

                try {
                    // Upload slide satu per satu
                    const uploadResponse = await fetch(
                        `/api/${validatedCategory}/save-slide-single`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                riddleId,
                                slideIndex: slide.slideIndex,
                                dataUrl: slide.dataUrl,
                            }),
                        }
                    );

                    if (!uploadResponse.ok) {
                        const errorData = await uploadResponse.json();
                        console.error(
                            `Failed to upload slide ${i}:`,
                            errorData
                        );
                        failCount++;
                        uploadResults.push({
                            slideIndex: slide.slideIndex,
                            success: false,
                            error: errorData.message || "Upload failed",
                        });
                    } else {
                        const result = await uploadResponse.json();
                        successCount++;
                        uploadResults.push({
                            slideIndex: slide.slideIndex,
                            success: true,
                            imageUrl: result.data?.imageUrl,
                        });
                        console.log(`✅ Slide ${i + 1} uploaded successfully`);
                    }
                } catch (error) {
                    console.error(`Error uploading slide ${i}:`, error);
                    failCount++;
                    uploadResults.push({
                        slideIndex: slide.slideIndex,
                        success: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : "Unknown error",
                    });
                }

                // Small delay to prevent rate limiting
                await new Promise((resolve) => setTimeout(resolve, 200));
            }

            setProgress(100);

            if (failCount === 0) {
                setStatus(`✅ Semua ${successCount} slide berhasil disimpan!`);
            } else {
                setStatus(
                    `⚠️ ${successCount} berhasil, ${failCount} gagal dari ${totalSlides} slides`
                );
            }

            // Refresh halaman setelah 2 detik
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            setStatus(
                "❌ Terjadi kesalahan: " +
                    (error instanceof Error ? error.message : "Unknown error")
            );
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-9999">
            <div className="max-w-2xl mx-auto">
                <div className="flex flex-col gap-3">
                    {loading && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{status}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={captureAndSaveSlides}
                        disabled={loading}
                        size="lg"
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Save All Slides to Cloud
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                        Akan menyimpan {totalSlides} slides sebagai gambar ke
                        cloud storage
                    </p>
                </div>
            </div>
        </div>
    );
}
