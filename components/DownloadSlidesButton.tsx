"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Download,
    Image as ImageIcon,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Copy,
    Check,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Slide {
    tipe_slide: string;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
    prompt_untuk_image?: string;
    saved_slide_url?: string;
}

interface DownloadSlidesButtonProps {
    slides: Slide[];
    riddleId: string;
    caption: string;
    hashtags: string[];
}

export default function DownloadSlidesButton({
    slides,
    riddleId,
    caption,
    hashtags,
}: DownloadSlidesButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [downloading, setDownloading] = useState<number | null>(null);
    const [downloadingAll, setDownloadingAll] = useState(false);
    const [copiedCaption, setCopiedCaption] = useState(false);
    const [copiedHashtags, setCopiedHashtags] = useState(false);

    // Check if all slides have saved_slide_url
    const allSlidesSaved = slides.every((slide) => slide.saved_slide_url);

    if (!allSlidesSaved) {
        return null; // Don't show button if not all slides are saved
    }

    const handlePrevSlide = () => {
        setCurrentSlideIndex((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    const handleNextSlide = () => {
        setCurrentSlideIndex((prev) =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            handlePrevSlide();
        } else if (e.key === "ArrowRight") {
            handleNextSlide();
        }
    };

    const downloadImage = async (
        url: string,
        filename: string,
        index: number
    ) => {
        setDownloading(index);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading image:", error);
            alert("Gagal mendownload gambar");
        } finally {
            setDownloading(null);
        }
    };

    const downloadAllImages = async () => {
        setDownloadingAll(true);
        try {
            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                if (slide.saved_slide_url) {
                    const filename = `riddle-${riddleId}-slide-${i + 1}.png`;
                    await downloadImage(slide.saved_slide_url, filename, i);
                    // Wait a bit between downloads to avoid overwhelming the browser
                    await new Promise((resolve) => setTimeout(resolve, 500));
                }
            }
        } catch (error) {
            console.error("Error downloading all images:", error);
        } finally {
            setDownloadingAll(false);
        }
    };

    const copyCaption = async () => {
        try {
            await navigator.clipboard.writeText(caption);
            setCopiedCaption(true);
            setTimeout(() => setCopiedCaption(false), 2000);
        } catch (error) {
            console.error("Failed to copy caption:", error);
        }
    };

    const copyHashtags = async () => {
        try {
            const hashtagsText =
                "#ByteUniteDev #ByteUniteRiddle" +
                hashtags.map((tag) => `${tag}`).join(" ");
            await navigator.clipboard.writeText(hashtagsText);
            setCopiedHashtags(true);
            setTimeout(() => setCopiedHashtags(false), 2000);
        } catch (error) {
            console.error("Failed to copy hashtags:", error);
        }
    };

    const currentSlide = slides[currentSlideIndex];

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="lg"
                className="fixed bottom-10 right-10 z-9999 shadow-lg"
            >
                <ImageIcon className="mr-2 h-4 w-4" />
                View Saved Slides
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                    className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0"
                    style={{ zIndex: 10000 }}
                    onKeyDown={handleKeyDown}
                >
                    <div className="px-6 pt-6">
                        <DialogHeader>
                            <DialogTitle>Saved Slides</DialogTitle>
                            <DialogDescription>
                                View and download your saved slides
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6 mt-4">
                            {/* Left Side - Instagram-Style Carousel */}
                            <div className="space-y-4">
                                <div className="relative bg-black rounded-lg overflow-hidden aspect-4/5">
                                    {currentSlide.saved_slide_url && (
                                        <Image
                                            src={currentSlide.saved_slide_url}
                                            alt={currentSlide.judul_slide}
                                            fill
                                            className="object-contain"
                                        />
                                    )}

                                    {/* Navigation Buttons */}
                                    {slides.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrevSlide}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                                aria-label="Previous slide"
                                            >
                                                <ChevronLeft className="h-6 w-6 text-gray-800" />
                                            </button>
                                            <button
                                                onClick={handleNextSlide}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                                aria-label="Next slide"
                                            >
                                                <ChevronRight className="h-6 w-6 text-gray-800" />
                                            </button>
                                        </>
                                    )}

                                    {/* Slide Counter */}
                                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                        {currentSlideIndex + 1} /{" "}
                                        {slides.length}
                                    </div>
                                </div>

                                {/* Slide Indicators */}
                                {slides.length > 1 && (
                                    <div className="flex justify-center gap-1.5">
                                        {slides.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setCurrentSlideIndex(index)
                                                }
                                                className={`h-1.5 rounded-full transition-all ${
                                                    index === currentSlideIndex
                                                        ? "w-7 bg-blue-600"
                                                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
                                                }`}
                                                aria-label={`Go to slide ${
                                                    index + 1
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Side - Instagram-Style Content */}
                            <div className="space-y-4 flex flex-col">
                                {/* Profile Section (Mock Instagram Header) */}
                                <div className="flex items-center gap-3 pb-4 border-b">
                                    <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                        B
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">
                                            ByteUnite.dev
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ByteRiddle
                                        </p>
                                    </div>
                                </div>

                                {/* Caption Section */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            B
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">
                                                <span className="font-semibold mr-2">
                                                    ByteUnite.dev
                                                </span>
                                                <span className="text-gray-700 whitespace-pre-wrap wrap-break-word">
                                                    {caption}
                                                </span>
                                            </p>
                                            <Button
                                                onClick={copyCaption}
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2 h-7 text-xs gap-1.5"
                                            >
                                                {copiedCaption ? (
                                                    <>
                                                        <Check className="h-3 w-3 text-green-600" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3 w-3" />
                                                        Copy Caption
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Hashtags */}
                                    <div className="pl-[52px] space-y-2">
                                        <div className="flex flex-wrap gap-1.5">
                                            #ByteUniteDev #ByteRiddle
                                            {hashtags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-sm text-blue-600 font-normal"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Button
                                            onClick={copyHashtags}
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs gap-1.5"
                                        >
                                            {copiedHashtags ? (
                                                <>
                                                    <Check className="h-3 w-3 text-green-600" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3" />
                                                    Copy Hashtags
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Current Slide Info */}
                                <div className="pt-4 border-t space-y-2">
                                    <p className="text-xs font-semibold text-gray-500 uppercase">
                                        Slide {currentSlideIndex + 1} Info
                                    </p>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                {currentSlide.tipe_slide}
                                            </span>
                                        </p>
                                        <p className="text-gray-800 font-medium">
                                            {currentSlide.judul_slide}
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                            {currentSlide.sub_judul_slide}
                                        </p>
                                    </div>
                                </div>

                                {/* Download All Button */}
                                <Button
                                    onClick={downloadAllImages}
                                    disabled={downloadingAll}
                                    className="w-full mt-auto"
                                    size="lg"
                                >
                                    {downloadingAll ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download All ({slides.length}{" "}
                                            slides)
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
