/**
 * Types untuk Video Slide Components
 * Slide yang dioptimalkan untuk background video dengan narrator
 */

export type VideoSlideType =
    | "VIDEO_COVER"
    | "VIDEO_POINT"
    | "VIDEO_QUESTION"
    | "VIDEO_ANSWER"
    | "VIDEO_LIST"
    | "VIDEO_QUOTE"
    | "VIDEO_TRANSITION"
    | "VIDEO_CLOSING";

export interface VideoSlide {
    tipe_slide: VideoSlideType;
    judul_slide: string;
    sub_judul_slide?: string;
    konten_slide?: string;
    list_items?: string[];
    prompt_untuk_image?: string;
    saved_image_url?: string;
    background_color?: string;
    text_color?: string;
}

export interface VideoSlideComponentProps {
    post: VideoSlide;
    index: number;
    width: number;
    height: number;
    contentId: string;
    primaryColor: string;
    category: string;
}
