import { Feather, UserPlus } from "lucide-react";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe SOLUSI dan FINAL
 * Menampilkan jawaban atau kesimpulan dengan icon yang sesuai
 */
export default function SolusiSlide({
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
                zIndex: 98,
            }}
            className="flex items-center justify-center overflow-visible relative flex-col bg-white"
        >
            <div className="z-10 w-full h-full flex flex-col items-center justify-center">
                <div className="m-auto w-64">
                    {/* circle with icon */}
                    <div
                        className="rounded-full text-white w-14 h-14 flex items-center justify-center mb-4"
                        style={{
                            backgroundColor: randomPrimaryColor,
                        }}
                    >
                        {post.tipe_slide === "FINAL" && (
                            <UserPlus className="text-5xl" />
                        )}
                        {post.tipe_slide === "SOLUSI" && <Feather />}
                    </div>
                    <div className="mb-1">
                        <span
                            className={` text-white px-2 text-xs py-1 mb-1`}
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.judul_slide),
                            }}
                        />
                    </div>
                    <h5
                        className="text-2xl text-gray-600 tracking-wide inline leading-6"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.sub_judul_slide),
                        }}
                    />
                    <div className="z-10 w-full leading-5 mt-2">
                        <span
                            className="text-xs bg-white opacity-75 tracking-wide inline text-gray-500"
                            dangerouslySetInnerHTML={{
                                __html: post.konten_slide,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
