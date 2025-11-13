import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe FAKTA
 * Menampilkan fakta menarik dengan visual yang eye-catching
 */
export default function FaktaSlide({
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
                backgroundColor: randomPrimaryColor,
            }}
            className="flex items-center justify-center relative"
        >
            {/* Image overlay with blend mode */}
            <ClickableImage
                prompt={post.prompt_untuk_image || ""}
                width={width * 2}
                height={height * 2}
                className="absolute inset-0 object-cover opacity-30"
                style={{
                    filter: `brightness(1.5) contrast(1.2)`,
                    mixBlendMode: "overlay",
                    width: `100%`,
                    height: `100%`,
                    zIndex: 999,
                }}
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
                category={category}
            />

            {/* Content container */}
            <div
                className="z-10 w-full h-full flex flex-col justify-center items-center px-12 py-10 text-center"
                style={{ pointerEvents: "none" }}
            >
                {/* Fact badge */}
                <div className="mb-6">
                    <div className="inline-block bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-full px-6 py-2">
                        <span className="text-sm font-bold text-white uppercase tracking-widest">
                            Tahukah Kamu?
                        </span>
                    </div>
                </div>

                {/* Main title */}
                <div className="mb-5">
                    <h2
                        className="text-4xl font-black text-white mb-3 drop-shadow-lg"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.judul_slide),
                        }}
                    />
                    <div className="h-1 w-20 bg-white/80 mx-auto"></div>
                </div>

                {/* Subtitle */}
                <p
                    className="text-lg font-semibold text-white/90 mb-6 max-w-md drop-shadow"
                    dangerouslySetInnerHTML={{
                        __html: parseMarkdownToHtml(post.sub_judul_slide),
                    }}
                />

                {/* Fact content */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-md shadow-2xl">
                    <div
                        className="text-sm leading-relaxed text-gray-800 font-medium"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.konten_slide),
                        }}
                    />
                </div>

                {/* Decorative shapes */}
                <RandomShape
                    fillColor="#FFFFFF"
                    strokeColor="#FFFFFF"
                    className="absolute top-10 left-10 z-1 opacity-10"
                />
                <RandomShape
                    fillColor="#FFFFFF"
                    strokeColor="#FFFFFF"
                    className="absolute bottom-10 right-10 z-1 opacity-10"
                />
            </div>
        </div>
    );
}
