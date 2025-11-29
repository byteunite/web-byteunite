import SaveSlidesButton from "@/components/SaveSlidesButton";
import DownloadSlidesButton from "@/components/DownloadSlidesButton";
import { notFound } from "next/navigation";
import VideoSlideRenderer from "./video-slide-components/VideoSlideRenderer";
import { VideoSlide } from "./video-slide-components/types";
import {
    convertCarouselToVideoSlides,
    saveVideoSlidesToDatabase,
    type Slide,
} from "@/lib/gemini-video-slides-converter";
import GenerateVideoSlidesButton from "./GenerateVideoSlidesButton";
import RedirectAfterGenerate from "./RedirectAfterGenerate";

/**
 * Helper function to get branded hashtag based on category
 * @param category - The category type (riddles, sites, topics, tutorials, etc.)
 * @returns The branded hashtag for that category
 */
function getCategoryHashtag(category: string): string {
    const hashtagMap: Record<string, string> = {
        riddles: "#ByteRiddle",
        sites: "#ByteSites",
        topics: "#ByteTopics",
        tutorials: "#ByteTutorials",
    };
    return hashtagMap[category] || "#ByteUnite";
}

/**
 * Fetch data from API based on category
 * Mengambil data carousel dari API yang sama dengan /template/[id]
 * Lalu convert ke format video slides menggunakan AI
 *
 * @param id - The ID of the item to fetch
 * @param category - The category/type of data (riddles, sites, topics, tutorials, etc.)
 * @param useAI - Whether to use AI conversion or mock data
 * @returns The fetched data or null if not found
 */
