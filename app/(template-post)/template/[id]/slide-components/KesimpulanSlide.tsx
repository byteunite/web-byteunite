import ClickableImage from "@/components/ClickableImage";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe KESIMPULAN
 * Menampilkan ringkasan atau kesimpulan dengan layout yang clear dan impactful
 */
export default function KesimpulanSlide({
    post,
    index,
    width,
    height,
    riddleId,
    randomPrimaryColor,
    category,
}: SlideComponentProps) {
    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                left: `${(index * 1080) / 2.5}px`,
                position: "absolute",
                backgroundColor: "#1F2937",
            }}
            className="flex items-center justify-center overflow-hidden relative"
        >
            {/* Subtle background image */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute inset-0 object-cover opacity-15"
                style={{
                    filter: `brightness(0.8) contrast(1.1)`,
                    mixBlendMode: "screen",
                    width: `100%`,
                    height: `100%`,
                    zIndex: 999,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
                category={category}
            />

            {/* Content container */}
            <div
                className="z-10 w-full h-full flex flex-col justify-center px-12 py-10"
                style={{ pointerEvents: "none" }}
            >
                {/* Decorative top element */}
                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-12 h-1"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        ></div>
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
                            Kesimpulan
                        </span>
                    </div>
                </div>

                {/* Main title */}
                <div className="mb-6">
                    <h2
                        className="text-4xl font-black text-white mb-3 leading-tight"
                        style={{
                            textShadow: `3px 3px 0px ${randomPrimaryColor}`,
                        }}
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.judul_slide),
                        }}
                    />
                    <p
                        className="text-base font-semibold text-white/80"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.sub_judul_slide),
                        }}
                    />
                </div>

                {/* Summary content */}
                <div className="max-w-lg">
                    <div
                        className="bg-white/10 backdrop-blur-sm border-l-4 rounded-r-lg p-5 mb-6"
                        style={{
                            borderColor: randomPrimaryColor,
                        }}
                    >
                        <div
                            className="text-sm leading-relaxed text-white/90"
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.konten_slide),
                            }}
                        />
                    </div>
                </div>

                {/* Bottom accent */}
                <div className="mt-auto">
                    <div
                        className="h-2 w-32 rounded-full"
                        style={{
                            backgroundColor: randomPrimaryColor,
                            opacity: 0.6,
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
