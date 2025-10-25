import RandomShape from "@/components/RandomShape";
import ClickableImage from "@/components/ClickableImage";
import SaveSlidesButton from "@/components/SaveSlidesButton";
import DownloadSlidesButton from "@/components/DownloadSlidesButton";
import { notFound } from "next/navigation";
import { Feather, UserPlus, Search } from "lucide-react";

/**
 * Type definition untuk tipe slide yang tersedia
 */
type SlideType =
    | "COVER"
    | "MISTERI"
    | "CLOSING"
    | "SOLUSI"
    | "FINAL"
    | "WARNING_ANSWER";

/**
 * Interface untuk struktur data slide
 */
interface Slide {
    tipe_slide: SlideType;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
    prompt_untuk_image?: string; // Optional karena WARNING_ANSWER tidak memerlukan image
    saved_image_url?: string; // Legacy field
    saved_slide_url?: string; // New field for saved slides
}

/**
 * Fungsi untuk menambahkan slide peringatan sebelum CLOSING dan SOLUSI
 *
 * Konsep:
 * - Slide "WARNING_ANSWER" akan disisipkan sebelum slide tipe "CLOSING" dan "SOLUSI"
 * - Slide ini berfungsi sebagai pembatas antara pertanyaan dan jawaban
 * - Memberikan kesempatan kepada viewer untuk berpikir sebelum melihat jawaban
 * - Design simple dengan pesan yang jelas
 *
 * @param slides - Array slide asli yang akan dimodifikasi
 * @returns Array slide baru dengan slide peringatan yang sudah disisipkan
 */
