"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Download,
    Image as ImageIcon,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Copy,
    Check,
    Video,
    FileText,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import type {
    VideoScriptData,
    LegacyVideoScriptData,
    VideoPrompt,
} from "@/lib/gemini-video-script-generator";

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
    category?: string;
    contentId?: string; // ID untuk save video script ke database
    savedVideoScript?: VideoScriptData | LegacyVideoScriptData | null; // Support both new and legacy formats
}

/**
 * Helper function to get branded hashtag based on category
 * @param category - The category type (riddles, sites, topics, etc.)
 * @returns The branded hashtag for that category
 */
function getCategoryHashtag(category?: string): string {
    const hashtagMap: Record<string, string> = {
        riddles: "#ByteRiddle",
        sites: "#ByteSites",
        topics: "#ByteTopics",
    };
    return hashtagMap[category || "riddles"] || "#ByteUnite";
}

/**
 * Helper function to render markdown text
 * Supports: **bold**, *italic*, [visual cues], and line breaks
 */
function renderMarkdown(text: string): React.ReactNode {
    if (!text) return null;

    // Split by line breaks first
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
        const parts: React.ReactNode[] = [];
        let currentIndex = 0;

        // Regex untuk match **bold**, *italic*, dan [visual cues]
        const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\])/g;
        let match;

        while ((match = regex.exec(line)) !== null) {
            // Add text before match
            if (match.index > currentIndex) {
                parts.push(line.substring(currentIndex, match.index));
            }

            const matchedText = match[0];

            // Check type of match
            if (matchedText.startsWith("**") && matchedText.endsWith("**")) {
                // Bold text
                parts.push(
                    <strong
                        key={`bold-${lineIndex}-${match.index}`}
                        className="font-bold text-gray-900"
                    >
                        {matchedText.slice(2, -2)}
                    </strong>
                );
            } else if (
                matchedText.startsWith("*") &&
                matchedText.endsWith("*")
            ) {
                // Italic text
                parts.push(
                    <em
                        key={`italic-${lineIndex}-${match.index}`}
                        className="italic text-gray-700"
                    >
                        {matchedText.slice(1, -1)}
                    </em>
                );
            } else if (
                matchedText.startsWith("[") &&
                matchedText.endsWith("]")
            ) {
                // Visual cues
                parts.push(
                    <span
                        key={`cue-${lineIndex}-${match.index}`}
                        className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium"
                    >
                        {matchedText.slice(1, -1)}
                    </span>
                );
            }

            currentIndex = match.index + matchedText.length;
        }

        // Add remaining text
        if (currentIndex < line.length) {
            parts.push(line.substring(currentIndex));
        }

        // Return line with line break (except last line)
        return (
            <span key={`line-${lineIndex}`}>
                {parts.length > 0 ? parts : line}
                {lineIndex < lines.length - 1 && <br />}
            </span>
        );
    });
}

/**
 * Helper function to clean script for prompter
 * Removes markdown formatting, visual cues, and identifiers
 * Formats with proper line breaks for easy reading
 */
function cleanScriptForPrompter(text: string): string {
    if (!text) return "";

    // 1. Remove identifiers like "CREATOR:", "HOST:", etc.
    let cleaned = text.replace(
        /^(CREATOR|HOST|NARRATOR|SPEAKER|INTRO|HOOK|OUTRO):\s*/gim,
        ""
    );

    // 2. Remove visual cues [text]
    cleaned = cleaned.replace(/\[.*?\]/g, "");

    // 3. Remove bold **text**
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");

    // 4. Remove italic *text*
    cleaned = cleaned.replace(/\*(.*?)\*/g, "$1");

    // 5. Remove markdown headers (###, ##, #)
    cleaned = cleaned.replace(/^#+\s+/gm, "");

    // 6. Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, " ");

    // 7. Clean up spaces around punctuation
    cleaned = cleaned.replace(/\s+([.,!?])/g, "$1");

    // 8. Split into sentences for better readability
    // Add line break after sentences (. ! ?)
    cleaned = cleaned.replace(/([.!?])\s+/g, "$1\n");

    // 9. Add line break after commas in long sentences (for natural pauses)
    // But only if the segment is long enough (> 50 chars)
    const lines = cleaned.split("\n");
    cleaned = lines
        .map((line) => {
            if (line.length > 80) {
                // For long lines, add breaks after commas for easier reading
                return line.replace(/,\s+/g, ",\n");
            }
            return line;
        })
        .join("\n");

    // 10. Clean up excessive line breaks (max 2 consecutive)
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, "\n\n");

    // 11. Trim each line
    cleaned = cleaned
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0) // Remove empty lines
        .join("\n");

    // 12. Add spacing between logical sections (double line break before certain patterns)
    // Detect new sections by keywords
    cleaned = cleaned.replace(
        /\n(Halo|Hai|Nah|Jadi|Kalau|Oke|Dan yang terakhir)/g,
        "\n\n$1"
    );

    return cleaned.trim();
}

