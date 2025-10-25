"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ClickableImageProps {
    prompt: string;
    width: number;
    height: number;
    className?: string;
    style?: React.CSSProperties;
    alt?: string;
    slideIndex?: number;
    riddleId?: string;
    saved_image_url?: string;
}

export default function ClickableImage({
    prompt,
    width,
    height,
    className = "",
    style = {},
    alt = "Generated image",
    slideIndex,
    riddleId,
    saved_image_url,
}: ClickableImageProps) {
    const initSeed = Math.ceil(Math.random() * 15);
    const [seed, setSeed] = useState<number>(initSeed);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(
        saved_image_url ? false : true
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { toast } = useToast();

    const encodedPrompt = encodeURIComponent(prompt);

    // Gunakan saved_image_url jika ada, jika tidak gunakan URL dari pollinations
    const getImageUrl = () => {
        if (saved_image_url) {
            // setIsLoading(false);
            return saved_image_url;
        }
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=kontext&seed=${seed}&token=${process.env.NEXT_PUBLIC_POLLINATION_TOKEN}`;
    };

    useEffect(() => {
        setIsLoading(true);
        if (imageUrl === "") {
            const initImageUrl = getImageUrl();
            setImageUrl(initImageUrl);
        } else {
            const image = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=kontext&seed=${seed}&token=${process.env.NEXT_PUBLIC_POLLINATION_TOKEN}`;
            setImageUrl(image);
        }
    }, [seed]);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleRefreshImage = () => {
        setIsLoading(true);
        setSeed(Math.ceil(Math.random() * 15));
        setIsModalOpen(false);
    };

    const handleSaveImage = async () => {
        if (slideIndex === undefined || !riddleId) {
            toast({
                title: "Error",
                description: "Data slide atau riddle tidak tersedia",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=kontext&seed=${seed}&token=${process.env.NEXT_PUBLIC_POLLINATION_TOKEN}`;

        try {
            const response = await fetch(
                `/api/riddles/${riddleId}/save-image`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        slideIndex,
                        imageUrl,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Gagal menyimpan gambar");
            }

            toast({
                title: "Berhasil!",
                description: `Gambar slide ${slideIndex + 1} berhasil disimpan`,
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving image:", error);
            toast({
                title: "Error",
                description: "Gagal menyimpan gambar ke database",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center dark:bg-gray-800 rounded p-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            Loading...
                        </span>
                    </div>
                </div>
            )}
            <img
                className={`cursor-pointer hover:opacity-90 transition-opacity ${className} ${
                    isLoading ? "!opacity-0" : "block"
                }`}
                src={imageUrl}
                style={style}
                onClick={handleImageClick}
                onLoad={handleImageLoad}
                title="Klik untuk opsi gambar"
                alt={alt}
            />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px] z-[1000]">
                    <DialogHeader>
                        <DialogTitle>Opsi Gambar</DialogTitle>
                        <DialogDescription>
                            Pilih aksi yang ingin Anda lakukan dengan gambar ini
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Button
                            onClick={handleRefreshImage}
                            variant="outline"
                            className="w-full"
                            disabled={isSaving}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Ganti Gambar
                        </Button>
                        <Button
                            onClick={handleSaveImage}
                            className="w-full"
                            disabled={
                                isSaving ||
                                slideIndex === undefined ||
                                !riddleId
                            }
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan ke Database
                                </>
                            )}
                        </Button>
                        {(slideIndex === undefined || !riddleId) && (
                            <p className="text-xs text-muted-foreground text-center">
                                * Simpan tidak tersedia karena data slide tidak
                                lengkap
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
