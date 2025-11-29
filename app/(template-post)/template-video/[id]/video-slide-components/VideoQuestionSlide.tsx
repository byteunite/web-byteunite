import ClickableImage from "@/components/ClickableImage";
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
                backgroundColor: "#FFFFFF",
            }}
        >
            {/* Background Image - Very minimal, center blur */}
            {post.prompt_untuk_image && (
                <ClickableImage
                    prompt={post.prompt_untuk_image}
                    width={width * 2}
                    height={height * 2}
                    className="absolute inset-0 object-cover"
                    style={{
                        opacity: 0.05,
                        filter: "grayscale(80%) blur(2px)",
                    }}
                    alt={post.judul_slide}
                    slideIndex={index}
                    riddleId={contentId}
                    saved_image_url={post.saved_image_url}
                    category={category}
                    slideType="video"
                />
            )}

            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${primaryColor} 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-8 space-y-6">
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
