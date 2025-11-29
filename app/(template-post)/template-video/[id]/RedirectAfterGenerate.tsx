"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RedirectAfterGenerateProps {
    contentId: string;
    category: string;
    dataSource: string;
}

/**
 * Component untuk redirect setelah AI generation selesai
 * Menghapus parameter useAI=true dari URL untuk mencegah regeneration
 */
export default function RedirectAfterGenerate({
    contentId,
    category,
    dataSource,
}: RedirectAfterGenerateProps) {
    const router = useRouter();

    useEffect(() => {
        // Jika data source adalah ai-generated, redirect ke URL tanpa useAI parameter
        if (dataSource === "ai-generated") {
            console.log("🔄 Redirecting to remove useAI parameter...");

            // Redirect ke URL tanpa parameter useAI
            const newUrl = `/template-video/${contentId}?data=${category}`;

            // Tunggu sebentar untuk user bisa lihat hasil, lalu redirect
            setTimeout(() => {
                router.push(newUrl);
                router.refresh();
            }, 1000);
        }
    }, [dataSource, contentId, category, router]);

    return null; // Component ini tidak render apa-apa
}
