import ClickableImage from "@/components/ClickableImage";
import RandomShape from "@/components/RandomShape";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe MISTERI
 * Menampilkan pertanyaan atau misteri dengan layout yang menarik
 */
export default function MisteriSlide({
    post,
    index,
    width,
    height,
    riddleId,
    randomPrimaryColor,
    flag = false,
    category,
}: SlideComponentProps) {
    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                left: `${(index * 1080) / 2.5}px`,
                position: "absolute",
            }}
            className="flex items-center justify-center overflow-visible relative flex-col bg-white"
        >
            {flag ? (
                <ClickableImage
                    prompt={post.prompt_untuk_image || ""}
                    width={width * 2}
                    height={height * 2}
                    className="absolute -top-15 -right-30 object-cover z-999 opacity-70 colorized"
                    style={{
                        filter: `brightness(1.05) contrast(1.3)`,
                        mixBlendMode: "multiply",
                        width: `${60 + Math.ceil(Math.random() * 2) * 10}%`,
                    }}
                    alt={post.judul_slide}
                    slideIndex={index}
                    riddleId={riddleId}
                    saved_image_url={post.saved_image_url}
                    category={category}
                />
            ) : (
                <ClickableImage
                    prompt={post.prompt_untuk_image || ""}
                    width={width * 2}
                    height={height * 2}
                    className="absolute -bottom-15 -right-30 object-cover z-999 opacity-70"
                    style={{
                        filter: `brightness(1.05) contrast(1.3)`,
                        mixBlendMode: "multiply",
                        width: `${60 + Math.ceil(Math.random() * 2) * 10}%`,
                    }}
                    alt={post.judul_slide}
                    slideIndex={index}
                    riddleId={riddleId}
                    saved_image_url={post.saved_image_url}
                    category={category}
                />
            )}

            <div className="z-10 w-full h-full flex flex-col items-center justify-center -mt-10">
                <div className="m-auto w-64 relative">
                    <div className="mb-1 z-10 relative">
                        <span
                            className="bg-gray-600 text-white px-2 text-xs py-1 mb-1"
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(post.judul_slide),
                            }}
                        />
                    </div>
                    <h6
                        className="text-2xl text-gray-600 tracking-wide inline leading-6 z-10 relative"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.sub_judul_slide),
                        }}
                    />
                    <div className="z-10 w-full leading-5 mt-2">
                        <span
                            className="text-xs bg-white opacity-75 tracking-wide inline text-gray-500"
                            dangerouslySetInnerHTML={{
                                __html: post.konten_slide,
                            }}
                        />
                    </div>
                    {!flag ? (
                        <RandomShape
                            fillColor={randomPrimaryColor}
                            strokeColor={randomPrimaryColor}
                            className="absolute -left-50 -bottom-30 z-1 opacity-10"
                        />
                    ) : (
                        <RandomShape
                            fillColor={randomPrimaryColor}
                            strokeColor={randomPrimaryColor}
                            className="absolute -left-50 -top-20 z-1 opacity-10"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
