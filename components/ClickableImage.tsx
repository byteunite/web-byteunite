"use client";

import { useState, useRef, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import ReactCrop, {
    type Crop,
    centerCrop,
    makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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
    category?: string;
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
    category = "riddles",
}: ClickableImageProps) {
    const initSeed = Math.ceil(Math.random() * 15);
    const [seed, setSeed] = useState<number>(initSeed);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(
        saved_image_url ? false : true
    );
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const [uploadedFile, setUploadedFile] = useState<string>("");
    const imgRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const encodedPrompt = encodeURIComponent(prompt);
    const model = "flux";

    // Gunakan saved_image_url jika ada, jika tidak gunakan URL dari pollinations
    const getImageUrl = () => {
        if (saved_image_url) {
            // setIsLoading(false);
            return saved_image_url;
        }
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=${model}&seed=${seed}&token=${process.env.NEXT_PUBLIC_POLLINATION_TOKEN}`;
    };

    useEffect(() => {
        setIsLoading(true);
        if (imageUrl === "") {
            const initImageUrl = getImageUrl();
            setImageUrl(initImageUrl);
        } else {
            const image = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=${model}&seed=${seed}&token=${process.env.NEXT_PUBLIC_POLLINATION_TOKEN}`;
            setImageUrl(image);
        }
    }, [seed]);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleRefreshImage = () => {
        setIsLoading(true);
        setSeed(Math.ceil(Math.random() * 15));
        setUploadedImageUrl(""); // Reset uploaded image when refreshing
        setIsModalOpen(false);
    };

    const handleOpenUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSaveImage = async () => {
        await handleSaveImageToDb();
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    // Helper function untuk mendapatkan aspect ratio dari width/height
    const getAspectRatio = () => {
        return width / height;
    };

    // Function untuk handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Error",
                description: "File harus berupa gambar",
                variant: "destructive",
            });
            return;
        }

        // Convert file to base64
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setUploadedFile(result);
            setIsUploadModalOpen(true);
            setIsModalOpen(false);
        };
        reader.readAsDataURL(file);
    };

    // Function untuk initialize crop dengan aspect ratio yang sesuai
    const onImageLoadCrop = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            const { naturalWidth: imgWidth, naturalHeight: imgHeight } =
                e.currentTarget;
            const aspectRatio = getAspectRatio();

            const crop = centerCrop(
                makeAspectCrop(
                    {
                        unit: "%",
                        width: 90,
                    },
                    aspectRatio,
                    imgWidth,
                    imgHeight
                ),
                imgWidth,
                imgHeight
            );

            setCrop(crop);
            setCompletedCrop(crop);
        },
        [width, height]
    );

    // Function untuk crop image dan convert ke canvas
    const getCroppedImg = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!completedCrop || !imgRef.current) {
                reject(new Error("Crop not completed"));
                return;
            }

            const image = imgRef.current;
            const canvas = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            // Set canvas size sesuai dengan dimensi yang diinginkan
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            // Calculate crop dimensions
            const cropX = completedCrop.x * scaleX;
            const cropY = completedCrop.y * scaleY;
            const cropWidth = completedCrop.width * scaleX;
            const cropHeight = completedCrop.height * scaleY;

            // Draw cropped image pada canvas dengan ukuran yang diinginkan
            ctx.drawImage(
                image,
                cropX,
                cropY,
                cropWidth,
                cropHeight,
                0,
                0,
                width,
                height
            );

            // Convert canvas to base64
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Canvas is empty"));
                        return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(blob);
                },
                "image/jpeg",
                0.95
            );
        });
    };

    // Function untuk upload cropped image ke Cloudinary
    const handleUploadImage = async () => {
        try {
            setIsUploading(true);

            // Get cropped image
            const croppedImageData = await getCroppedImg();

            // Upload ke Cloudinary via API
            const response = await fetch("/api/upload-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: croppedImageData,
                    folder: `${category}/${riddleId || "temp"}`,
                    public_id: `slide-${slideIndex}-${Date.now()}`,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();
            setUploadedImageUrl(data.data.url);
            setImageUrl(data.data.url);

            toast({
                title: "Berhasil!",
                description: "Gambar berhasil diupload ke Cloudinary",
            });

            setIsUploadModalOpen(false);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error uploading image:", error);
            toast({
                title: "Error",
                description: "Gagal mengupload gambar",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Update handleSaveImage to use uploaded image URL if available
    const handleSaveImageToDb = async () => {
        if (slideIndex === undefined || !riddleId) {
            toast({
                title: "Error",
                description: "Data slide atau riddle tidak tersedia",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        // Use uploaded image URL if available, otherwise use pollinations URL
        const saveImageUrl =
            uploadedImageUrl ||
            `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=${model}&seed=${seed}&token=${process.env.NEXT_PUBLIC_POLLINATION_TOKEN}`;

        try {
            // Validasi kategori yang valid
            const validCategories = ["riddles", "sites", "topics", "tutorials"];
            const validatedCategory = validCategories.includes(category)
                ? category
                : "riddles";

            const response = await fetch(
                `/api/${validatedCategory}/${riddleId}/save-image`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        slideIndex,
                        imageUrl: saveImageUrl,
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
            // Reset uploaded image URL after saving
            setUploadedImageUrl("");
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

    return (
        <>
            {isLoading && (
                <div
                    className="flex items-center justify-center dark:bg-gray-800 rounded p-8 absolute inset-0"
                    style={{ pointerEvents: "none" }}
                >
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
                    isLoading ? "opacity-0!" : "block"
                }`}
                src={imageUrl}
                style={{ ...style, pointerEvents: "auto" }}
                onClick={handleImageClick}
                onLoad={handleImageLoad}
                title="Klik untuk opsi gambar"
                alt={alt}
            />

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
            />

            {/* Main Options Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px] z-1000">
                    <DialogHeader>
                        <DialogTitle>Opsi Gambar</DialogTitle>
                        <DialogDescription>
                            Pilih aksi yang ingin Anda lakukan dengan gambar ini
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 w-full">
                        <Button
                            onClick={handleOpenUpload}
                            variant="outline"
                            className="w-full"
                            disabled={isSaving}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Gambar
                        </Button>
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
                        {uploadedImageUrl && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs w-full">
                                <p className="text-green-700 dark:text-green-300 font-medium">
                                    ✓ Gambar terupload
                                </p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Upload & Crop Modal */}
            <Dialog
                open={isUploadModalOpen}
                onOpenChange={setIsUploadModalOpen}
            >
                <DialogContent className="sm:max-w-[800px] z-1000 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Crop Gambar</DialogTitle>
                        <DialogDescription>
                            Sesuaikan area crop sesuai proporsi gambar slide (
                            {width}x{height}px)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {uploadedFile && (
                            <div className="space-y-4">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={getAspectRatio()}
                                    className="max-w-full"
                                >
                                    <img
                                        ref={imgRef}
                                        src={uploadedFile}
                                        alt="Upload preview"
                                        onLoad={onImageLoadCrop}
                                        className="max-w-full"
                                    />
                                </ReactCrop>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleUploadImage}
                                        disabled={isUploading || !completedCrop}
                                        className="flex-1"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Mengupload...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload & Simpan
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setIsUploadModalOpen(false);
                                            setIsModalOpen(true);
                                            setUploadedFile("");
                                        }}
                                        variant="outline"
                                        disabled={isUploading}
                                    >
                                        Batal
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    * Gambar akan di-crop sesuai area yang
                                    dipilih dan disesuaikan dengan ukuran{" "}
                                    {width}x{height} pixel
                                </p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
