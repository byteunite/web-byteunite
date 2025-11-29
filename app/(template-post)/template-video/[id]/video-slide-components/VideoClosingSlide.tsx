import ClickableImage from "@/components/ClickableImage";
import { VideoSlideComponentProps } from "./types";

/**
 * VIDEO_CLOSING - Slide penutup untuk video
 * Design: Clean CTA dengan social media info
 * Perfect untuk: Video ending dengan call to action
 */
export default function VideoClosingSlide({
    post,
    width,
    height,
    primaryColor,
    category,
    index,
    contentId,
}: VideoSlideComponentProps) {
    return (
        <div
            className="relative flex flex-col items-center justify-center overflow-hidden"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: primaryColor, // Solid color to match narrator area
            }}
        >
            {/* Background Image - Subtle overlay */}
            {post.prompt_untuk_image && (
                <ClickableImage
                    prompt={post.prompt_untuk_image}
                    width={width * 2}
                    height={height * 2}
                    className="absolute inset-0 object-cover"
                    style={{
                        opacity: 0.15,
                        filter: "brightness(0.8) blur(1px)",
                        mixBlendMode: "overlay",
                    }}
                    alt={post.judul_slide}
                    slideIndex={index}
                    riddleId={contentId}
                    saved_image_url={post.saved_image_url}
                    category={category}
                />
            )}

            {/* Content */}
            <div className="relative z-10 text-center px-8 space-y-6">
                {/* Main Message */}
                <h2 className="text-3xl font-bold text-white leading-tight">
                    {post.judul_slide}
                </h2>

                {/* Subtitle */}
                {post.sub_judul_slide && (
                    <p className="text-base text-white opacity-90">
                        {post.sub_judul_slide}
                    </p>
                )}

                {/* Divider */}
                <div className="flex justify-center gap-2 py-2">
                    <div className="w-2 h-2 rounded-full bg-white opacity-80" />
                    <div className="w-2 h-2 rounded-full bg-white opacity-60" />
                    <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                </div>

                {/* Social Handle */}
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full inline-block">
                    <p
                        className="font-semibold text-lg"
                        style={{ color: primaryColor }}
                    >
                        @ByteUnite.dev
                    </p>
                </div>

                {/* CTA Text */}
                {post.konten_slide && (
                    <p className="text-sm text-white opacity-80">
                        {post.konten_slide}
                    </p>
                )}
            </div>
        </div>
    );
}
