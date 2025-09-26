"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { useDesignsStore } from "@/stores/useDesignsStore";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowRight, PlusCircle, Image as ImageIcon } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { templates } = useTemplatesStore();
    const { designs } = useDesignsStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const recentDesigns = designs
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    if (!isClient) {
        return null; // or a loading spinner
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                Selamat datang, {user?.name}!
            </h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="retro-card">
                    <CardHeader>
                        <CardTitle>Total Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{templates.length}</p>
                    </CardContent>
                </Card>
                <Card className="retro-card">
                    <CardHeader>
                        <CardTitle>Total Designs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{designs.length}</p>
                    </CardContent>
                </Card>
                <Card className="retro-card">
                    <CardHeader>
                        <CardTitle>Terakhir Dibuat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {designs.length > 0
                                ? new Date(
                                      designs[0].createdAt
                                  ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                  })
                                : "Belum ada"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Aksi Cepat</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Link href="/templates/new">
                        <Card className="retro-card hover:bg-primary/10 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Buat Template Baru</CardTitle>
                                <PlusCircle className="h-6 w-6 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Mulai dari awal dengan mengunggah gambar
                                    referensi.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/designs">
                        <Card className="retro-card hover:bg-primary/10 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>
                                    Generate Design dari Template
                                </CardTitle>
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Pilih template yang ada untuk membuat design
                                    baru.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">
                    Aktivitas Terbaru
                </h2>
                <Card className="retro-card">
                    <CardContent className="p-0">
                        <div className="space-y-4 p-4">
                            {recentDesigns.length > 0 ? (
                                recentDesigns.map((design) => (
                                    <div
                                        key={design.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={design.generatedImageUrl}
                                                alt={design.title}
                                                className="h-12 w-12 rounded-md object-cover retro-border"
                                            />
                                            <div>
                                                <p className="font-semibold">
                                                    {design.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {design.topic}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/designs/${design.id}`}
                                            >
                                                Lihat{" "}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Belum ada design yang dibuat.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
