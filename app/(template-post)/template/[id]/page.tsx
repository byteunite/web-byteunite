import SaveSlidesButton from "@/components/SaveSlidesButton";
import DownloadSlidesButton from "@/components/DownloadSlidesButton";
import { notFound } from "next/navigation";
import SlideRenderer from "./slide-components/SlideRenderer";
import { Slide, SlideType } from "./slide-components/types";

/**
 * Helper function to get branded hashtag based on category
 * @param category - The category type (riddles, sites, topics, etc.)
 * @returns The branded hashtag for that category
 */
function getCategoryHashtag(category: string): string {
    const hashtagMap: Record<string, string> = {
        riddles: "#ByteRiddle",
        sites: "#ByteSites",
        topics: "#ByteTopics",
    };
    return hashtagMap[category] || "#ByteUnite";
}

/**
 * Fungsi untuk menambahkan slide peringatan sebelum CLOSING dan SOLUSI
 *
 * Konsep:
 * - Slide "WARNING_ANSWER" akan disisipkan sebelum slide tipe "CLOSING" dan "SOLUSI"
 * - Slide ini berfungsi sebagai pembatas antara pertanyaan dan jawaban
 * - Memberikan kesempatan kepada viewer untuk berpikir sebelum melihat jawaban
 * - Design simple dengan pesan yang jelas
 * - HANYA untuk category "riddles", tidak untuk "sites" atau "topics"
 *
 * @param slides - Array slide asli yang akan dimodifikasi
 * @param category - Category untuk menentukan apakah perlu warning slide
 * @returns Array slide baru dengan slide peringatan yang sudah disisipkan (jika riddles)
 */
function insertWarningSlides(slides: Slide[], category: string): Slide[] {
    // WARNING_ANSWER hanya untuk riddles
    if (category !== "riddles") {
        return slides;
    }

    const newSlides: Slide[] = [];

    slides.forEach((slide, index) => {
        // Cek apakah slide berikutnya adalah CLOSING atau SOLUSI
        const nextSlide = slides[index + 1];

        // Tambahkan slide saat ini
        newSlides.push(slide);

        // Jika slide berikutnya adalah SOLUSI, sisipkan WARNING sebelum SOLUSI
        if (
            slide.tipe_slide !== "WARNING_ANSWER" &&
            nextSlide &&
            nextSlide.tipe_slide === "SOLUSI"
        ) {
            newSlides.push({
                tipe_slide: "WARNING_ANSWER",
                judul_slide: "🔍 Siap Lihat Jawaban?",
                sub_judul_slide: "Slide Berikutnya Mengungkap Jawabannya",
                konten_slide:
                    "Ini kesempatan terakhirmu untuk menebak! Swipe jika sudah siap... ➡️",
            });
        }
    });

    return newSlides;
}

/**
 * Fetch data from API based on category
 * @param id - The ID of the item to fetch
 * @param category - The category/type of data (riddles, sites, topics, etc.)
 * @returns The fetched data or null if not found
 */
async function getDataByCategory(id: string, category: string = "riddles") {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // Valid categories that have API endpoints
        const validCategories = ["riddles", "sites", "topics"];

        // If category is not valid, default to riddles
        const validatedCategory = validCategories.includes(category)
            ? category
            : "riddles";

        // Map category to API endpoint
        const endpoint = `${baseUrl}/api/${validatedCategory}/${id}`;

        const response = await fetch(endpoint, {
            cache: "no-store", // Disable caching for fresh data
        });

        if (!response.ok) {
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return null;
    }
}

