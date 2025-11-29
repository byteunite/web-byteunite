import ClickableImage from "@/components/ClickableImage";
import { VideoSlideComponentProps } from "./types";

/**
 * VIDEO_ANSWER - Slide untuk menampilkan jawaban
 * Design: Clear dan confident dengan checkmark
 * Perfect untuk: Solutions, answers, atau reveals
 */
export default function VideoAnswerSlide({
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
                background: `linear-gradient(135deg, ${primaryColor}08 0%, #FFFFFF 50%, ${primaryColor}08 100%)`,
            }}
        >
            {/* Background Image - Subtle corner accent */}
            {post.prompt_untuk_image && (
                <ClickableImage
                    prompt={post.prompt_untuk_image}
                    width={width * 2}
                    height={height * 2}
                    className="absolute -top-5 -left-5 object-cover"
                    style={{
                        opacity: 0.08,
                        filter: "grayscale(60%)",
                        width: "35%",
                        height: "35%",
                    }}
                    alt={post.judul_slide}
                    slideIndex={index}
                    riddleId={contentId}
                    saved_image_url={post.saved_image_url}
                    category={category}
                    slideType="video"
                />
            )}

            {/* Content */}
            <div className="relative z-10 text-center px-8 space-y-6">
                {/* Checkmark Icon */}
                <div className="flex justify-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                        style={{
                            backgroundColor: primaryColor,
                        }}
                    >
                        ✓
                    </div>
                </div>

                {/* Label */}
                {post.sub_judul_slide && (
                    <div className="inline-block">
                        <span
                            className="text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full text-white"
                            style={{
                                backgroundColor: primaryColor,
                            }}
                        >
                            {post.sub_judul_slide}
                        </span>
                    </div>
                )}

                {/* Answer */}
                <h2 className="text-3xl font-bold text-gray-800 leading-tight px-4">
                    {post.judul_slide}
                </h2>

                {/* Explanation */}
                {post.konten_slide && (
                    <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                        {post.konten_slide}
                    </p>
                )}
            </div>
        </div>
    );
}
