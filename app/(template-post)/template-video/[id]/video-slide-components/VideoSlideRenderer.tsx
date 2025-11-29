import { VideoSlideComponentProps } from "./types";
import VideoCoverSlide from "./VideoCoverSlide";
import VideoPointSlide from "./VideoPointSlide";
import VideoQuestionSlide from "./VideoQuestionSlide";
import VideoAnswerSlide from "./VideoAnswerSlide";
import VideoListSlide from "./VideoListSlide";
import VideoQuoteSlide from "./VideoQuoteSlide";
import VideoTransitionSlide from "./VideoTransitionSlide";
import VideoClosingSlide from "./VideoClosingSlide";

/**
 * VideoSlideRenderer - Component renderer untuk video slides
 * Menggunakan slide components yang dioptimalkan untuk background video
 *
 * Design Philosophy:
 * - Minimal dan clean untuk tidak distract dari narrator
 * - Text yang mudah dibaca dalam format video
 * - Smooth transitions antar slides
 * - Fokus pada content hierarchy
 *
 * @param props - Props untuk video slide
 * @returns Video slide component yang sesuai dengan tipe
 */
export default function VideoSlideRenderer(props: VideoSlideComponentProps) {
    const { post } = props;

    switch (post.tipe_slide) {
        case "VIDEO_COVER":
            return <VideoCoverSlide {...props} />;

        case "VIDEO_POINT":
            return <VideoPointSlide {...props} />;

        case "VIDEO_QUESTION":
            return <VideoQuestionSlide {...props} />;

        case "VIDEO_ANSWER":
            return <VideoAnswerSlide {...props} />;

        case "VIDEO_LIST":
            return <VideoListSlide {...props} />;

        case "VIDEO_QUOTE":
            return <VideoQuoteSlide {...props} />;

        case "VIDEO_TRANSITION":
            return <VideoTransitionSlide {...props} />;

        case "VIDEO_CLOSING":
            return <VideoClosingSlide {...props} />;

        default:
            console.warn(
                `Unknown video slide type: ${post.tipe_slide}. Falling back to point slide.`
            );
            return <VideoPointSlide {...props} />;
    }
}
