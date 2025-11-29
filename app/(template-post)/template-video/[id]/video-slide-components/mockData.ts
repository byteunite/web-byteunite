/**
 * Mock Data untuk Testing Video Slides
 * Contoh berbagai tipe slide untuk preview dan development
 */

import { VideoSlide, VideoSlideType } from "./types";

interface MockVideoData {
    category: string;
    slides: VideoSlide[];
}

export const mockVideoSlides: MockVideoData[] = [
    // Example 1: Tutorial Series
    {
        category: "tutorials",
        slides: [
            {
                tipe_slide: "VIDEO_COVER" as VideoSlideType,
                judul_slide: "5 Tips Coding yang Wajib Kamu Tahu",
                sub_judul_slide: "Tingkatkan Skill dalam 5 Menit",
            },
            {
                tipe_slide: "VIDEO_POINT" as VideoSlideType,
                judul_slide: "Gunakan Keyboard Shortcuts",
                konten_slide:
                    "Hemat waktu hingga 30% dengan menguasai shortcuts editor",
            },
            {
                tipe_slide: "VIDEO_POINT" as VideoSlideType,
                judul_slide: "Refactor Code Secara Berkala",
                konten_slide:
                    "Jangan tunggu sampai code jadi spaghetti, refactor sedikit demi sedikit",
            },
            {
                tipe_slide: "VIDEO_POINT" as VideoSlideType,
                judul_slide: "Write Tests First",
                konten_slide:
                    "TDD bukan cuma buzzword, ini bikin code kamu lebih solid",
            },
            {
                tipe_slide: "VIDEO_QUOTE" as VideoSlideType,
                judul_slide:
                    "Code is like humor. When you have to explain it, it's bad.",
                sub_judul_slide: "Cory House",
            },
            {
                tipe_slide: "VIDEO_CLOSING" as VideoSlideType,
                judul_slide: "Selamat Coding!",
                sub_judul_slide: "Follow untuk tips coding lainnya",
                konten_slide: "Comment tipsmu di bawah!",
            },
        ],
    },

    // Example 2: Riddle/Quiz
    {
        category: "riddles",
        slides: [
            {
                tipe_slide: "VIDEO_COVER" as VideoSlideType,
                judul_slide: "Teka-Teki Logika",
                sub_judul_slide: "Bisakah kamu menjawabnya?",
            },
            {
                tipe_slide: "VIDEO_QUESTION" as VideoSlideType,
                judul_slide: "Aku punya kunci tapi tidak bisa membuka pintu",
                konten_slide: "Apa aku?",
            },
            {
                tipe_slide: "VIDEO_TRANSITION" as VideoSlideType,
                judul_slide: "Pikirkan baik-baik...",
                sub_judul_slide: "🤔",
            },
            {
                tipe_slide: "VIDEO_ANSWER" as VideoSlideType,
                judul_slide: "Piano!",
                sub_judul_slide: "JAWABAN",
                konten_slide:
                    "Piano punya kunci (keys) tapi tidak bisa membuka pintu",
            },
            {
                tipe_slide: "VIDEO_CLOSING" as VideoSlideType,
                judul_slide: "Mudah kan?",
                sub_judul_slide: "Ada teka-teki lainnya?",
                konten_slide: "Follow untuk teka-teki seru lainnya!",
            },
        ],
    },

    // Example 3: Tips List
    {
        category: "topics",
        slides: [
            {
                tipe_slide: "VIDEO_COVER" as VideoSlideType,
                judul_slide: "Cara Belajar Programming Efektif",
                sub_judul_slide: "Tips dari Para Expert",
            },
            {
                tipe_slide: "VIDEO_LIST" as VideoSlideType,
                judul_slide: "Langkah Belajar yang Benar",
                sub_judul_slide: "Ikuti urutan ini",
                list_items: [
                    "Mulai dari fundamentals, jangan skip basic",
                    "Build project nyata, bukan cuma tutorial",
                    "Read other people's code",
                    "Join komunitas dan banyak bertanya",
                ],
            },
            {
                tipe_slide: "VIDEO_POINT" as VideoSlideType,
                judul_slide: "Practice Makes Perfect",
                konten_slide:
                    "Coding 1 jam setiap hari lebih baik dari 7 jam di weekend",
            },
            {
                tipe_slide: "VIDEO_QUOTE" as VideoSlideType,
                judul_slide:
                    "The only way to learn programming is by writing programs",
                sub_judul_slide: "Dennis Ritchie",
            },
            {
                tipe_slide: "VIDEO_CLOSING" as VideoSlideType,
                judul_slide: "Keep Learning!",
                sub_judul_slide: "Semangat belajarnya!",
                konten_slide: "Share progress kamu di comment!",
            },
        ],
    },

    // Example 4: Quick Facts
    {
        category: "sites",
        slides: [
            {
                tipe_slide: "VIDEO_COVER" as VideoSlideType,
                judul_slide: "3 Website Developer Wajib Tahu",
                sub_judul_slide: "Game Changer!",
            },
            {
                tipe_slide: "VIDEO_POINT" as VideoSlideType,
                judul_slide: "Stack Overflow",
                konten_slide: "Solusi untuk semua error kamu ada di sini",
            },
            {
                tipe_slide: "VIDEO_POINT" as VideoSlideType,
                judul_slide: "GitHub",
                konten_slide:
                    "Bukan cuma untuk simpan code, tapi juga portfolio kamu",
            },
            {
                tipe_slide: "VIDEO_POINT" as VideoSlideType,
                judul_slide: "MDN Web Docs",
                konten_slide: "Dokumentasi web terlengkap dan paling akurat",
            },
            {
                tipe_slide: "VIDEO_CLOSING" as VideoSlideType,
                judul_slide: "Bookmark Sekarang!",
                sub_judul_slide: "Website favoritmu apa?",
                konten_slide: "Tag teman programmer kamu!",
            },
        ],
    },
];

/**
 * Get mock data by index
 */
export function getMockVideoSlide(index: number = 0) {
    return mockVideoSlides[index % mockVideoSlides.length];
}

/**
 * Get random mock data
 */
export function getRandomMockVideoSlide() {
    const randomIndex = Math.floor(Math.random() * mockVideoSlides.length);
    return mockVideoSlides[randomIndex];
}
