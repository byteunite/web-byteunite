"use client";

import React, { useEffect, useState } from "react";
import ClickableImage from "@/components/ClickableImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

interface CoverEditorProps {
    prompt: string;
    width: number;
    height: number;
    className?: string;
    alt?: string;
}

export default function CoverEditor({
    prompt,
    width,
    height,
    className = "",
    alt = "Cover image",
}: CoverEditorProps) {
    const search = useSearchParams?.();
    const initialId = (search && search.get("id")) || "";
    const [riddleId, setRiddleId] = useState<string>(initialId || "");
    const [savedImageUrl, setSavedImageUrl] = useState<string | undefined>(
        undefined
    );
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    useEffect(() => {
        if (riddleId) {
            fetchRiddle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riddleId]);

    const fetchRiddle = async () => {
        if (!riddleId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/riddles/${riddleId}`);
            if (!res.ok) throw new Error("Riddle not found");
            const json = await res.json();
            if (json?.success && json.data) {
                const slide = json.data?.carouselData?.slides?.[0];
                if (slide && slide.saved_image_url) {
                    setSavedImageUrl(slide.saved_image_url);
                } else {
                    setSavedImageUrl(undefined);
                }
                toast({
                    title: "Riddle loaded",
                    description: "Data riddle berhasil dimuat",
                });
            }
        } catch (err: any) {
            console.error(err);
            toast({
                title: "Error",
                description: err?.message || "Gagal memuat riddle",
                variant: "destructive",
            });
            setSavedImageUrl(undefined);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-full z-20">
            <div className="mb-3 flex items-center gap-2">
                <Label className="text-xs">Riddle ID (opsional)</Label>
                <Input
                    value={riddleId}
                    onChange={(e) => setRiddleId(e.target.value)}
                    placeholder="Masukkan riddle id untuk menyimpan ke DB"
                    className="flex-1"
                />
                <Button
                    onClick={fetchRiddle}
                    disabled={!riddleId || loading}
                    className="whitespace-nowrap"
                >
                    {loading ? "Memuat..." : "Muat"}
                </Button>
            </div>

            <div className="w-full h-full">
                <ClickableImage
                    prompt={prompt}
                    width={width}
                    height={height}
                    className={className}
                    alt={alt}
                    // pass slideIndex=0 so save-image API will store to first slide
                    slideIndex={0}
                    // only pass riddleId when provided; ClickableImage handles missing riddleId
                    riddleId={riddleId || undefined}
                    saved_image_url={savedImageUrl}
                    category="riddles"
                />
            </div>

            <p className="text-xs text-muted-foreground mt-2">
                Jika Anda mengisi Riddle ID dan menyimpan gambar, gambar akan
                disimpan ke database pada slide pertama dan akan tampil di slide
                pertama nanti.
            </p>
        </div>
    );
}
