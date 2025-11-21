import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe TIPS
 * Menampilkan tips penting atau hal yang perlu diperhatikan dalam tutorial
 */
export default function TipsSlide({
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
                backgroundColor: "#FFF9E6",
            }}
            className="flex items-center justify-center relative"
        >
            {/* Lightbulb icon background */}
            <div
                className="absolute text-9xl opacity-5"
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "15rem",
                    zIndex: 1,
                }}
            >
                💡
            </div>

            {/* Decorative image at top right */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute -top-10 -right-10 object-cover opacity-50"
                style={{
                    mixBlendMode: "multiply",
                    width: `45%`,
                    height: `45%`,
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
                {/* Tips badge */}
                <div className="mb-4">
                    <div
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg"
                        style={{
                            backgroundColor: randomPrimaryColor,
                        }}
                    >
                        <span className="text-2xl">💡</span>
                        <span className="text-base font-black text-white tracking-wide">
                            PRO TIPS
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
                        className="text-base font-semibold"
                        style={{ color: randomPrimaryColor }}
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.sub_judul_slide),
                        }}
                    />
                </div>

                {/* Main content - Tips */}
                <div
                    className="space-y-4 max-w-lg p-6 rounded-xl"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        border: `3px solid ${randomPrimaryColor}`,
                    }}
                >
                    <div
                        className="text-sm leading-relaxed text-gray-800 font-medium"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.konten_slide),
                        }}
                    />
                </div>

                {/* Decorative shapes */}
                <RandomShape
                    fillColor={randomPrimaryColor}
                    strokeColor={randomPrimaryColor}
                    className="absolute -right-8 bottom-20 z-1 opacity-10"
                />
                <RandomShape
                    fillColor={randomPrimaryColor}
                    strokeColor={randomPrimaryColor}
                    className="absolute left-10 -top-5 z-1 opacity-10"
                />
            </div>
        </div>
    );
}