export default function DownloadSlidesButton({
    slides,
    riddleId,
    caption,
    hashtags,
    category,
    contentId,
    savedVideoScript,
}: DownloadSlidesButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [downloading, setDownloading] = useState<number | null>(null);
    const [downloadingAll, setDownloadingAll] = useState(false);
    const [copiedCaption, setCopiedCaption] = useState(false);
    const [copiedHashtags, setCopiedHashtags] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);

    console.log("Saved Video Script prop:", savedVideoScript);

    // Video Script states - Support multi-part
    const [videoScript, setVideoScript] = useState<VideoScriptData | null>(
        () => {
            // Backward compatibility: Convert old format to new format
            if (savedVideoScript) {
                // Check if it's already in new format
                if ("parts" in savedVideoScript) {
                    return savedVideoScript;
                }
                // Convert old format to new single-part format
                return {
                    parts: 1,
                    reason: "Legacy script format",
                    script: savedVideoScript.script,
                    estimatedDuration: savedVideoScript.estimatedDuration,
                    keyPoints: [],
                    tips: savedVideoScript.tips,
                    videoPrompts: [], // Empty array for legacy format
                };
            }
            return null;
        }
    );
    const [generatingScript, setGeneratingScript] = useState(false);
    const [savingScript, setSavingScript] = useState(false);
    const [scriptSavedToDB, setScriptSavedToDB] = useState(!!savedVideoScript); // Track apakah sudah tersimpan di DB
    const [copiedScript, setCopiedScript] = useState(false);
    const [copiedFullScript, setCopiedFullScript] = useState(false); // Separate state for full script
    const [copiedNarration, setCopiedNarration] = useState(false); // For prompter copy
    const [copiedVideoPrompt, setCopiedVideoPrompt] = useState<number | null>(
        null
    ); // Track which video prompt is copied
    const [showVideoPrompts, setShowVideoPrompts] = useState(false); // Toggle video prompts visibility
    const [showScriptSection, setShowScriptSection] = useState(
        !!savedVideoScript
    ); // Tampilkan jika sudah ada saved script

    // Check if all slides have saved_slide_url
    const allSlidesSaved = slides.every((slide) => slide.saved_slide_url);

    // Update video script state when savedVideoScript prop changes
    useEffect(() => {
        if (savedVideoScript) {
            // Check if it's already in new format
            if ("parts" in savedVideoScript) {
                setVideoScript(savedVideoScript);
            } else {
                // Convert old format to new single-part format
                setVideoScript({
                    parts: 1,
                    reason: "Legacy script format",
                    script: savedVideoScript.script,
                    estimatedDuration: savedVideoScript.estimatedDuration,
                    keyPoints: [],
                    tips: savedVideoScript.tips,
                    videoPrompts: [], // Empty array for legacy format
                });
            }
            setShowScriptSection(true);
            setScriptSavedToDB(true);
        }
    }, [savedVideoScript]);

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
            const categoryHashtag = getCategoryHashtag(category);
            const hashtagsText =
                `#ByteUniteDev ${categoryHashtag} ` +
                hashtags.map((tag) => `${tag}`).join(" ");
            await navigator.clipboard.writeText(hashtagsText);
            setCopiedHashtags(true);
            setTimeout(() => setCopiedHashtags(false), 2000);
        } catch (error) {
            console.error("Failed to copy hashtags:", error);
        }
    };

    const copyAll = async () => {
        try {
            const categoryHashtag = getCategoryHashtag(category);
            const hashtagsText =
                `#ByteUniteDev ${categoryHashtag} ` +
                hashtags.map((tag) => `${tag}`).join(" ");
            const fullText = `${caption}\n\n${hashtagsText}`;
            await navigator.clipboard.writeText(fullText);
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2000);
        } catch (error) {
            console.error("Failed to copy all:", error);
        }
    };

    const generateVideoScript = async () => {
        setGeneratingScript(true);
        try {
            const response = await fetch("/api/generate-video-script", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    caption,
                    slides: slides.map((slide) => ({
                        tipe_slide: slide.tipe_slide,
                        judul_slide: slide.judul_slide,
                        sub_judul_slide: slide.sub_judul_slide,
                        konten_slide: slide.konten_slide,
                    })),
                    category: category || "riddles",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate video script");
            }

            const result = await response.json();
            setVideoScript(result.data);
            setShowScriptSection(true);
        } catch (error) {
            console.error("Error generating video script:", error);
            alert("Gagal generate video script");
        } finally {
            setGeneratingScript(false);
        }
    };

    const saveVideoScript = async () => {
        if (!videoScript || !contentId) {
            alert(
                "Video script belum di-generate atau contentId tidak tersedia"
            );
            return;
        }

        setSavingScript(true);
        try {
            const response = await fetch("/api/save-video-script", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contentId,
                    category: category || "riddles",
                    videoScript,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save video script");
            }

            setScriptSavedToDB(true); // Mark as saved
            alert("Video script berhasil disimpan!");
        } catch (error) {
            console.error("Error saving video script:", error);
            alert("Gagal menyimpan video script");
        } finally {
            setSavingScript(false);
        }
    };

    const copyVideoScript = async () => {
        if (!videoScript) return;

        try {
            let scriptText = "";

            if (videoScript.parts === 1) {
                // Single part script
                scriptText = `VIDEO SCRIPT - ${
                    category?.toUpperCase() || "CONTENT"
                }
Duration: ${videoScript.estimatedDuration}

${videoScript.script}

---
KEY POINTS:
${videoScript.keyPoints.map((point, i) => `${i + 1}. ${point}`).join("\n")}

TIPS FOR DELIVERY:
${videoScript.tips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}`;
            } else {
                // Multi-part script
                scriptText = `VIDEO SCRIPT - ${
                    category?.toUpperCase() || "CONTENT"
                } (2 PARTS)

REASON FOR SPLIT: ${videoScript.reason}

━━━━━━━━━━━━━━━━━━━━━━
PART 1 - Duration: ${videoScript.part1.estimatedDuration}
━━━━━━━━━━━━━━━━━━━━━━

${videoScript.part1.script}

CLIFFHANGER: ${videoScript.part1.cliffhanger}

KEY POINTS (PART 1):
${videoScript.part1.keyPoints
    .map((point, i) => `${i + 1}. ${point}`)
    .join("\n")}

━━━━━━━━━━━━━━━━━━━━━━
PART 2 - Duration: ${videoScript.part2.estimatedDuration}
━━━━━━━━━━━━━━━━━━━━━━

${videoScript.part2.script}

CONNECTION: ${videoScript.part2.connection}

KEY POINTS (PART 2):
${videoScript.part2.keyPoints
    .map((point, i) => `${i + 1}. ${point}`)
    .join("\n")}

━━━━━━━━━━━━━━━━━━━━━━

TIPS FOR DELIVERY:
${videoScript.tips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}`;
            }

            await navigator.clipboard.writeText(scriptText);
            setCopiedFullScript(true);
            setTimeout(() => setCopiedFullScript(false), 2000);
        } catch (error) {
            console.error("Failed to copy script:", error);
        }
    };

    const copyNarrationForPrompter = async () => {
        if (!videoScript) return;

        try {
            let cleanedScript = "";

            if (videoScript.parts === 1) {
                // Single part - clean script
                cleanedScript = cleanScriptForPrompter(videoScript.script);
            } else {
                // Multi-part - combine both parts
                const part1Cleaned = cleanScriptForPrompter(
                    videoScript.part1.script
                );
                const part2Cleaned = cleanScriptForPrompter(
                    videoScript.part2.script
                );

                cleanedScript = `━━━ PART 1 ━━━\n\n${part1Cleaned}\n\n━━━ PART 2 ━━━\n\n${part2Cleaned}`;
            }

            await navigator.clipboard.writeText(cleanedScript);
            setCopiedNarration(true);
            setTimeout(() => setCopiedNarration(false), 2000);
        } catch (error) {
            console.error("Failed to copy narration:", error);
        }
    };

    const copyVideoPrompt = async (prompt: VideoPrompt, index: number) => {
        try {
            const promptText = `VIDEO PROMPT - Slide ${prompt.slideNumber}
Duration: ${prompt.duration}
Visual Style: ${prompt.visualStyle}
Camera Movement: ${prompt.cameraMovement}
Mood: ${prompt.mood}

PROMPT:
${prompt.prompt}`;

            await navigator.clipboard.writeText(promptText);
            setCopiedVideoPrompt(index);
            setTimeout(() => setCopiedVideoPrompt(null), 2000);
        } catch (error) {
            console.error("Failed to copy video prompt:", error);
        }
    };

    const copyAllVideoPrompts = async () => {
        if (!videoScript) return;

        try {
            let allPrompts = "";

            if (videoScript.parts === 1) {
                allPrompts = videoScript.videoPrompts
                    .map(
                        (prompt, index) =>
                            `━━━ CLIP ${index + 1} - SLIDE ${
                                prompt.slideNumber
                            } ━━━
Duration: ${prompt.duration}
Visual Style: ${prompt.visualStyle}
Camera Movement: ${prompt.cameraMovement}
Mood: ${prompt.mood}

PROMPT:
${prompt.prompt}`
                    )
                    .join("\n\n");
            } else {
                const part1Prompts = videoScript.part1.videoPrompts
                    .map(
                        (prompt, index) =>
                            `CLIP ${index + 1} - SLIDE ${prompt.slideNumber}
Duration: ${prompt.duration} | Style: ${prompt.visualStyle} | Camera: ${
                                prompt.cameraMovement
                            } | Mood: ${prompt.mood}
→ ${prompt.prompt}`
                    )
                    .join("\n\n");

                const part2Prompts = videoScript.part2.videoPrompts
                    .map(
                        (prompt, index) =>
                            `CLIP ${index + 1} - SLIDE ${prompt.slideNumber}
Duration: ${prompt.duration} | Style: ${prompt.visualStyle} | Camera: ${
                                prompt.cameraMovement
                            } | Mood: ${prompt.mood}
→ ${prompt.prompt}`
                    )
                    .join("\n\n");

                allPrompts = `━━━━━━━━━━━━━━━━━━━━━━
PART 1 VIDEO PROMPTS
━━━━━━━━━━━━━━━━━━━━━━

${part1Prompts}

━━━━━━━━━━━━━━━━━━━━━━
PART 2 VIDEO PROMPTS
━━━━━━━━━━━━━━━━━━━━━━

${part2Prompts}`;
            }

            await navigator.clipboard.writeText(allPrompts);
            // Reuse copiedScript state for this action
            setCopiedScript(true);
            setTimeout(() => setCopiedScript(false), 2000);
        } catch (error) {
            console.error("Failed to copy all video prompts:", error);
        }
    };

    const currentSlide = slides[currentSlideIndex];
    const categoryHashtag = getCategoryHashtag(category);

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
                                            {categoryHashtag.replace("#", "")}
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
                                            #ByteUniteDev {categoryHashtag}
                                            {hashtags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-sm text-blue-600 font-normal"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
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
                                            <Button
                                                onClick={copyAll}
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs gap-1.5"
                                            >
                                                {copiedAll ? (
                                                    <>
                                                        <Check className="h-3 w-3 text-green-600" />
                                                        Copied All!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3 w-3" />
                                                        Copy All
                                                    </>
                                                )}
                                            </Button>
                                        </div>
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

                                {/* Video Script Section */}
                                <div className="pt-4 border-t space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Video className="h-4 w-4 text-purple-600" />
                                            <p className="text-sm font-semibold text-gray-700">
                                                Video Script
                                                (TikTok/Reels/Shorts)
                                            </p>
                                        </div>
                                        <Button
                                            onClick={generateVideoScript}
                                            disabled={generatingScript}
                                            variant="outline"
                                            size="sm"
                                            className="h-8 gap-1.5"
                                        >
                                            {generatingScript ? (
                                                <>
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="h-3 w-3" />
                                                    {showScriptSection
                                                        ? "Re-generate"
                                                        : "Generate Script"}
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {showScriptSection && videoScript && (
                                        <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
                                            {/* Header with Duration and Parts Info */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-purple-700">
                                                        {videoScript.parts === 1
                                                            ? `Duration: ${videoScript.estimatedDuration}`
                                                            : `2 Parts (${videoScript.part1.estimatedDuration} + ${videoScript.part2.estimatedDuration})`}
                                                    </span>
                                                    {videoScript.parts ===
                                                        2 && (
                                                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                                                            Multi-Part
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reason untuk split (jika 2 parts) */}
                                            {videoScript.parts === 2 && (
                                                <div className="bg-purple-100 p-2.5 rounded border border-purple-300">
                                                    <p className="text-xs text-purple-800">
                                                        <span className="font-semibold">
                                                            Why 2 parts:
                                                        </span>{" "}
                                                        {videoScript.reason}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Script Content */}
                                            {videoScript.parts === 1 ? (
                                                // Single Part Display
                                                <>
                                                    <div className="bg-white p-3 rounded border border-purple-200 max-h-48 overflow-y-auto">
                                                        <div className="text-sm text-gray-800 leading-relaxed">
                                                            {renderMarkdown(
                                                                videoScript.script
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Key Points */}
                                                    {videoScript.keyPoints &&
                                                        videoScript.keyPoints
                                                            .length > 0 && (
                                                            <div className="bg-white p-3 rounded border border-purple-200">
                                                                <p className="text-xs font-semibold text-purple-700 mb-2">
                                                                    Key Points:
                                                                </p>
                                                                <ul className="text-xs text-gray-700 space-y-1">
                                                                    {videoScript.keyPoints.map(
                                                                        (
                                                                            point,
                                                                            index
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="flex gap-2 items-start"
                                                                            >
                                                                                <span className="text-purple-600 shrink-0">
                                                                                    •
                                                                                </span>
                                                                                <span>
                                                                                    {
                                                                                        point
                                                                                    }
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )}
                                                </>
                                            ) : (
                                                // Multi-Part Display
                                                <div className="space-y-3">
                                                    {/* Part 1 */}
                                                    <div className="bg-white p-3 rounded border-2 border-purple-300">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                                                                PART 1
                                                            </span>
                                                            <span className="text-xs text-gray-600">
                                                                {
                                                                    videoScript
                                                                        .part1
                                                                        .estimatedDuration
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-800 leading-relaxed max-h-32 overflow-y-auto mb-2">
                                                            {renderMarkdown(
                                                                videoScript
                                                                    .part1
                                                                    .script
                                                            )}
                                                        </div>
                                                        <div className="bg-orange-50 border border-orange-200 p-2 rounded">
                                                            <p className="text-xs text-orange-800">
                                                                <span className="font-semibold">
                                                                    🪝
                                                                    Cliffhanger:
                                                                </span>{" "}
                                                                {
                                                                    videoScript
                                                                        .part1
                                                                        .cliffhanger
                                                                }
                                                            </p>
                                                        </div>
                                                        {videoScript.part1
                                                            .keyPoints &&
                                                            videoScript.part1
                                                                .keyPoints
                                                                .length > 0 && (
                                                                <div className="mt-2 bg-purple-50 p-2 rounded">
                                                                    <p className="text-xs font-semibold text-purple-700 mb-1">
                                                                        Key
                                                                        Points:
                                                                    </p>
                                                                    <ul className="text-xs text-gray-700 space-y-0.5">
                                                                        {videoScript.part1.keyPoints.map(
                                                                            (
                                                                                point,
                                                                                i
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                >
                                                                                    •{" "}
                                                                                    {
                                                                                        point
                                                                                    }
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                    </div>

                                                    {/* Part 2 */}
                                                    <div className="bg-white p-3 rounded border-2 border-pink-300">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-1 rounded">
                                                                PART 2
                                                            </span>
                                                            <span className="text-xs text-gray-600">
                                                                {
                                                                    videoScript
                                                                        .part2
                                                                        .estimatedDuration
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="bg-blue-50 border border-blue-200 p-2 rounded mb-2">
                                                            <p className="text-xs text-blue-800">
                                                                <span className="font-semibold">
                                                                    🔗
                                                                    Connection:
                                                                </span>{" "}
                                                                {
                                                                    videoScript
                                                                        .part2
                                                                        .connection
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="text-sm text-gray-800 leading-relaxed max-h-32 overflow-y-auto">
                                                            {renderMarkdown(
                                                                videoScript
                                                                    .part2
                                                                    .script
                                                            )}
                                                        </div>
                                                        {videoScript.part2
                                                            .keyPoints &&
                                                            videoScript.part2
                                                                .keyPoints
                                                                .length > 0 && (
                                                                <div className="mt-2 bg-pink-50 p-2 rounded">
                                                                    <p className="text-xs font-semibold text-pink-700 mb-1">
                                                                        Key
                                                                        Points:
                                                                    </p>
                                                                    <ul className="text-xs text-gray-700 space-y-0.5">
                                                                        {videoScript.part2.keyPoints.map(
                                                                            (
                                                                                point,
                                                                                i
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                >
                                                                                    •{" "}
                                                                                    {
                                                                                        point
                                                                                    }
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Tips for Delivery */}
                                            {videoScript.tips &&
                                                videoScript.tips.length > 0 && (
                                                    <div className="bg-white p-3 rounded border border-purple-200">
                                                        <p className="text-xs font-semibold text-purple-700 mb-2">
                                                            Tips for Delivery:
                                                        </p>
                                                        <ul className="text-xs text-gray-700 space-y-1.5">
                                                            {videoScript.tips.map(
                                                                (
                                                                    tip,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex gap-2 items-start"
                                                                    >
                                                                        <span className="text-purple-600 mt-0.5 shrink-0">
                                                                            •
                                                                        </span>
                                                                        <span className="flex-1 leading-relaxed">
                                                                            {renderMarkdown(
                                                                                tip
                                                                            )}
                                                                        </span>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}

                                            {/* Video Prompts Section */}
                                            {((videoScript.parts === 1 &&
                                                videoScript.videoPrompts &&
                                                videoScript.videoPrompts
                                                    .length > 0) ||
                                                (videoScript.parts === 2 &&
                                                    ((videoScript.part1
                                                        .videoPrompts &&
                                                        videoScript.part1
                                                            .videoPrompts
                                                            .length > 0) ||
                                                        (videoScript.part2
                                                            .videoPrompts &&
                                                            videoScript.part2
                                                                .videoPrompts
                                                                .length >
                                                                0)))) && (
                                                <div className="bg-linear-to-r from-blue-50 to-purple-50 p-3 rounded border-2 border-blue-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Video className="h-4 w-4 text-blue-600" />
                                                            <p className="text-xs font-bold text-blue-700">
                                                                AI Video
                                                                Generation
                                                                Prompts
                                                            </p>
                                                            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                                                                Veo 3 / Sora /
                                                                Runway
                                                            </span>
                                                        </div>
                                                        <Button
                                                            onClick={() =>
                                                                setShowVideoPrompts(
                                                                    !showVideoPrompts
                                                                )
                                                            }
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 text-xs"
                                                        >
                                                            {showVideoPrompts
                                                                ? "Hide"
                                                                : "Show"}{" "}
                                                            Prompts
                                                        </Button>
                                                    </div>

                                                    <p className="text-xs text-blue-700 mb-3">
                                                        Prompt terstruktur per
                                                        slide untuk AI video
                                                        generators. Setiap clip
                                                        dirancang{" "}
                                                        <span className="font-semibold">
                                                            3-5 detik
                                                        </span>{" "}
                                                        dengan visual yang
                                                        koheren.
                                                    </p>

                                                    {showVideoPrompts && (
                                                        <div className="space-y-3">
                                                            {videoScript.parts ===
                                                            1 ? (
                                                                // Single Part Video Prompts
                                                                <div className="space-y-2">
                                                                    {videoScript.videoPrompts.map(
                                                                        (
                                                                            prompt,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="bg-white p-3 rounded border border-blue-300 shadow-sm"
                                                                            >
                                                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded">
                                                                                            Clip{" "}
                                                                                            {index +
                                                                                                1}
                                                                                        </span>
                                                                                        <span className="text-xs font-semibold text-gray-700">
                                                                                            Slide{" "}
                                                                                            {
                                                                                                prompt.slideNumber
                                                                                            }
                                                                                        </span>
                                                                                        <span className="text-xs text-gray-500">
                                                                                            •{" "}
                                                                                            {
                                                                                                prompt.duration
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    <Button
                                                                                        onClick={() =>
                                                                                            copyVideoPrompt(
                                                                                                prompt,
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-6 px-2 text-xs"
                                                                                    >
                                                                                        {copiedVideoPrompt ===
                                                                                        index ? (
                                                                                            <Check className="h-3 w-3 text-green-600" />
                                                                                        ) : (
                                                                                            <Copy className="h-3 w-3" />
                                                                                        )}
                                                                                    </Button>
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                                                                            📸{" "}
                                                                                            {
                                                                                                prompt.visualStyle
                                                                                            }
                                                                                        </span>
                                                                                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                                                                            🎥{" "}
                                                                                            {
                                                                                                prompt.cameraMovement
                                                                                            }
                                                                                        </span>
                                                                                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">
                                                                                            ✨{" "}
                                                                                            {
                                                                                                prompt.mood
                                                                                            }
                                                                                        </span>
                                                                                    </div>

                                                                                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2 rounded border border-gray-200">
                                                                                        {
                                                                                            prompt.prompt
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                // Multi-Part Video Prompts
                                                                <div className="space-y-3">
                                                                    {/* Part 1 Prompts */}
                                                                    {videoScript
                                                                        .part1
                                                                        .videoPrompts &&
                                                                        videoScript
                                                                            .part1
                                                                            .videoPrompts
                                                                            .length >
                                                                            0 && (
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                                                                                        PART
                                                                                        1
                                                                                        PROMPTS
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {
                                                                                            videoScript
                                                                                                .part1
                                                                                                .videoPrompts
                                                                                                .length
                                                                                        }{" "}
                                                                                        clips
                                                                                    </span>
                                                                                </div>
                                                                                {videoScript.part1.videoPrompts.map(
                                                                                    (
                                                                                        prompt,
                                                                                        index
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="bg-white p-3 rounded border border-purple-300 shadow-sm"
                                                                                        >
                                                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span className="text-xs font-bold text-white bg-purple-600 px-2 py-1 rounded">
                                                                                                        Clip{" "}
                                                                                                        {index +
                                                                                                            1}
                                                                                                    </span>
                                                                                                    <span className="text-xs font-semibold text-gray-700">
                                                                                                        Slide{" "}
                                                                                                        {
                                                                                                            prompt.slideNumber
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span className="text-xs text-gray-500">
                                                                                                        •{" "}
                                                                                                        {
                                                                                                            prompt.duration
                                                                                                        }
                                                                                                    </span>
                                                                                                </div>
                                                                                                <Button
                                                                                                    onClick={() =>
                                                                                                        copyVideoPrompt(
                                                                                                            prompt,
                                                                                                            index
                                                                                                        )
                                                                                                    }
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    className="h-6 px-2 text-xs"
                                                                                                >
                                                                                                    {copiedVideoPrompt ===
                                                                                                    index ? (
                                                                                                        <Check className="h-3 w-3 text-green-600" />
                                                                                                    ) : (
                                                                                                        <Copy className="h-3 w-3" />
                                                                                                    )}
                                                                                                </Button>
                                                                                            </div>

                                                                                            <div className="space-y-2">
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                                                                                        📸{" "}
                                                                                                        {
                                                                                                            prompt.visualStyle
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                                                                                        🎥{" "}
                                                                                                        {
                                                                                                            prompt.cameraMovement
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">
                                                                                                        ✨{" "}
                                                                                                        {
                                                                                                            prompt.mood
                                                                                                        }
                                                                                                    </span>
                                                                                                </div>

                                                                                                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2 rounded border border-gray-200">
                                                                                                    {
                                                                                                        prompt.prompt
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                    {/* Part 2 Prompts */}
                                                                    {videoScript
                                                                        .part2
                                                                        .videoPrompts &&
                                                                        videoScript
                                                                            .part2
                                                                            .videoPrompts
                                                                            .length >
                                                                            0 && (
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-1 rounded">
                                                                                        PART
                                                                                        2
                                                                                        PROMPTS
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {
                                                                                            videoScript
                                                                                                .part2
                                                                                                .videoPrompts
                                                                                                .length
                                                                                        }{" "}
                                                                                        clips
                                                                                    </span>
                                                                                </div>
                                                                                {videoScript.part2.videoPrompts.map(
                                                                                    (
                                                                                        prompt,
                                                                                        index
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="bg-white p-3 rounded border border-pink-300 shadow-sm"
                                                                                        >
                                                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span className="text-xs font-bold text-white bg-pink-600 px-2 py-1 rounded">
                                                                                                        Clip{" "}
                                                                                                        {index +
                                                                                                            1}
                                                                                                    </span>
                                                                                                    <span className="text-xs font-semibold text-gray-700">
                                                                                                        Slide{" "}
                                                                                                        {
                                                                                                            prompt.slideNumber
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span className="text-xs text-gray-500">
                                                                                                        •{" "}
                                                                                                        {
                                                                                                            prompt.duration
                                                                                                        }
                                                                                                    </span>
                                                                                                </div>
                                                                                                <Button
                                                                                                    onClick={() =>
                                                                                                        copyVideoPrompt(
                                                                                                            prompt,
                                                                                                            index +
                                                                                                                1000
                                                                                                        )
                                                                                                    }
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    className="h-6 px-2 text-xs"
                                                                                                >
                                                                                                    {copiedVideoPrompt ===
                                                                                                    index +
                                                                                                        1000 ? (
                                                                                                        <Check className="h-3 w-3 text-green-600" />
                                                                                                    ) : (
                                                                                                        <Copy className="h-3 w-3" />
                                                                                                    )}
                                                                                                </Button>
                                                                                            </div>

                                                                                            <div className="space-y-2">
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                                                                                        📸{" "}
                                                                                                        {
                                                                                                            prompt.visualStyle
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                                                                                        🎥{" "}
                                                                                                        {
                                                                                                            prompt.cameraMovement
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">
                                                                                                        ✨{" "}
                                                                                                        {
                                                                                                            prompt.mood
                                                                                                        }
                                                                                                    </span>
                                                                                                </div>

                                                                                                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2 rounded border border-gray-200">
                                                                                                    {
                                                                                                        prompt.prompt
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            )}

                                                            {/* Copy All Video Prompts Button */}
                                                            <Button
                                                                onClick={
                                                                    copyAllVideoPrompts
                                                                }
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full h-8 gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                                                            >
                                                                {copiedScript ? (
                                                                    <>
                                                                        <Check className="h-3 w-3 text-green-600" />
                                                                        All
                                                                        Prompts
                                                                        Copied!
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy className="h-3 w-3" />
                                                                        Copy All
                                                                        Video
                                                                        Prompts
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Primary Action: Copy for Prompter */}
                                            <Button
                                                onClick={
                                                    copyNarrationForPrompter
                                                }
                                                variant="default"
                                                size="lg"
                                                className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md"
                                            >
                                                {copiedNarration ? (
                                                    <>
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Copied for Prompter!
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        Copy Narration for
                                                        Prompter
                                                    </>
                                                )}
                                            </Button>

                                            {/* Secondary Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={copyVideoScript}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-8 text-xs gap-1.5"
                                                >
                                                    {copiedFullScript ? (
                                                        <>
                                                            <Check className="h-3 w-3 text-green-600" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="h-3 w-3" />
                                                            Full Script
                                                        </>
                                                    )}
                                                </Button>
                                                {contentId && (
                                                    <Button
                                                        onClick={
                                                            saveVideoScript
                                                        }
                                                        variant={
                                                            scriptSavedToDB
                                                                ? "outline"
                                                                : "default"
                                                        }
                                                        size="sm"
                                                        className={`flex-1 h-8 text-xs gap-1.5 ${
                                                            scriptSavedToDB
                                                                ? "border-green-500 text-green-600 bg-green-50"
                                                                : ""
                                                        }`}
                                                    >
                                                        {savingScript ? (
                                                            <>
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : scriptSavedToDB ? (
                                                            <>
                                                                <Check className="h-3 w-3" />
                                                                Saved to DB
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Download className="h-3 w-3" />
                                                                Save to DB
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
