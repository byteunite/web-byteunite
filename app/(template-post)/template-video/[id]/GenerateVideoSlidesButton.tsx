"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GenerateVideoSlidesButtonProps {
    contentId: string;
    category: string;
    hasCarouselData: boolean;
}

export default function GenerateVideoSlidesButton({
    contentId,
    category,
    hasCarouselData,
}: GenerateVideoSlidesButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Redirect ke halaman yang sama dengan parameter useAI=true
            const currentUrl = `/template-video/${contentId}?data=${category}&useAI=true`;
            router.push(currentUrl);
            router.refresh();
        } catch (err) {
            setError("Gagal generate video slides");
            setIsGenerating(false);
        }
    };

    if (!hasCarouselData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md shadow-xl">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 mx-auto text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Data Carousel Tidak Tersedia
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Konten ini belum memiliki data carousel. Silakan
                            buat carousel terlebih dahulu di{" "}
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                /template/{contentId}
                            </code>
                        </p>
                        <a
                            href={`/template/${contentId}?data=${category}`}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Buka Template Carousel
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md shadow-xl">
                <div className="text-center">
                    <div className="mb-4">
                        <svg
                            className="w-16 h-16 mx-auto text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Generate Video Slides
                    </h3>

                    <p className="text-gray-600 mb-6">
                        Video slides belum tersedia untuk konten ini. Klik
                        tombol di bawah untuk generate video slides menggunakan
                        AI dari data carousel yang ada.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                <span>Generate Video Slides dengan AI</span>
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-500 mt-4">
                        Proses ini menggunakan Gemini AI untuk mengkonversi
                        carousel slides menjadi format video
                        (TikTok/Reels/Shorts)
                    </p>
                </div>
            </div>
        </div>
    );
}
