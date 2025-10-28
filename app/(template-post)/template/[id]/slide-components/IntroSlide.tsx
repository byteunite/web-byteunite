import ClickableImage from "@/components/ClickableImage";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe INTRO
 * Menampilkan slide pembuka dengan judul, subjudul, dan konten perkenalan
 */
export default function IntroSlide({
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
            className="flex items-center justify-center overflow-hidden relative"
        >
            {/* Image positioned on the right side */}
            <ClickableImage
                prompt={`${post.prompt_untuk_image}&enhance=true`}
                width={width * 2}
                height={height * 2}
                className="absolute -right-20 object-cover opacity-80"
                style={{
                    filter: `brightness(1.1) contrast(1.2)`,
                    mixBlendMode: "multiply",
                    width: `45%`,
                    height: `100%`,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
            />

            {/* Content on the left side */}
            <div className="z-10 px-12 w-4/5">
                <div className="mb-3">
                    <h2
                        className="text-4xl font-bold tracking-tight inline-block px-3 py-2"
                        style={{
                            backgroundColor: randomPrimaryColor,
                            color: "#FFFFFF",
                        }}
                    >
                        {post.judul_slide}
                    </h2>
                </div>
                <div className="mb-4">
                    <span className="text-lg font-semibold text-gray-700 inline-block bg-gray-100 px-3 py-1">
                        {post.sub_judul_slide}
                    </span>
                </div>
                <div className="leading-relaxed">
                    <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                            __html: post.konten_slide,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
