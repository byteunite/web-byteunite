"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input-retro";
import { PlusCircle, Search, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Template } from "@/lib/types";

function TemplateCard({ template }: { template: Template }) {
    const { deleteTemplate } = useTemplatesStore();

    return (
        <Card className="retro-card flex flex-col">
            <CardHeader>
                <div className="aspect-[4/5] w-full overflow-hidden rounded-md mb-4 retro-border">
                    <img
                        src={template.referenceImageUrl}
                        alt={template.name}
                        className="h-full w-full object-cover"
                    />
                </div>
                <CardTitle>{template.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">
                    {template.elements.length} elements
                </Badge>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                        Updated{" "}
                        {new Date(template.updatedAt).toLocaleDateString()}
                    </p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="retro-card">
                            <DropdownMenuItem asChild>
                                <Link href={`/templates/${template.id}`}>
                                    View/Edit
                                </Link>
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
                                            "Are you sure you want to delete this template?"
                                        )
                                    ) {
                                        deleteTemplate(template.id);
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

export default function TemplatesPage() {
    const { templates } = useTemplatesStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isClient) {
        return <div>Loading templates...</div>; // Or a skeleton loader
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Template Library</h1>
                <Button asChild className="retro-button">
                    <Link href="/templates/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> New Template
                    </Link>
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search templates..."
                    className="w-full pl-10 retro-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredTemplates.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTemplates.map((template) => (
                        <TemplateCard key={template.id} template={template} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No templates found.</p>
                </div>
            )}
        </div>
    );
}
