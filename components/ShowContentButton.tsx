"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Eye,
    Download,
    Copy,
    ChevronLeft,
    ChevronRight,
    Check,
} from "lucide-react";
import Image from "next/image";

interface Slide {
    tipe_slide: string;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
    prompt_untuk_image?: string;
    saved_image_url?: string;
    saved_slide_url?: string;
}

interface ShowContentButtonProps {
    slides: Slide[];
    caption: string;
    hashtags: string[];
    riddleId: string;
}

export default function ShowContentButton({
    slides,
    caption,
    hashtags,
    riddleId,
}: ShowContentButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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

    const downloadImage = async (url: string, filename: string) => {
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
            console.error("Download failed:", error);
        }
    };

    const downloadAllSlides = async () => {
        setDownloadingAll(true);
        try {
            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                if (slide.saved_slide_url) {
                    await downloadImage(
                        slide.saved_slide_url,
                        `riddle-${riddleId}-slide-${i + 1}.png`
                    );
                    // Delay between downloads to avoid browser blocking
                    if (i < slides.length - 1) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 500)
                        );
                    }
                }
            }
        } catch (error) {
            console.error("Batch download failed:", error);
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
            const hashtagsText = hashtags.map((tag) => `#${tag}`).join(" ");
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
                variant="default"
                size="lg"
                className="fixed bottom-4 right-4 z-9998 shadow-lg"
            >
                <Eye className="mr-2 h-4 w-4" />
                Show Content
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                    className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
                    onKeyDown={handleKeyDown}
                >
                    <DialogHeader>
                        <DialogTitle>Instagram Post Content</DialogTitle>
                        <DialogDescription>
                            View slides, caption, and hashtags
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Side - Carousel */}
                            <div className="space-y-4">
                                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-3/4">
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
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                                aria-label="Previous slide"
                                            >
                                                <ChevronLeft className="h-6 w-6" />
                                            </button>
                                            <button
                                                onClick={handleNextSlide}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                                                aria-label="Next slide"
                                            >
                                                <ChevronRight className="h-6 w-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Slide Counter */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                        {currentSlideIndex + 1} /{" "}
                                        {slides.length}
                                    </div>
                                </div>

                                {/* Slide Indicators */}
                                <div className="flex justify-center gap-2">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentSlideIndex(index)
                                            }
                                            className={`h-2 rounded-full transition-all ${
                                                index === currentSlideIndex
                                                    ? "w-8 bg-blue-600"
                                                    : "w-2 bg-gray-300 hover:bg-gray-400"
                                            }`}
                                            aria-label={`Go to slide ${
                                                index + 1
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Download All Button */}
                                <Button
                                    onClick={downloadAllSlides}
                                    disabled={downloadingAll}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {downloadingAll
                                        ? `Downloading... (${slides.length} slides)`
                                        : `Download All Slides (${slides.length})`}
                                </Button>
                            </div>

                            {/* Right Side - Caption & Hashtags */}
                            <div className="space-y-6">
                                {/* Caption Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-lg">
                                            Caption
                                        </h3>
                                        <Button
                                            onClick={copyCaption}
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            {copiedCaption ? (
                                                <>
                                                    <Check className="h-4 w-4 text-green-600" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {caption}
                                        </p>
                                    </div>
                                </div>

                                {/* Hashtags Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-lg">
                                            Hashtags
                                        </h3>
                                        <Button
                                            onClick={copyHashtags}
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            {copiedHashtags ? (
                                                <>
                                                    <Check className="h-4 w-4 text-green-600" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-4 w-4" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex flex-wrap gap-2">
                                            {hashtags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Current Slide Info */}
                                <div className="space-y-2 pt-4 border-t">
                                    <h4 className="font-medium text-sm text-gray-500">
                                        Current Slide Info
                                    </h4>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="font-medium">
                                                Type:
                                            </span>{" "}
                                            {currentSlide.tipe_slide}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Title:
                                            </span>{" "}
                                            {currentSlide.judul_slide}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Subtitle:
                                            </span>{" "}
                                            {currentSlide.sub_judul_slide}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
