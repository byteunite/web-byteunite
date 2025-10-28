import ClickableImage from "@/components/ClickableImage";
import { SlideComponentProps } from "./types";

/**
 * Component untuk slide tipe CLOSING
 * Menampilkan penutup dengan gambar di atas dan konten di bawah
 */
export default function ClosingSlide({
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
            }}
            className="flex items-center justify-center overflow-visible relative flex-col bg-white"
        >
            <div className="absolute h-1/2 top-0 left-0 right-0 flex justify-center z-40">
                <ClickableImage
                    prompt={post.prompt_untuk_image || ""}
                    width={width}
                    height={height}
                    className="object-contain z-999 opacity-70 h-full"
                    style={{
                        mixBlendMode: "multiply",
                        width: `${60 + Math.ceil(Math.random() * 2) * 10}%`,
                    }}
                    alt={post.judul_slide}
                    slideIndex={index}
                    riddleId={riddleId}
                    saved_image_url={post.saved_image_url}
                    category={category}
                />
            </div>
            <div className="z-50 w-full flex flex-col items-center justify-center">
                <div
                    className="m-auto w-64 absolute bottom-20"
                    style={{ zIndex: 99 }}
                >
                    <div className="mb-1">
                        <span
                            className={` text-white px-2 text-xs py-1 mb-1`}
                            style={{
                                backgroundColor: randomPrimaryColor,
                            }}
                        >
                            {post.judul_slide}
                        </span>
                    </div>
                    <h5 className="text-2xl text-gray-600 tracking-wide inline leading-6">
                        {post.sub_judul_slide}
                    </h5>
                    <div className="z-10 w-full leading-5 mt-2">
                        <span
                            className="text-xs bg-white opacity-75 tracking-wide inline text-gray-500"
                            dangerouslySetInnerHTML={{
                                __html: post.konten_slide,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
