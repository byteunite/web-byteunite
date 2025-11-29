import ClickableImage from "@/components/ClickableImage";
import { VideoSlideComponentProps } from "./types";

/**
 * VIDEO_COVER - Slide pembuka untuk video background
 * Design: Simple, bold, fokus pada judul dengan minimal distraction
 * Perfect untuk: Opening video dengan narrator introduction
 */
export default function VideoCoverSlide({
    post,
    width,
    height,
    primaryColor,
    index,
    contentId,
    category,
}: VideoSlideComponentProps) {
    return (
        <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: "#FAFAFA", // Solid color to match narrator area
            }}
        >
            {/* Background Image - Subtle and minimal */}
            {post.prompt_untuk_image && (
                <ClickableImage
                    prompt={post.prompt_untuk_image}
                    width={width * 2}
                    height={height * 2}
                    className="absolute inset-0 object-cover"
                    style={{
                        opacity: 0.08,
                        filter: "grayscale(50%) blur(1px)",
                        mixBlendMode: "multiply",
                    }}
                    alt={post.judul_slide}
                    slideIndex={index}
                    riddleId={contentId}
                    saved_image_url={post.saved_image_url}
                    category={category}
                    slideType="video"
                />
            )}

            {/* Main Title - Large and Bold */}
            <div className="relative z-10 text-center px-8 space-y-4">
                <div className="inline-block">
                    <h1
                        className="text-4xl font-bold tracking-tight leading-tight px-4 py-2"
                        style={{
                            color: primaryColor,
                        }}
                    >
                        {post.judul_slide}
                    </h1>
                </div>

                {/* Subtitle if exists */}
                {post.sub_judul_slide && (
                    <p className="text-lg text-gray-600 font-medium max-w-xs mx-auto">
                        {post.sub_judul_slide}
                    </p>
                )}

                {/* Decorative element */}
                <div className="flex justify-center gap-2 mt-6">
                    <div
                        className="w-12 h-1 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <div
                        className="w-8 h-1 rounded-full opacity-50"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <div
                        className="w-4 h-1 rounded-full opacity-30"
                        style={{ backgroundColor: primaryColor }}
                    />
                </div>
            </div>
        </div>
    );
}
