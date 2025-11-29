import { VideoSlideComponentProps } from "./types";

/**
 * VIDEO_QUOTE - Slide untuk menampilkan quote atau highlight text
 * Design: Elegant dengan quotation marks
 * Perfect untuk: Key takeaways, quotes, atau important statements
 */
export default function VideoQuoteSlide({
    post,
    width,
    height,
    primaryColor,
}: VideoSlideComponentProps) {
    return (
        <div
            className="relative flex items-center justify-center"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: "#FFFFFF",
            }}
        >
            {/* Large Quote Mark Background */}
            <div
                className="absolute top-8 left-8 text-9xl font-serif opacity-5"
                style={{
                    color: primaryColor,
                }}
            >
                "
            </div>

            {/* Content */}
            <div className="relative text-center px-12 space-y-6">
                {/* Quote Text */}
                <blockquote className="text-xl font-medium text-gray-800 leading-relaxed italic">
                    "{post.judul_slide}"
                </blockquote>

                {/* Author or Source */}
                {post.sub_judul_slide && (
                    <div className="flex justify-center">
                        <div
                            className="px-4 py-2 rounded-full text-xs font-semibold"
                            style={{
                                backgroundColor: `${primaryColor}15`,
                                color: primaryColor,
                            }}
                        >
                            {post.sub_judul_slide}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Quote Mark */}
            <div
                className="absolute bottom-8 right-8 text-9xl font-serif opacity-5"
                style={{
                    color: primaryColor,
                }}
            >
                "
            </div>
        </div>
    );
}