async function getDataByCategory(
    id: string,
    category: string = "riddles",
    useAI: boolean = false
) {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // Valid categories that have API endpoints
        const validCategories = ["riddles", "sites", "topics", "tutorials"];

        // If category is not valid, default to riddles
        const validatedCategory = validCategories.includes(category)
            ? category
            : "riddles";

        // Fetch carousel data from existing API
        const endpoint = `${baseUrl}/api/${validatedCategory}/${id}`;

        const response = await fetch(endpoint, {
            cache: "no-store", // Disable caching for fresh data
        });

        if (!response.ok) {
            // If API fails, return null to show error
            console.error("API fetch failed");
            return null;
        }

        const result = await response.json();
        const fetchedData = result.data;

        // Check if videoSlides already exists in database
        if (!useAI) {
            if (
                fetchedData.videoSlides &&
                Array.isArray(fetchedData.videoSlides) &&
                fetchedData.videoSlides.length > 0
            ) {
                console.log("✅ Using existing video slides from database");
                return {
                    videoSlides: fetchedData.videoSlides,
                    category: validatedCategory,
                    source: "database",
                    hasCarouselData: !!(
                        fetchedData.carouselData &&
                        fetchedData.carouselData.slides
                    ),
                };
            }
        }

        // Check if carousel data exists
        const hasCarouselData = !!(
            fetchedData.carouselData && fetchedData.carouselData.slides
        );

        // If useAI is true and we have carousel data, convert it
        if (useAI && hasCarouselData) {
            console.log(
                "🔄 Converting carousel slides to video slides using AI..."
            );

            const carouselSlides: Slide[] = fetchedData.carouselData.slides;

            // Convert using AI
            const conversionResult = await convertCarouselToVideoSlides(
                carouselSlides,
                validatedCategory,
                id
            );

            if (
                conversionResult.success &&
                conversionResult.videoSlides.length > 0
            ) {
                console.log(
                    `✅ AI Conversion successful: ${conversionResult.videoSlides.length} slides generated`
                );

                // Save to database
                try {
                    const saved = await saveVideoSlidesToDatabase(
                        id,
                        validatedCategory,
                        conversionResult.videoSlides
                    );
                    if (saved) {
                        console.log("✅ Video slides saved to database");
                    } else {
                        console.warn(
                            "⚠️ Failed to save video slides to database"
                        );
                    }
                } catch (saveError) {
                    console.error("❌ Error saving to database:", saveError);
                }

                return {
                    videoSlides: conversionResult.videoSlides,
                    category: validatedCategory,
                    source: "ai-generated",
                    hasCarouselData: true,
                };
            } else {
                console.error("AI conversion failed:", conversionResult.error);
                return {
                    videoSlides: null,
                    category: validatedCategory,
                    source: "ai-failed",
                    hasCarouselData: true,
                    error: conversionResult.error,
                };
            }
        }

        // If no video slides and no AI conversion requested, return info about carousel data
        return {
            videoSlides: null,
            category: validatedCategory,
            source: "no-video-slides",
            hasCarouselData,
        };
    } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return null;
    }
}
export default async function TemplateVideoPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        format?: string;
        screenshot?: string;
        slideIndex?: string;
        data?: string;
        useAI?: string; // Add parameter to enable AI conversion
    }>;
}) {
    const { id } = await params;
    const { format, screenshot, slideIndex, data, useAI } = await searchParams;

    // Determine category from data parameter (default: riddles)
    const category = data || "riddles";

    // Enable AI conversion if useAI=true parameter is present
    const shouldUseAI = useAI === "true";

    // Fetch data from API based on category
    const fetchedData = await getDataByCategory(id, category, shouldUseAI);
    console.log("Fetched Data:", fetchedData);

    // If data not found, show 404
    if (!fetchedData) {
        notFound();
    }

    // If no video slides, show generate button
    if (!fetchedData.videoSlides) {
        return (
            <GenerateVideoSlidesButton
                contentId={id}
                category={category}
                hasCarouselData={fetchedData.hasCarouselData || false}
            />
        );
    }

    // Extract video slides from the fetched data
    const videoSlides: VideoSlide[] = fetchedData.videoSlides;
    const dataSource = fetchedData.source || "unknown";

    console.log(
        `📊 Data source: ${dataSource}, Slides count: ${videoSlides.length}`
    );

    // Scale untuk video vertikal (TikTok/Reels/Shorts format: 1080x1920)
    const scale = 2.5;

    const postCount = videoSlides.length;

    // Ukuran video vertikal (9:16 ratio)
    // Slider menggunakan 60% bagian atas (40% untuk video narasi di bawah)
    const videoWidth = 1080 / scale; // 432px
    const videoHeight = 1920 / scale; // 768px
    const sliderHeight = videoHeight * 0.6; // 460px untuk slider (60% dari tinggi)
    const narratorHeight = videoHeight * 0.4; // 307px untuk video narasi (40% dari tinggi)

    const widthTotal = videoWidth * postCount;

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
                    height: `${videoHeight}px`,
                }}
            >
                {/* looping divider based on postCount */}
                {videoSlides.map((slide: VideoSlide, index: number) => {
                    // Determine background color for narrator area to match slide background exactly
                    const getSlideBackground = () => {
                        const slideType = slide.tipe_slide;

                        // VIDEO_COVER uses very light gradient
                        if (slideType === "VIDEO_COVER") {
                            return "#FAFAFA"; // Light gray similar to gradient effect
                        }

                        // VIDEO_CLOSING uses solid primaryColor
                        if (slideType === "VIDEO_CLOSING") {
                            return randomPrimaryColor;
                        }

                        // VIDEO_QUESTION and VIDEO_QUOTE always use white
                        if (
                            slideType === "VIDEO_QUESTION" ||
                            slideType === "VIDEO_QUOTE"
                        ) {
                            return "#FFFFFF";
                        }

                        // VIDEO_POINT and VIDEO_LIST use alternating backgrounds
                        if (
                            slideType === "VIDEO_POINT" ||
                            slideType === "VIDEO_LIST"
                        ) {
                            return index % 2 === 0 ? "#FFFFFF" : "#F9FAFB";
                        }

                        // Default: alternating for other types (VIDEO_ANSWER, VIDEO_TRANSITION, etc)
                        return index % 2 === 0 ? "#FFFFFF" : "#F9FAFB";
                    };

                    return (
                        <div key={index} data-slide-index={index}>
                            <div
                                className="border border-gray-100 h-full bg-gray-200 absolute top-0 mx-auto border-r-0"
                                style={{
                                    left: `${(index + 1) * videoWidth}px`,
                                    zIndex: 99,
                                }}
                            ></div>

                            {/* Area Slider (60% bagian atas) */}
                            <div
                                className="absolute top-0 bottom-0"
                                style={{
                                    left: `${index * videoWidth}px`,
                                    width: `${videoWidth}px`,
                                    height: `${sliderHeight}px`,
                                    overflow: "hidden",
                                }}
                            >
                                {/* Hashtag Header - hanya untuk slide tertentu */}
                                {slide.tipe_slide !== "VIDEO_COVER" &&
                                    slide.tipe_slide !== "VIDEO_CLOSING" && (
                                        <div
                                            className="absolute top-2 z-99 text-gray-500"
                                            style={{
                                                left: 0,
                                                width: `${videoWidth}px`,
                                                textAlign: "center",
                                            }}
                                        >
                                            <span className="text-xs">
                                                {categoryHashtag}
                                            </span>
                                        </div>
                                    )}

                                {/* Page Counter */}
                                <div
                                    className="absolute bottom-2 z-99 text-gray-500"
                                    style={{
                                        left: 0,
                                        width: `${videoWidth}px`,
                                        textAlign: "center",
                                    }}
                                >
                                    <span className="text-xs absolute right-0 bottom-5 -rotate-90 opacity-50">
                                        page <b>{index + 1}</b>
                                    </span>
                                </div>

                                {/* Render Video Slide */}
                                <VideoSlideRenderer
                                    post={slide}
                                    index={index}
                                    width={videoWidth}
                                    height={sliderHeight}
                                    contentId={id}
                                    primaryColor={randomPrimaryColor}
                                    category={category}
                                />
                            </div>

                            {/* Area Video Narasi (40% bagian bawah) - Polos dengan background sama seperti slide */}
                            <div
                                className="absolute bottom-0"
                                style={{
                                    left: `${index * videoWidth}px`,
                                    width: `${videoWidth}px`,
                                    height: `${narratorHeight}px`,
                                    backgroundColor: getSlideBackground(),
                                }}
                            ></div>
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
                    slides={videoSlides as any}
                    riddleId={id}
                    caption={`Video slides for ${category}`}
                    hashtags={["#ByteUnite", `#${category}`]}
                    category={category}
                    contentId={id}
                    savedVideoScript={null}
                />
            )}

            {/* Redirect after AI generation to remove useAI parameter */}
            <RedirectAfterGenerate
                contentId={id}
                category={category}
                dataSource={dataSource}
            />
        </div>
    );
}
