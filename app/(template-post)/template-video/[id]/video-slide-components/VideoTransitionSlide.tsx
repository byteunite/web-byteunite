import { VideoSlideComponentProps } from "./types";

/**
 * VIDEO_TRANSITION - Slide transisi antar section
 * Design: Minimal dan smooth
 * Perfect untuk: Section breaks, thinking pauses, atau transitions
 */
export default function VideoTransitionSlide({
    post,
    width,
    height,
    primaryColor,
    index,
}: VideoSlideComponentProps) {
    // Use alternating background to match page logic
    const bgColor = index % 2 === 0 ? "#FFFFFF" : "#F9FAFB";

    return (
        <div
            className="relative flex items-center justify-center"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: bgColor, // Alternating to match narrator area
            }}
        >
            {/* Animated Dots (will be animated in video) */}
            <div className="text-center space-y-8">
                {/* Icon or Emoji */}
                <div className="text-6xl">{post.sub_judul_slide || "⏳"}</div>

                {/* Text */}
                <h3 className="text-xl font-semibold text-gray-700">
                    {post.judul_slide}
                </h3>

                {/* Loading Dots Visual */}
                <div className="flex justify-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <div
                        className="w-3 h-3 rounded-full opacity-60"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <div
                        className="w-3 h-3 rounded-full opacity-30"
                        style={{ backgroundColor: primaryColor }}
                    />
                </div>
            </div>
        </div>
    );
}
