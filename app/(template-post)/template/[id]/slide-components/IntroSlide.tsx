import ClickableImage from "@/components/ClickableImage";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe INTRO
 * Menampilkan slide pembuka dengan judul, subjudul, dan konten perkenalan
 */
export default function IntroSlide({
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
            className="flex items-center justify-center overflow-hidden relative"
        >
            {/* Image positioned on the right side */}
            <ClickableImage
                prompt={`${post.prompt_untuk_image}&enhance=true`}
                width={width * 2}
                height={height * 2}
                className="absolute -right-20 object-cover opacity-80"
                style={{
                    filter: `brightness(1.1) contrast(1.2)`,
                    mixBlendMode: "multiply",
                    width: `45%`,
                    height: `100%`,
                    zIndex: 999,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
                category={category}
            />

            {/* Content on the left side */}
            <div className="z-10 px-12 w-full">
                <div className="mb-3">
                    <h2
                        className="text-4xl font-extrabold inline px-0 py-2 tracking-wide"
                        style={{
                            color: randomPrimaryColor,
                        }}
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.judul_slide),
                        }}
                    />
                </div>
                <div className="mb-4">
                    <span
                        className="text-lg font-semibold text-gray-700 inline-block bg-gray-100 px-3 py-1"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.sub_judul_slide),
                        }}
                    />
                </div>
                <div className="leading-relaxed">
                    <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.konten_slide),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
