import { Search } from "lucide-react";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe WARNING_ANSWER
 * Menampilkan slide peringatan sebelum jawaban ditampilkan
 *
 * Konsep:
 * - Slide ini berfungsi sebagai pembatas antara pertanyaan dan jawaban
 * - Memberikan kesempatan kepada viewer untuk berpikir sebelum melihat jawaban
 * - Design simple dengan pesan yang jelas
 */
export default function WarningAnswerSlide({
    post,
    index,
    width,
    height,
    randomPrimaryColor,
}: SlideComponentProps) {
    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                left: `${(index * 1080) / 2.5}px`,
                position: "absolute",
                background: "white",
            }}
            className="flex items-center justify-center overflow-hidden relative flex-col"
        >
            {/* Icon warning besar sebagai focal point */}
            <div
                className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                    opacity: 0.2,
                }}
            >
                <span
                    style={{
                        color: randomPrimaryColor,
                    }}
                >
                    <Search className="w-[100px] h-[100px]" />
                </span>
            </div>

            {/* Content area */}
            <div className="z-10 w-full h-full flex flex-col items-center justify-center px-10 mt-5">
                <div className="text-center space-y-4">
                    {/* Title dengan border styling */}
                    <div
                        className="inline-block px-2 py-1"
                        style={{
                            backgroundColor: randomPrimaryColor,
                        }}
                    >
                        <span
                            className="text-sm font-bold tracking-wide"
                            style={{
                                color: "white",
                            }}
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.judul_slide),
                            }}
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="mt-6">
                        <p
                            className="text-lg text-gray-700 font-semibold leading-5"
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(
                                    post.sub_judul_slide
                                ),
                            }}
                        />
                    </div>

                    {/* Content dengan box */}
                    <div className="mt-4 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-lg max-w-xs mx-auto">
                        <p
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{
                                __html: post.konten_slide,
                            }}
                        />
                    </div>

                    {/* Decorative line */}
                    <div className="mt-8 flex items-center justify-center space-x-2">
                        <div
                            className="h-1 w-12 rounded-full"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        ></div>
                        <div
                            className="h-1 w-1 rounded-full"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        ></div>
                        <div
                            className="h-1 w-1 rounded-full"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        ></div>
                        <div
                            className="h-1 w-1 rounded-full"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
