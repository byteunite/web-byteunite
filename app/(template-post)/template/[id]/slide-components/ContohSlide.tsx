import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe CONTOH
 * Menampilkan contoh hasil atau aplikasi dari tutorial
 */
export default function ContohSlide({
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
                backgroundColor: "#F0F9FF",
            }}
            className="flex items-center justify-center relative"
        >
            {/* Main image - larger for example showcase */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-70"
                style={{
                    mixBlendMode: "multiply",
                    width: `70%`,
                    height: `70%`,
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
                className="z-10 w-full h-full flex flex-col justify-between px-12 py-10"
                style={{ pointerEvents: "none" }}
            >
                {/* Top section - Header */}
                <div>
                    {/* Example badge */}
                    <div className="mb-4">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        >
                            <span className="text-lg">✨</span>
                            <span className="text-sm font-black text-white tracking-wide">
                                EXAMPLE
                            </span>
                        </div>
                    </div>

                    <h2
                        className="text-3xl font-black text-gray-900 tracking-tight mb-2"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.judul_slide),
                        }}
                    />
                    <p
                        className="text-base font-semibold text-gray-600"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.sub_judul_slide),
                        }}
                    />
                </div>

                {/* Bottom section - Description */}
                <div
                    className="p-5 rounded-xl max-w-lg"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div
                        className="text-sm leading-relaxed text-gray-700 font-medium"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.konten_slide),
                        }}
                    />
                </div>

                {/* Decorative shapes */}
                <RandomShape
                    fillColor={randomPrimaryColor}
                    strokeColor={randomPrimaryColor}
                    className="absolute -left-5 top-1/3 z-1 opacity-5"
                />
                <RandomShape
                    fillColor={randomPrimaryColor}
                    strokeColor={randomPrimaryColor}
                    className="absolute -right-8 bottom-1/4 z-1 opacity-5"
                />
            </div>
        </div>
    );
}
