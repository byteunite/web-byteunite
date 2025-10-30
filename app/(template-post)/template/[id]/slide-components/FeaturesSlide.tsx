import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe FEATURES
 * Menampilkan fitur-fitur dengan layout list yang terstruktur
 */
export default function FeaturesSlide({
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
                backgroundColor: "#F9FAFB",
            }}
            className="flex items-center justify-center overflow-visible relative"
        >
            {/* Decorative image at bottom left */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute -bottom-10 -right-20 object-cover opacity-60"
                style={{
                    filter: `brightness(1.1) contrast(1.3)`,
                    mixBlendMode: "multiply",
                    width: `50%`,
                    zIndex: 999,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
                category={category}
            />

            {/* Content container */}
            <div className="z-10 w-full h-full flex flex-col justify-center px-12">
                <div className="max-w-xl ml-auto">
                    {/* Header section */}
                    <div className="mb-2">
                        <span
                            className="text-xs font-bold uppercase tracking-wider px-3 py-1 text-white"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        >
                            {post.judul_slide}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 tracking-normal">
                        {post.sub_judul_slide}
                    </h3>

                    {/* Features list */}
                    <div className="space-y-3">
                        <div
                            className="text-sm leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: post.konten_slide.replace(
                                    /\n/g,
                                    "<br/>"
                                ),
                            }}
                        />
                    </div>

                    {/* Decorative shape */}
                    <RandomShape
                        fillColor={randomPrimaryColor}
                        strokeColor={randomPrimaryColor}
                        className="absolute -right-10 top-10 z-1 opacity-5"
                    />
                </div>
            </div>
        </div>
    );
}
