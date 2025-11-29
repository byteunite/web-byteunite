import { VideoSlideComponentProps } from "./types";

/**
 * VIDEO_QUESTION - Slide untuk menampilkan pertanyaan
 * Design: Engaging dengan question mark icon
 * Perfect untuk: Quiz, riddles, atau engagement questions
 */
export default function VideoQuestionSlide({
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
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${primaryColor} 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                }}
            />

            {/* Content */}
            <div className="relative text-center px-8 space-y-6">
                {/* Question Icon */}
                <div className="flex justify-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-5xl font-bold"
                        style={{
                            backgroundColor: primaryColor,
                        }}
                    >
                        ?
                    </div>
                </div>

                {/* Question Title */}
                <h2 className="text-2xl font-bold text-gray-800 leading-snug px-4">
                    {post.judul_slide}
                </h2>

                {/* Question Details */}
                {post.konten_slide && (
                    <div
                        className="text-base text-gray-700 leading-relaxed max-w-xs mx-auto px-4 py-3 rounded-lg"
                        style={{
                            backgroundColor: `${primaryColor}10`,
                        }}
                    >
                        {post.konten_slide}
                    </div>
                )}
            </div>
        </div>
    );
}
