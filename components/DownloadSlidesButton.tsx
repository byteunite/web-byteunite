"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, Loader2, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
}

export default function DownloadSlidesButton({
    slides,
    riddleId,
}: DownloadSlidesButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [downloading, setDownloading] = useState<number | null>(null);
    const [downloadingAll, setDownloadingAll] = useState(false);

    // Check if all slides have saved_slide_url
    const allSlidesSaved = slides.every((slide) => slide.saved_slide_url);

    if (!allSlidesSaved) {
        return null; // Don't show button if not all slides are saved
    }

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

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="lg"
                className="fixed bottom-20 right-4 z-9998 shadow-lg"
            >
                <ImageIcon className="mr-2 h-4 w-4" />
                View Saved Slides
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Saved Slides</DialogTitle>
                        <DialogDescription>
                            All {slides.length} slides have been saved to cloud
                            storage. You can download them individually or all
                            at once.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {/* Download All Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={downloadAllImages}
                                disabled={downloadingAll}
                                className="w-full sm:w-auto"
                            >
                                {downloadingAll ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Downloading All...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download All ({slides.length} slides)
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Grid of Slide Images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-sm">
                                                Slide {index + 1}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {slide.judul_slide}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                slide.saved_slide_url &&
                                                downloadImage(
                                                    slide.saved_slide_url,
                                                    `riddle-${riddleId}-slide-${
                                                        index + 1
                                                    }.png`,
                                                    index
                                                )
                                            }
                                            disabled={downloading === index}
                                        >
                                            {downloading === index ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>

                                    {slide.saved_slide_url && (
                                        <div className="relative aspect-3/4 bg-gray-100 rounded overflow-hidden">
                                            <img
                                                src={slide.saved_slide_url}
                                                alt={`Slide ${index + 1}`}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}

                                    <div className="text-xs text-muted-foreground truncate">
                                        {slide.tipe_slide}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
