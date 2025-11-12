/**
 * Type definition untuk tipe slide yang tersedia
 *
 * Riddles & Sites types:
 * - COVER, MISTERI, CLOSING, SOLUSI, FINAL, WARNING_ANSWER
 * - INTRO, FEATURES, BENEFITS, USE_CASE, CTA
 *
 * Topics types:
 * - INTRO, POIN_UTAMA, DETAIL, LIST, FAKTA, KESIMPULAN, CALL_TO_ACTION
 */
export type SlideType =
    | "COVER"
    | "MISTERI"
    | "CLOSING"
    | "SOLUSI"
    | "FINAL"
    | "WARNING_ANSWER"
    | "INTRO"
    | "FEATURES"
    | "BENEFITS"
    | "USE_CASE"
    | "CTA"
    | "POIN_UTAMA"
    | "DETAIL"
    | "LIST"
    | "FAKTA"
    | "KESIMPULAN"
    | "CALL_TO_ACTION";

/**
 * Interface untuk struktur data slide
 */
export interface Slide {
    tipe_slide: SlideType;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
    prompt_untuk_image?: string; // Optional karena WARNING_ANSWER tidak memerlukan image
    saved_image_url?: string; // Legacy field
    saved_slide_url?: string; // New field for saved slides
}

/**
 * Props yang digunakan oleh semua slide component
 */
export interface SlideComponentProps {
    post: Slide;
    index: number;
    width: number;
    height: number;
    riddleId: string;
    randomPrimaryColor: string;
    flag?: boolean; // Optional untuk komponen tertentu seperti MISTERI
    category?: string; // Category untuk API endpoint dinamis
}