export default async function TemplatePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        format?: string;
        screenshot?: string;
        slideIndex?: string;
        data?: string;
    }>;
}) {
    const { id } = await params;
    const { format, screenshot, slideIndex, data } = await searchParams;

    // Determine category from data parameter (default: riddles)
    const category = data || "riddles";

    // Fetch data from API based on category
    const fetchedData = await getDataByCategory(id, category);

    // If data not found, show 404
    if (
        !fetchedData ||
        !fetchedData.carouselData ||
        !fetchedData.carouselData.slides
    ) {
        notFound();
    }

    // Extract slides from the fetched data
    const slides: Slide[] = fetchedData.carouselData.slides;

    const scale = 2.5;

    // Terapkan fungsi insertWarningSlides untuk menambahkan slide peringatan (hanya untuk riddles)
    const processedData = insertWarningSlides(slides, category);

    const postCount = processedData.length; // Gunakan processedData yang sudah ditambahkan warning slides (jika ada)
    const width = 1080 / scale;
    const height = 1350 / scale;
    const widthTotal = width * postCount;
    const primaryColors = ["#b94750", "#ccaa3a", "#f37047"];
    const randomPrimaryColor =
        primaryColors[Math.floor(Math.random() * primaryColors.length)];

    // Get branded hashtag based on category
    const categoryHashtag = getCategoryHashtag(category);

    // Jika mode screenshot, tambahkan data attribute untuk CSS optimization
    const isScreenshotMode = screenshot === "true";
    const targetSlideIndex = slideIndex ? parseInt(slideIndex) : undefined;

    return (
        <div
            className="bg-black min-h-screen flex items-center justify-center overflow-auto w-full"
            data-screenshot-mode={isScreenshotMode ? "true" : "false"}
        >
            <div
                className={`bg-white relative`}
                style={{
                    width: `${widthTotal}px`,
                    height: `${height}px`,
                }}
            >
                {/* looping devider based on postCount */}
                {processedData.map((post, index) => {
                    const flag = Math.round(Math.random() * 1) === 1;
                    return (
                        <div key={index} data-slide-index={index}>
                            <div
                                className="border border-gray-100 h-full bg-gray-200 absolute top-0 mx-auto border-r-0"
                                style={{
                                    left: `${((index + 1) * 1080) / scale}px`,
                                    zIndex: 99,
                                }}
                            ></div>
                            {post.tipe_slide !== "MISTERI" &&
                                post.tipe_slide !== "CLOSING" &&
                                post.tipe_slide !== "WARNING_ANSWER" && (
                                    <>
                                        <div
                                            className="absolute top-2 z-99 text-gray-500"
                                            style={{
                                                left: `${
                                                    (index * 1080) / scale
                                                }px`,
                                                width: `${width}px`,
                                                textAlign: "center",
                                            }}
                                        >
                                            <span className="text-xs">
                                                {categoryHashtag}
                                            </span>
                                        </div>
                                        <div
                                            className="absolute bottom-2 z-99 text-gray-500"
                                            style={{
                                                left: `${
                                                    (index * 1080) / scale
                                                }px`,
                                                width: `${width}px`,
                                                textAlign: "center",
                                            }}
                                        >
                                            <span className="text-xs">
                                                @ByteUnite.dev
                                            </span>
                                        </div>
                                    </>
                                )}

                            <div
                                className="absolute bottom-2 z-99 text-gray-500"
                                style={{
                                    left: `${(index * 1080) / scale}px`,
                                    width: `${width}px`,
                                    textAlign: "center",
                                }}
                            >
                                <span className="text-xs absolute right-0 bottom-5 -rotate-90 opacity-50">
                                    page <b>{index + 1}</b>
                                </span>
                            </div>

                            {/* Render slide dengan SlideRenderer component */}
                            <SlideRenderer
                                post={post}
                                index={index}
                                width={width}
                                height={height}
                                riddleId={id}
                                randomPrimaryColor={randomPrimaryColor}
                                flag={flag}
                                category={category}
                            />
                        </div>
                    );
                })}
            </div>
            <style>{` 
                em, b, h6 { color: ${randomPrimaryColor};
                h6 { font-weight: bold; }
            } `}</style>

            {/* Show save button only when format=save parameter is present */}
            {format === "save" && !isScreenshotMode && (
                <SaveSlidesButton
                    riddleId={id}
                    totalSlides={postCount}
                    category={category}
                />
            )}

            {/* Show download button if all slides have been saved */}
            {!isScreenshotMode && (
                <DownloadSlidesButton
                    slides={processedData}
                    riddleId={id}
                    caption={fetchedData.carouselData.caption}
                    hashtags={fetchedData.carouselData.hashtags}
                    category={category}
                    contentId={id}
                />
            )}
        </div>
    );
}
