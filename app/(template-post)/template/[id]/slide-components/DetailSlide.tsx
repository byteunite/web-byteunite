import ClickableImage from "@/components/ClickableImage";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe DETAIL
 * Menampilkan detail atau penjelasan mendalam dengan layout yang fokus pada konten
 */
export default function DetailSlide({
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
                backgroundColor: "#F8F9FA",
            }}
            className="flex items-center justify-center overflow-hidden relative"
        >
            {/* Background image with low opacity */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute inset-0 object-cover opacity-10"
                style={{
                    filter: `brightness(1.3) contrast(0.9) blur(2px)`,
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

            {/* Content overlay */}
            <div
                className=" w-full h-full flex flex-col justify-center px-12 py-10"
                style={{ pointerEvents: "none", zIndex: 1000 }}
            >
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                    {/* Title section */}
                    <div className="mb-5">
                        <h2
                            className="text-2xl font-bold mb-2"
                            style={{
                                color: randomPrimaryColor,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.judul_slide),
                            }}
                        />
                        <div
                            className="h-1 w-16 mb-3"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        ></div>
                        <p
                            className="text-sm font-semibold text-gray-600"
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(
                                    post.sub_judul_slide
                                ),
                            }}
                        />
                    </div>

                    {/* Detailed content */}
                    <div
                        className="text-sm leading-relaxed text-gray-800"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.konten_slide),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
