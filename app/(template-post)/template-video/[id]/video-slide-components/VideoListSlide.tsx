import { VideoSlideComponentProps } from "./types";

/**
 * VIDEO_LIST - Slide untuk menampilkan list items
 * Design: Clean list dengan bullets atau numbers
 * Perfect untuk: Steps, tips, atau multiple points
 */
export default function VideoListSlide({
    post,
    width,
    height,
    primaryColor,
    index,
}: VideoSlideComponentProps) {
    const bgColor = index % 2 === 0 ? "#FFFFFF" : "#F9FAFB";
    const items = post.list_items || [];

    return (
        <div
            className="relative flex flex-col justify-center"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: bgColor,
            }}
        >
            {/* Header */}
            <div className="text-center px-8 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {post.judul_slide}
                </h2>
                {post.sub_judul_slide && (
                    <p className="text-xs text-gray-500">
                        {post.sub_judul_slide}
                    </p>
                )}
            </div>

            {/* List Items */}
            <div className="px-10 space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        {/* Bullet */}
                        <div
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                            style={{
                                backgroundColor: primaryColor,
                            }}
                        >
                            {idx + 1}
                        </div>

                        {/* Text */}
                        <p className="text-sm text-gray-700 leading-relaxed flex-1">
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
