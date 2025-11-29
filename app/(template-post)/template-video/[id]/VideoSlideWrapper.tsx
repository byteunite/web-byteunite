import { SlideComponentProps } from "../../template/[id]/slide-components/types";
import SlideRenderer from "../../template/[id]/slide-components/SlideRenderer";

/**
 * VideoSlideWrapper - Wrapper untuk slide dalam format video
 * Memisahkan background dan content agar hanya content yang di-scale
 * Background tetap full size untuk seamless transition dengan narrator area
 *
 * @param props - Props dari slide
 * @param videoWidth - Lebar area video
 * @param sliderHeight - Tinggi area slider (bagian atas)
 * @param scale - Scale factor untuk konten
 */
interface VideoSlideWrapperProps extends SlideComponentProps {
    videoWidth: number;
    sliderHeight: number;
    scale: number;
    originalHeight: number;
}

export default function VideoSlideWrapper({
    post,
    index,
    width,
    height,
    riddleId,
    randomPrimaryColor,
    flag,
    category,
    videoWidth,
    sliderHeight,
    scale,
    originalHeight,
}: VideoSlideWrapperProps) {
    // Hitung scale ratio untuk content
    const contentScale = sliderHeight / originalHeight;

    return (
        <div
            className="relative"
            style={{
                width: `${videoWidth}px`,
                height: `${sliderHeight}px`,
                overflow: "hidden",
            }}
        >
            {/* Background Layer - Full size, no scale */}
            <div
                className="absolute top-0 left-0"
                style={{
                    width: `${videoWidth}px`,
                    height: `${originalHeight}px`,
                    transform: `scale(${contentScale})`,
                    transformOrigin: "top left",
                    pointerEvents: "none",
                }}
            >
                {/* Render hanya background elements */}
                <div
                    style={{
                        width: `${videoWidth}px`,
                        height: `${originalHeight}px`,
                        backgroundColor:
                            index % 2 === 0 ? "#FFFFFF" : "#F3F4F6",
                    }}
                />
            </div>

            {/* Content Layer - Scaled */}
            <div
                className="absolute top-0 left-0"
                style={{
                    width: `${videoWidth}px`,
                    height: `${originalHeight}px`,
                    transform: `scale(${contentScale})`,
                    transformOrigin: "top left",
                }}
            >
                <SlideRenderer
                    post={post}
                    index={0}
                    width={videoWidth}
                    height={originalHeight}
                    riddleId={riddleId}
                    randomPrimaryColor={randomPrimaryColor}
                    flag={flag}
                    category={category}
                />
            </div>
        </div>
    );
}
