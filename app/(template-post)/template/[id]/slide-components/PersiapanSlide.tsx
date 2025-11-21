import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe PERSIAPAN
 * Menampilkan tools, materials, atau prerequisites yang dibutuhkan untuk tutorial
 */
export default function PersiapanSlide({
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
                backgroundColor: "#FFFFFF",
            }}
            className="flex items-center justify-center relative"
        >
            {/* Decorative image at bottom left */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute -bottom-10 -left-20 object-cover opacity-40"
                style={{
                    mixBlendMode: "multiply",
                    width: `50%`,
                    height: `50%`,
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
                className="z-10 w-full h-full flex flex-col justify-center px-12"
                style={{ pointerEvents: "none" }}
            >
                {/* Icon/Badge untuk PERSIAPAN */}
                <div className="mb-4">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{
                            backgroundColor: `${randomPrimaryColor}20`,
                            border: `2px solid ${randomPrimaryColor}`,
                        }}
                    >
                        <span className="text-lg">📋</span>
                        <span
                            className="text-sm font-bold"
                            style={{ color: randomPrimaryColor }}
                        >
                            PREPARATION
                        </span>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-6">
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

                {/* Main content - Tools/Materials list */}
                <div className="space-y-3 max-w-lg">
                    <div
                        className="text-sm leading-relaxed text-gray-700 font-medium"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.konten_slide),
                        }}
                    />
                </div>

                {/* Decorative shape */}
                <RandomShape
                    fillColor={randomPrimaryColor}
                    strokeColor={randomPrimaryColor}
                    className="absolute -right-5 top-20 z-1 opacity-5"
                />
            </div>
        </div>
    );
}
