import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe USE_CASE
 * Menampilkan skenario penggunaan praktis dengan layout yang jelas
 */
export default function UseCaseSlide({
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
                backgroundColor: "#F3F4F6",
            }}
            className="flex items-center justify-center overflow-visible relative flex-col"
        >
            {/* Centered decorative image */}
            <div className="relative w-full h-64 mt-10">
                <ClickableImage
                    prompt={post.prompt_untuk_image || ""}
                    width={width * 2}
                    height={height * 2}
                    className="absolute left-0 right-0 top-0 bottom-0 object-contain w-full h-full opacity-50"
                    style={{
                        filter: `brightness(1.2) contrast(1.2)`,
                        mixBlendMode: "multiply",
                    }}
                    alt={post.judul_slide}
                    slideIndex={index}
                    riddleId={riddleId}
                    saved_image_url={post.saved_image_url}
                    category={category}
                />
            </div>

            {/* Content container */}
            <div className="z-10 w-full h-full flex flex-col items-center px-10">
                <div className="max-w-2xl text-center">
                    {/* Title badge */}
                    <div className="mb-3">
                        <span
                            className="text-xs font-bold uppercase tracking-wider px-4 py-2 text-white inline-block"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.judul_slide),
                            }}
                        />
                    </div>

                    {/* Subtitle */}
                    <h3
                        className="text-2xl font-bold text-gray-800 mb-6"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.sub_judul_slide),
                        }}
                    />

                    {/* Use case content with white background for better readability */}
                    <div className="bg-white/90 p-6 rounded-sm shadow-sm">
                        <div
                            className="text-sm leading-relaxed text-gray-700 text-left"
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.konten_slide),
                            }}
                        />
                    </div>

                    {/* Decorative shapes */}
                    <RandomShape
                        fillColor={randomPrimaryColor}
                        strokeColor={randomPrimaryColor}
                        className="absolute top-10 left-10 z-1 opacity-5"
                    />
                    <RandomShape
                        fillColor={randomPrimaryColor}
                        strokeColor={randomPrimaryColor}
                        className="absolute bottom-10 right-10 z-1 opacity-5"
                    />
                </div>
            </div>
        </div>
    );
}
