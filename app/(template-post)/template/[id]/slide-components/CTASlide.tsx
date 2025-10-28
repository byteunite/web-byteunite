import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe CTA (Call To Action)
 * Menampilkan ajakan bertindak dengan desain yang menarik perhatian
 */
export default function CTASlide({
    post,
    index,
    width,
    height,
    riddleId,
    randomPrimaryColor,
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
            {/* Gradient background */}
            {/* <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(135deg, ${randomPrimaryColor}20 0%, #FFFFFF 50%, ${randomPrimaryColor}10 100%)`,
                }}
            /> */}

            {/* Decorative image at bottom left */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute -bottom-20 -left-15 object-cover opacity-60"
                style={{
                    filter: `brightness(1.1) contrast(1.3)`,
                    mixBlendMode: "multiply",
                    width: `45%`,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
            />

            {/* Content container */}
            <div className="z-10 w-full h-full flex flex-col justify-center items-center px-12">
                <div className="max-w-xl text-center">
                    {/* Main CTA title with large emphasis */}
                    <div className="mb-4">
                        <h2
                            className="text-4xl font-bold tracking-tight inline-block px-6 py-3 text-white"
                            style={{
                                backgroundColor: randomPrimaryColor,
                                boxShadow: `0 4px 6px -1px ${randomPrimaryColor}40`,
                            }}
                        >
                            {post.judul_slide}
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <div className="mb-6">
                        <span className="text-xl font-semibold text-gray-700 bg-white/80 px-4 py-2 inline-block rounded-sm">
                            {post.sub_judul_slide}
                        </span>
                    </div>

                    {/* CTA content */}
                    <div className="bg-white/90 p-6 rounded-sm shadow-lg">
                        <div
                            className="text-base leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: post.konten_slide.replace(
                                    /\n\n/g,
                                    "<br/><br/>"
                                ),
                            }}
                        />
                    </div>

                    {/* Decorative shapes for visual appeal */}
                    <RandomShape
                        fillColor={randomPrimaryColor}
                        strokeColor={randomPrimaryColor}
                        className="absolute top-20 right-15 z-1 opacity-10"
                    />
                    <RandomShape
                        fillColor={randomPrimaryColor}
                        strokeColor={randomPrimaryColor}
                        className="absolute -bottom-10 right-30 z-1 opacity-10"
                    />
                </div>
            </div>
        </div>
    );
}
