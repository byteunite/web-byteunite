import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe POIN_UTAMA
 * Menampilkan poin-poin penting dengan emphasis visual yang kuat
 */
export default function PoinUtamaSlide({
    post,
    index,
    width,
    height,
    riddleId,
    randomPrimaryColor,
    category,
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
            {/* Decorative image at top right */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute -top-10 -right-20 object-cover opacity-50"
                style={{
                    filter: `brightness(1.2) contrast(1.1) saturate(0.9)`,
                    mixBlendMode: "multiply",
                    width: `55%`,
                    height: `55%`,
                    zIndex: 1,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
                category={category}
            />

            {/* Content container */}
            <div className="z-10 w-full h-full flex flex-col justify-center px-12">
                {/* Header with accent */}
                <div className="mb-6">
                    <div
                        className="inline-block px-4 py-2 mb-3"
                        style={{
                            backgroundColor: randomPrimaryColor,
                        }}
                    >
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            {post.judul_slide}
                        </h2>
                    </div>
                    <p className="text-base font-semibold text-gray-600 mt-2">
                        {post.sub_judul_slide}
                    </p>
                </div>

                {/* Main content */}
                <div className="space-y-4 max-w-lg">
                    <div
                        className="text-sm leading-relaxed text-gray-700 font-medium"
                        dangerouslySetInnerHTML={{
                            __html: post.konten_slide.replace(/\n/g, "<br/>"),
                        }}
                    />
                </div>

                {/* Decorative shape */}
                <RandomShape
                    fillColor={randomPrimaryColor}
                    strokeColor={randomPrimaryColor}
                    className="absolute -left-5 bottom-10 z-1 opacity-5"
                />
            </div>
        </div>
    );
}
