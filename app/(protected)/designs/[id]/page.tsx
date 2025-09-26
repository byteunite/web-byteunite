"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDesignsStore } from "@/stores/useDesignsStore";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { Design } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import Link from "next/link";
import { Download, Copy, Trash2 } from "lucide-react";

export default function DesignDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { getDesign, updateDesign, deleteDesign } = useDesignsStore();
    const { getTemplate } = useTemplatesStore();

    const [design, setDesign] = useState<Design | null>(null);
    const [templateName, setTemplateName] = useState("");
    const [editedCaption, setEditedCaption] = useState("");

    useEffect(() => {
        if (params.id) {
            const d = getDesign(params.id as string);
            if (d) {
                setDesign(d);
                setEditedCaption(d.caption);
                const t = getTemplate(d.templateId);
                if (t) {
                    setTemplateName(t.name);
                }
            } else {
                router.push("/designs");
            }
        }
    }, [params.id, getDesign, getTemplate, router]);

    const handleSaveCaption = () => {
        if (design) {
            updateDesign(design.id, { caption: editedCaption });
            toast.success("Caption updated!");
        }
    };

    const handleDeleteDesign = () => {
        if (
            design &&
            window.confirm("Are you sure you want to delete this design?")
        ) {
            deleteDesign(design.id);
            toast.success("Design deleted.");
            router.push("/designs");
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    if (!design) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-md retro-border bg-card p-2">
                        <img
                            src={design.generatedImageUrl}
                            alt={design.title}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() =>
                                window.open(design.generatedImageUrl, "_blank")
                            }
                            className="retro-button w-full"
                        >
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                        <Button
                            onClick={handleDeleteDesign}
                            variant="destructive"
                            className="retro-button"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">{design.title}</h1>
                    <div className="text-muted-foreground">
                        <p>
                            <strong>Topic:</strong> {design.topic}
                        </p>
                        <p>
                            <strong>Template:</strong>{" "}
                            <Link
                                href={`/templates/${design.templateId}`}
                                className="underline hover:text-primary"
                            >
                                {templateName}
                            </Link>
                        </p>
                        <p>
                            <strong>Created:</strong>{" "}
                            {new Date(design.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="caption"
                        className="w-full"
                    >
                        <AccordionItem
                            value="caption"
                            className="retro-card mb-4"
                        >
                            <AccordionTrigger className="p-4 font-bold">
                                Caption
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                <Textarea
                                    value={editedCaption}
                                    onChange={(e) =>
                                        setEditedCaption(e.target.value)
                                    }
                                    className="retro-input min-h-[120px]"
                                />
                                <Button
                                    onClick={handleSaveCaption}
                                    className="retro-button mt-2"
                                >
                                    Save Caption
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="prompt" className="retro-card">
                            <AccordionTrigger className="p-4 font-bold">
                                Final Prompt
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                <div className="relative">
                                    <p className="text-sm bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
                                        {design.promptFinal}
                                    </p>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-7 w-7"
                                        onClick={() =>
                                            handleCopyToClipboard(
                                                design.promptFinal
                                            )
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
