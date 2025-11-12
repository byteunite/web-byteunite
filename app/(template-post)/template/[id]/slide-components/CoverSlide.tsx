import ClickableImage from "@/components/ClickableImage";
import { parseMarkdownToHtml } from "@/lib/format-text";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe COVER
 * Menampilkan cover dengan background image dan judul utama
 */
export default function CoverSlide({
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
                backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F3F4F6",
            }}
            className="flex items-center justify-center overflow-hidden relative flex-col"
        >
            <ClickableImage
                prompt={`${post.prompt_untuk_image}&enhance=true`}
                width={width * 2}
                height={height * 2}
                className="absolute top-0 left-0 w-full h-full object-cover"
                alt={post.judul_slide}
                slideIndex={index}
                riddleId={riddleId}
                saved_image_url={post.saved_image_url}
                category={category}
            />
            <div className="z-10 px-10">
                <h5
                    className="text-2xl bg-black text-white px-2 tracking-wide inline"
                    style={{
                        backgroundColor: randomPrimaryColor,
                    }}
                    dangerouslySetInnerHTML={{
                        __html: parseMarkdownToHtml(post.judul_slide),
                    }}
                />
                <div className="z-10 w-3/5 leading-0">
                    <span
                        className="text-xs bg-white opacity-90 tracking-wide inline font-bold"
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdownToHtml(post.sub_judul_slide),
                        }}
                    />
                </div>
            </div>
            <div className="z-10 leading-5 mt-2 absolute bottom-15 w-2/3 text-center">
                <span
                    className="text-xs bg-white opacity-80 tracking-wide inline text-gray-500"
                    dangerouslySetInnerHTML={{
                        __html: `${" "}${post.konten_slide}${" "}`,
                    }}
                />
            </div>
        </div>
    );
}
