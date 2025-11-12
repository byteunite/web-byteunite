import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe BENEFITS
 * Menampilkan keuntungan/manfaat dengan emphasis yang kuat
 */
export default function BenefitsSlide({
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
            className="flex items-center justify-center overflow-visible relative"
        >
            {/* Decorative image at top right */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute -top-20 -right-25 object-cover opacity-70"
                style={{
                    filter: `brightness(1.1) contrast(1.3)`,
                    mixBlendMode: "multiply",
                    width: `55%`,
                    zIndex: 999,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
                category={category}
            />

            {/* Content container */}
            <div className="z-10 w-full h-full flex flex-col justify-center px-12">
                <div className="max-w-lg">
                    {/* Header with primary color background */}
                    <div className="mb-3">
                        <h2
                            className="text-3xl font-bold tracking-wide inline-block px-4 py-2 text-white"
                            style={{
                                color: randomPrimaryColor,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.judul_slide),
                            }}
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="mb-5">
                        <span
                            className="text-base font-semibold text-gray-600 bg-yellow-100 px-3 py-1 inline-block"
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(
                                    post.sub_judul_slide
                                ),
                            }}
                        />
                    </div>

                    {/* Benefits list with enhanced styling */}
                    <div className="space-y-3 bg-white/80 p-4 rounded-sm">
                        <div
                            className="text-sm leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.konten_slide),
                            }}
                        />
                    </div>

                    {/* Decorative shape */}
                    <RandomShape
                        fillColor={randomPrimaryColor}
                        strokeColor={randomPrimaryColor}
                        className="absolute -left-15 bottom-15 z-1 opacity-8"
                    />
                </div>
            </div>
        </div>
    );
}
