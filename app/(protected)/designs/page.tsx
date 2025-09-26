"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDesignsStore } from "@/stores/useDesignsStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Design } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { useRouter } from "next/navigation";

function DesignCard({ design }: { design: Design }) {
    const { deleteDesign } = useDesignsStore();

    return (
        <Card className="retro-card">
            <CardHeader>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-md mb-4 retro-border">
                    <img
                        src={design.generatedImageUrl}
                        alt={design.title}
                        className="h-full w-full object-cover"
                    />
                </div>
                <CardTitle>{design.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                        {new Date(design.createdAt).toLocaleDateString()}
                    </p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="retro-card">
                            <DropdownMenuItem asChild>
                                <Link href={`/designs/${design.id}`}>View</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => console.log("Duplicate action")}
                            >
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            "Are you sure you want to delete this design?"
                                        )
                                    ) {
                                        deleteDesign(design.id);
                                    }
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}

function TemplatePickerDialog({
    onSelect,
}: {
    onSelect: (templateId: string) => void;
}) {
    const { templates } = useTemplatesStore();

    return (
        <DialogContent className="max-w-3xl retro-card">
            <DialogHeader>
                <DialogTitle>Pilih Template</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
                {templates.map((template) => (
                    <Card
                        key={template.id}
                        className="cursor-pointer hover:border-primary"
                        onClick={() => onSelect(template.id)}
                    >
                        <CardContent className="p-2">
                            <img
                                src={template.referenceImageUrl}
                                alt={template.name}
                                className="aspect-[4/5] w-full object-cover rounded-md"
                            />
                            <p className="font-semibold mt-2 text-sm">
                                {template.name}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </DialogContent>
    );
}

export default function DesignsPage() {
    const { designs } = useDesignsStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredDesigns = designs.filter((design) =>
        design.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTemplateSelect = (templateId: string) => {
        router.push(`/designs/new?templateId=${templateId}`);
    };

    if (!isClient) {
        return <div>Loading designs...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Design Gallery</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="retro-button">
                            <PlusCircle className="mr-2 h-4 w-4" /> Generate
                            dari Template
                        </Button>
                    </DialogTrigger>
                    <TemplatePickerDialog onSelect={handleTemplateSelect} />
                </Dialog>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search designs..."
                    className="w-full pl-10 retro-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredDesigns.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredDesigns.map((design) => (
                        <DesignCard key={design.id} design={design} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No designs found.</p>
                </div>
            )}
        </div>
    );
}
