import { VideoSlideComponentProps } from "./types";

/**
 * VIDEO_POINT - Slide untuk menampilkan satu poin penting
 * Design: Clean dengan fokus pada satu statement
 * Perfect untuk: Highlight key points, facts, atau statements
 */
export default function VideoPointSlide({
    post,
    width,
    height,
    primaryColor,
    index,
}: VideoSlideComponentProps) {
    // Alternate background
    const isEven = index % 2 === 0;
    const bgColor = isEven ? "#FFFFFF" : "#F9FAFB";

    return (
        <div
            className="relative flex items-center justify-center"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: bgColor,
            }}
        >
            {/* Content Container */}
            <div className="text-center px-10 space-y-6">
                {/* Number Badge */}
                <div className="flex justify-center">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{
                            backgroundColor: primaryColor,
                        }}
                    >
                        {index + 1}
                    </div>
                </div>

                {/* Main Point */}
                <h2 className="text-2xl font-bold text-gray-800 leading-snug">
                    {post.judul_slide}
                </h2>

                {/* Supporting Text */}
                {post.konten_slide && (
                    <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                        {post.konten_slide}
                    </p>
                )}

                {/* Decorative Line */}
                <div className="flex justify-center pt-4">
                    <div
                        className="w-16 h-0.5 rounded-full"
                        style={{
                            backgroundColor: primaryColor,
                            opacity: 0.3,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