function insertWarningSlides(slides: Slide[]): Slide[] {
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
 * Fetch riddle data from API
 */
async function getRiddleData(id: string) {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/riddles/${id}`, {
            cache: "no-store", // Disable caching for fresh data
        });

        if (!response.ok) {
            return null;
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Error fetching riddle:", error);
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
    }>;
}) {
    const { id } = await params;
    const { format, screenshot, slideIndex } = await searchParams;

    // Fetch riddle data from API
    const riddleData = await getRiddleData(id);

    // If riddle not found, show 404
    if (
        !riddleData ||
        !riddleData.carouselData ||
        !riddleData.carouselData.slides
    ) {
        notFound();
    }

    // Extract slides from the riddle data
    const slides: Slide[] = riddleData.carouselData.slides;

    const scale = 2.5;

    // Terapkan fungsi insertWarningSlides untuk menambahkan slide peringatan
    const processedData = insertWarningSlides(slides);

    const postCount = processedData.length; // Gunakan processedData yang sudah ditambahkan warning slides
    const width = 1080 / scale;
    const height = 1350 / scale;
    const widthTotal = width * postCount;
    const primaryColors = ["#b94750", "#ccaa3a", "#f37047"];
    const randomPrimaryColor =
        primaryColors[Math.floor(Math.random() * primaryColors.length)];

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
                                className="border border-gray-100 h-full bg-gray-200 absolute top-0 z-99 mx-auto"
                                style={{
                                    left: `${((index + 1) * 1080) / scale}px`,
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
                                                #ByteRiddle
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

                            {post.tipe_slide === "COVER" && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                            backgroundColor:
                                                index % 2 === 0
                                                    ? "#FFFFFF"
                                                    : "#F3F4F6",
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
                                            riddleId={id}
                                            saved_image_url={
                                                post.saved_image_url
                                            }
                                        />
                                        <div className="z-10 px-10">
                                            <h5
                                                className="text-2xl bg-black text-white px-2 tracking-wide inline"
                                                style={{
                                                    backgroundColor:
                                                        randomPrimaryColor,
                                                }}
                                            >
                                                {post.judul_slide}
                                            </h5>
                                            <div className="z-10 w-3/5 leading-0">
                                                <span className="text-xs bg-white opacity-90 tracking-wide inline font-bold">
                                                    {post.sub_judul_slide}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="z-10 leading-5 mt-2 absolute bottom-15 w-2/3 text-center">
                                            <span
                                                className="text-xs bg-white opacity-80 tracking-wide inline text-gray-500"
                                                dangerouslySetInnerHTML={{
                                                    __html: `${" "}${
                                                        post.konten_slide
                                                    }${" "}`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {post.tipe_slide === "MISTERI" && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                        }}
                                        className="flex items-center justify-center overflow-visible relative flex-col bg-white"
                                    >
                                        {flag ? (
                                            <>
                                                <ClickableImage
                                                    prompt={
                                                        post.prompt_untuk_image ||
                                                        ""
                                                    }
                                                    width={width * 2}
                                                    height={height * 2}
                                                    className="absolute -top-15 -right-30 object-cover z-999 opacity-70 colorized"
                                                    style={{
                                                        filter: `brightness(1.05) contrast(1.3)`,
                                                        mixBlendMode:
                                                            "multiply",
                                                        width: `${
                                                            60 +
                                                            Math.ceil(
                                                                Math.random() *
                                                                    2
                                                            ) *
                                                                10
                                                        }%`,
                                                    }}
                                                    alt={post.judul_slide}
                                                    slideIndex={index}
                                                    riddleId={id}
                                                    saved_image_url={
                                                        post.saved_image_url
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <>
                                                {" "}
                                                <ClickableImage
                                                    prompt={
                                                        post.prompt_untuk_image ||
                                                        ""
                                                    }
                                                    width={width * 2}
                                                    height={height * 2}
                                                    className="absolute -bottom-15 -right-30 object-cover z-999 opacity-70"
                                                    style={{
                                                        filter: `brightness(1.05) contrast(1.3)`,
                                                        mixBlendMode:
                                                            "multiply",
                                                        width: `${
                                                            60 +
                                                            Math.ceil(
                                                                Math.random() *
                                                                    2
                                                            ) *
                                                                10
                                                        }%`,
                                                    }}
                                                    alt={post.judul_slide}
                                                    slideIndex={index}
                                                    riddleId={id}
                                                    saved_image_url={
                                                        post.saved_image_url
                                                    }
                                                />
                                            </>
                                        )}

                                        <div className="z-10 w-full h-full flex flex-col items-center justify-center -mt-10">
                                            <div className="m-auto w-64 relative">
                                                <div className="mb-1 z-10 relative">
                                                    <span className="bg-gray-600 text-white px-2 text-xs py-1 mb-1">
                                                        {post.judul_slide}
                                                    </span>
                                                </div>
                                                <h6 className="text-2xl text-gray-600 tracking-wide inline leading-6 z-10 relative">
                                                    {post.sub_judul_slide}
                                                </h6>
                                                <div className="z-10 w-full leading-5 mt-2">
                                                    <span
                                                        className="text-xs bg-white opacity-75 tracking-wide inline text-gray-500"
                                                        dangerouslySetInnerHTML={{
                                                            __html: post.konten_slide,
                                                        }}
                                                    />
                                                </div>
                                                {!flag ? (
                                                    <RandomShape
                                                        fillColor={
                                                            randomPrimaryColor
                                                        }
                                                        strokeColor={
                                                            randomPrimaryColor
                                                        }
                                                        className="absolute -left-50 -bottom-30 z-1 opacity-10"
                                                    />
                                                ) : (
                                                    <RandomShape
                                                        fillColor={
                                                            randomPrimaryColor
                                                        }
                                                        strokeColor={
                                                            randomPrimaryColor
                                                        }
                                                        className="absolute -left-50 -top-20 z-1 opacity-10"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {(post.tipe_slide === "SOLUSI" ||
                                post.tipe_slide === "FINAL") && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                        }}
                                        className="flex items-center justify-center overflow-visible relative flex-col bg-white"
                                    >
                                        <div className="z-10 w-full h-full flex flex-col items-center justify-center">
                                            <div className="m-auto w-64">
                                                {/* circle with icon */}
                                                <div
                                                    className="rounded-full text-white w-14 h-14 flex items-center justify-center mb-4"
                                                    style={{
                                                        backgroundColor:
                                                            randomPrimaryColor,
                                                    }}
                                                >
                                                    {post.tipe_slide ===
                                                        "FINAL" && (
                                                        <UserPlus className="text-5xl" />
                                                    )}
                                                    {post.tipe_slide ===
                                                        "SOLUSI" && <Feather />}
                                                </div>
                                                <div className="mb-1">
                                                    <span
                                                        className={` text-white px-2 text-xs py-1 mb-1`}
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
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
                                </>
                            )}
                            {post.tipe_slide === "CLOSING" && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                        }}
                                        className="flex items-center justify-center overflow-visible relative flex-col bg-white"
                                    >
                                        <div className="absolute h-1/2 top-0 left-0 right-0 flex justify-center z-40">
                                            <ClickableImage
                                                prompt={
                                                    post.prompt_untuk_image ||
                                                    ""
                                                }
                                                width={width}
                                                height={height}
                                                className="object-contain z-999 opacity-70 h-full"
                                                style={{
                                                    mixBlendMode: "multiply",
                                                    width: `${
                                                        60 +
                                                        Math.ceil(
                                                            Math.random() * 2
                                                        ) *
                                                            10
                                                    }%`,
                                                }}
                                                alt={post.judul_slide}
                                                slideIndex={index}
                                                riddleId={id}
                                                saved_image_url={
                                                    post.saved_image_url
                                                }
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
                                                            backgroundColor:
                                                                randomPrimaryColor,
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
                                </>
                            )}
                            {/* 
                                Layout untuk slide WARNING_ANSWER 
                                Design simple dengan:
                                - Background gradient dari primary color
                                - Icon peringatan besar di tengah
                                - Text center alignment
                                - Minimal distraction
                            */}
                            {post.tipe_slide === "WARNING_ANSWER" && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                            background: "white",
                                        }}
                                        className="flex items-center justify-center overflow-hidden relative flex-col"
                                    >
                                        {/* Icon warning besar sebagai focal point */}
                                        <div
                                            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                            style={{
                                                opacity: 0.2,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: randomPrimaryColor,
                                                }}
                                            >
                                                <Search className="w-[100px] h-[100px]" />
                                            </span>
                                        </div>

                                        {/* Content area */}
                                        <div className="z-10 w-full h-full flex flex-col items-center justify-center px-10 mt-5">
                                            <div className="text-center space-y-4">
                                                {/* Title dengan border styling */}
                                                <div
                                                    className="inline-block px-2 py-1"
                                                    style={{
                                                        backgroundColor:
                                                            randomPrimaryColor,
                                                    }}
                                                >
                                                    <span
                                                        className="text-sm font-bold tracking-wide"
                                                        style={{
                                                            color: "white",
                                                        }}
                                                    >
                                                        {post.judul_slide}
                                                    </span>
                                                </div>

                                                {/* Subtitle */}
                                                <div className="mt-6">
                                                    <p className="text-lg text-gray-700 font-semibold leading-5">
                                                        {post.sub_judul_slide}
                                                    </p>
                                                </div>

                                                {/* Content dengan box */}
                                                <div className="mt-4 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-lg max-w-xs mx-auto">
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        dangerouslySetInnerHTML={{
                                                            __html: post.konten_slide,
                                                        }}
                                                    />
                                                </div>

                                                {/* Decorative line */}
                                                <div className="mt-8 flex items-center justify-center space-x-2">
                                                    <div
                                                        className="h-1 w-12 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="h-1 w-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="h-1 w-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="h-1 w-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
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
                <SaveSlidesButton riddleId={id} totalSlides={postCount} />
            )}

            {/* Show download button if all slides have been saved */}
            {!isScreenshotMode && (
                <DownloadSlidesButton
                    slides={processedData}
                    riddleId={id}
                    caption={riddleData.carouselData.caption}
                    hashtags={riddleData.carouselData.hashtags}
                />
            )}
        </div>
    );
}
