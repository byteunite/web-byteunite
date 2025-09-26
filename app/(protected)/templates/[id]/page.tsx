"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { Template, TemplateElement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function TemplateDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { getTemplate, updateTemplate } = useTemplatesStore();
    const [template, setTemplate] = useState<Template | null>(null);
    const [editedElements, setEditedElements] = useState<TemplateElement[]>([]);
    const [editedPrompt, setEditedPrompt] = useState("");

    // Preview state
    const [previewTopic, setPreviewTopic] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewSubtitle, setPreviewSubtitle] = useState("");
    const [generatedPreview, setGeneratedPreview] = useState("");

    useEffect(() => {
        if (params.id) {
            const t = getTemplate(params.id as string);
            if (t) {
                setTemplate(t);
                setEditedElements(JSON.parse(JSON.stringify(t.elements))); // Deep copy
                setEditedPrompt(t.promptTemplate);
            } else {
                // Handle template not found
                router.push("/templates");
            }
        }
    }, [params.id, getTemplate, router]);

    const handleElementChange = (
        id: string,
        field: keyof TemplateElement,
        value: any
    ) => {
        setEditedElements(
            editedElements.map((el) =>
                el.id === id ? { ...el, [field]: value } : el
            )
        );
    };

    const handleSaveChanges = () => {
        if (template) {
            updateTemplate(template.id, {
                elements: editedElements,
                promptTemplate: editedPrompt,
            });
            toast.success("Template updated successfully!");
        }
    };

    const generatePromptPreview = () => {
        let preview = editedPrompt
            .replace(/{{topic}}/g, previewTopic || "...")
            .replace(/{{title}}/g, previewTitle || "...")
            .replace(/{{subtitle}}/g, previewSubtitle || "...");
        setGeneratedPreview(preview);
    };

    if (!template) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                    <img
                        src={template.referenceImageUrl}
                        alt={template.name}
                        className="w-32 h-40 object-cover rounded-md retro-border"
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{template.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Created:{" "}
                            {new Date(template.createdAt).toLocaleDateString()}{" "}
                            | Last Updated:{" "}
                            {new Date(template.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <Button asChild className="retro-button">
                    <Link href={`/designs/new?templateId=${template.id}`}>
                        Gunakan Template → Generate Design
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="elements">
                <TabsList className="retro-border">
                    <TabsTrigger value="elements">Elemen</TabsTrigger>
                    <TabsTrigger value="prompt">Prompt</TabsTrigger>
                    <TabsTrigger value="preview">Pratinjau Prompt</TabsTrigger>
                </TabsList>
                <TabsContent value="elements">
                    <Card className="retro-card">
                        <CardHeader>
                            <CardTitle>Template Elements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {editedElements.map((el) => (
                                <div
                                    key={el.id}
                                    className="flex items-center justify-between p-3 border rounded-md"
                                >
                                    <div>
                                        <p>
                                            {el.label}{" "}
                                            <span className="text-xs text-muted-foreground">
                                                ({el.type})
                                            </span>
                                        </p>
                                        <Input
                                            placeholder="Description..."
                                            value={el.description || ""}
                                            onChange={(e) =>
                                                handleElementChange(
                                                    el.id,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="text-xs h-8 mt-1"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Label
                                            htmlFor={`replaceable-${el.id}`}
                                            className="text-sm"
                                        >
                                            Replaceable
                                        </Label>
                                        <Switch
                                            id={`replaceable-${el.id}`}
                                            checked={el.replaceable}
                                            onCheckedChange={(checked) =>
                                                handleElementChange(
                                                    el.id,
                                                    "replaceable",
                                                    checked
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="prompt">
                    <Card className="retro-card">
                        <CardHeader>
                            <CardTitle>Prompt Template</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={editedPrompt}
                                onChange={(e) =>
                                    setEditedPrompt(e.target.value)
                                }
                                className="retro-input min-h-[300px]"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="preview">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="retro-card">
                            <CardHeader>
                                <CardTitle>Isi Sample Data</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="preview-topic">Topic</Label>
                                    <Input
                                        id="preview-topic"
                                        value={previewTopic}
                                        onChange={(e) =>
                                            setPreviewTopic(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="preview-title">Title</Label>
                                    <Input
                                        id="preview-title"
                                        value={previewTitle}
                                        onChange={(e) =>
                                            setPreviewTitle(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="preview-subtitle">
                                        Subtitle
                                    </Label>
                                    <Input
                                        id="preview-subtitle"
                                        value={previewSubtitle}
                                        onChange={(e) =>
                                            setPreviewSubtitle(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <Button
                                    onClick={generatePromptPreview}
                                    className="retro-button w-full"
                                >
                                    Generate Preview
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="retro-card">
                            <CardHeader>
                                <CardTitle>Prompt Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/50 p-4 rounded-md min-h-[200px] text-sm whitespace-pre-wrap">
                                    {generatedPreview ||
                                        'Klik "Generate Preview" untuk melihat hasilnya.'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end">
                <Button onClick={handleSaveChanges} className="retro-button">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
