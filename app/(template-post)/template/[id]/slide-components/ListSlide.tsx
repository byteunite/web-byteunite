import ClickableImage from "@/components/ClickableImage";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe LIST
 * Menampilkan daftar item atau tips dengan format yang jelas dan mudah dibaca
 */
export default function ListSlide({
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
            {/* Decorative image at bottom */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute -bottom-20 left-0 right-0 object-cover opacity-40"
                style={{
                    filter: `brightness(1.2) contrast(1.1)`,
                    mixBlendMode: "multiply",
                    width: `100%`,
                    height: `40%`,
                    zIndex: 1,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
                category={category}
            />

            {/* Content container */}
            <div className="z-10 w-full h-full flex flex-col justify-center px-12 py-10">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="w-2 h-12"
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        ></div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            {post.judul_slide}
                        </h2>
                    </div>
                    <p className="text-sm font-medium text-gray-600 ml-5">
                        {post.sub_judul_slide}
                    </p>
                </div>

                {/* List content */}
                <div className="space-y-3 max-w-md">
                    <div
                        className="text-sm leading-relaxed text-gray-700"
                        style={{
                            counterReset: "list-counter",
                        }}
                        dangerouslySetInnerHTML={{
                            __html: post.konten_slide
                                .replace(/\n/g, "<br/>")
                                .replace(
                                    /•/g,
                                    `<span style="color: ${randomPrimaryColor}; font-weight: bold;">•</span>`
                                ),
                        }}
                    />
                </div>

                {/* Accent line at bottom */}
                <div className="absolute bottom-8 left-12 right-12 z-20">
                    <div
                        className="h-1 w-24"
                        style={{
                            backgroundColor: randomPrimaryColor,
                            opacity: 0.3,
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
