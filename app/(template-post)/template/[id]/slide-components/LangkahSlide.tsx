import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe LANGKAH
 * Menampilkan langkah-langkah tutorial yang jelas dan berurutan
 */
export default function LangkahSlide({
    post,
    index,
    width,
    height,
    riddleId,
    randomPrimaryColor,
    category,
}: SlideComponentProps) {
    // Extract step number from judul_slide jika ada (contoh: "Langkah 1: ..." atau "Step 1: ...")
    const stepMatch = post.judul_slide.match(/(?:Langkah|Step)\s*(\d+)/i);
    const stepNumber = stepMatch ? stepMatch[1] : null;

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
            {/* Large step number watermark */}
            {stepNumber && (
                <div
                    className="absolute text-9xl font-black opacity-5"
                    style={{
                        color: randomPrimaryColor,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "20rem",
                        lineHeight: 1,
                        zIndex: 1,
                    }}
                >
                    {stepNumber}
                </div>
            )}

            {/* Decorative image at top center */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 object-cover opacity-60"
                style={{
                    mixBlendMode: "multiply",
                    width: `40%`,
                    height: `40%`,
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
                {/* Step badge */}
                {stepNumber && (
                    <div className="mb-4">
                        <div
                            className="inline-flex items-center justify-center w-12 h-12 rounded-full font-black text-xl text-white"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        >
                            {stepNumber}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <h2
                        className="text-3xl font-black text-gray-900 tracking-tight mb-2"
                        style={{ color: randomPrimaryColor }}
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

                {/* Main content - Step instructions */}
                <div className="space-y-4 max-w-lg">
                    <div
                        className="text-sm leading-relaxed text-gray-700 font-medium"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.konten_slide),
                        }}
                    />
                </div>

                {/* Decorative arrow */}
                <div
                    className="absolute bottom-10 right-10 text-4xl opacity-20"
                    style={{ color: randomPrimaryColor }}
                >
                    →
                </div>

                {/* Decorative shape */}
                <RandomShape
                    fillColor={randomPrimaryColor}
                    strokeColor={randomPrimaryColor}
                    className="absolute -left-5 -bottom-5 z-1 opacity-5"
                />
            </div>
        </div>
    );
}
