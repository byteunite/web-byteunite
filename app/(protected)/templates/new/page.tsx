"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input-retro";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { TemplateElement } from "@/lib/types";
import { useAuthStore } from "@/stores/useAuthStore";

const steps = [
    { id: 1, name: "Upload & Info" },
    { id: 2, name: "Analisis Gambar" },
    { id: 3, name: "Prompt Template" },
];

export default function NewTemplatePage() {
    const router = useRouter();
    const { addTemplate } = useTemplatesStore();
    const { user } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1 state
    const [templateName, setTemplateName] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Step 2 state
    const [elements, setElements] = useState<TemplateElement[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Step 3 state
    const [promptTemplate, setPromptTemplate] = useState(
        `Create a new design in the style of the reference image.
Keep layout and visual rhythm consistent.
Replace:
- Title with: {{title}}
- Subtitle with: {{subtitle}}
- Topic/Subject: {{topic}}
Maintain color mood similar to reference; keep shapes & spacing.
Output must be a single image ready for social post (4:5).`
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAnalyzeImage = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setElements([
                {
                    id: uuidv4(),
                    label: "Judul Besar",
                    type: "text",
                    replaceable: true,
                },
                {
                    id: uuidv4(),
                    label: "Subjudul",
                    type: "text",
                    replaceable: true,
                },
                {
                    id: uuidv4(),
                    label: "Hero Image/Illustration",
                    type: "image",
                    replaceable: true,
                },
                {
                    id: uuidv4(),
                    label: "Accent Shape",
                    type: "shape",
                    replaceable: false,
                },
                {
                    id: uuidv4(),
                    label: "Background Pattern",
                    type: "shape",
                    replaceable: false,
                },
                {
                    id: uuidv4(),
                    label: "Palette Primary",
                    type: "color",
                    replaceable: true,
                },
                {
                    id: uuidv4(),
                    label: "Small Icon",
                    type: "icon",
                    replaceable: true,
                },
            ]);
            setIsAnalyzing(false);
            setCurrentStep(3);
        }, 1200);
    };

    const handleElementChange = (
        id: string,
        field: keyof TemplateElement,
        value: any
    ) => {
        setElements(
            elements.map((el) =>
                el.id === id ? { ...el, [field]: value } : el
            )
        );
    };

    const handleSaveTemplate = () => {
        if (!user) {
            toast.error("You must be logged in to create a template.");
            return;
        }
        const newTemplate = addTemplate({
            name: templateName,
            referenceImageUrl:
                imagePreview || "https://picsum.photos/seed/default/800/1000",
            elements,
            promptTemplate,
            ownerId: user.id,
        });
        toast.success("Template berhasil disimpan!");
        router.push(`/templates/${newTemplate.id}`);
    };

    const nextStep = () =>
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Create New Template</h1>

            {/* Stepper */}
            <div className="flex justify-between mb-8">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center retro-border ${
                                    currentStep >= step.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card"
                                }`}
                            >
                                {step.id}
                            </div>
                            <p className="mt-2 text-sm">{step.name}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-px bg-border self-center mx-4" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <Card className="retro-card">
                <CardContent className="p-6">
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Step 1: Upload & Info
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="template-name">
                                        Template Name
                                    </Label>
                                    <Input
                                        id="template-name"
                                        value={templateName}
                                        onChange={(e) =>
                                            setTemplateName(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="reference-image">
                                        Upload Reference Image
                                    </Label>
                                    <Input
                                        id="reference-image"
                                        type="file"
                                        onChange={handleImageChange}
                                        className="retro-input"
                                    />
                                </div>
                                {imagePreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-w-xs rounded-md retro-border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Step 2: Analisis Gambar (Mock)
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Klik tombol di bawah untuk memulai analisis
                                gambar (simulasi).
                            </p>
                            <Button
                                onClick={handleAnalyzeImage}
                                disabled={isAnalyzing}
                                className="retro-button"
                            >
                                {isAnalyzing
                                    ? "Menganalisis..."
                                    : "Analisa Gambar"}
                            </Button>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Step 3: Prompt Template
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <Label>Detected Elements</Label>
                                        <div className="space-y-2 mt-2">
                                            {elements.map((el) => (
                                                <div
                                                    key={el.id}
                                                    className="flex items-center justify-between p-2 border rounded-md"
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
                                                            value={
                                                                el.description ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleElementChange(
                                                                    el.id,
                                                                    "description",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="text-xs h-7 mt-1"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Label
                                                            htmlFor={`replaceable-${el.id}`}
                                                            className="text-xs"
                                                        >
                                                            Replaceable
                                                        </Label>
                                                        <Switch
                                                            id={`replaceable-${el.id}`}
                                                            checked={
                                                                el.replaceable
                                                            }
                                                            onCheckedChange={(
                                                                checked
                                                            ) =>
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
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="prompt-template">
                                            Prompt Template
                                        </Label>
                                        <Textarea
                                            id="prompt-template"
                                            value={promptTemplate}
                                            onChange={(e) =>
                                                setPromptTemplate(
                                                    e.target.value
                                                )
                                            }
                                            className="retro-input min-h-[200px]"
                                        />
                                    </div>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-md retro-border">
                                    <h3 className="font-semibold mb-2">
                                        Placeholders
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Gunakan placeholder ini di dalam prompt
                                        Anda. Mereka akan diganti saat membuat
                                        design.
                                    </p>
                                    <ul className="mt-2 space-y-1 text-sm">
                                        <li>
                                            <code>
                                                &#123;&#123;title&#125;&#125;
                                            </code>
                                        </li>
                                        <li>
                                            <code>
                                                &#123;&#123;subtitle&#125;&#125;
                                            </code>
                                        </li>
                                        <li>
                                            <code>
                                                &#123;&#123;topic&#125;&#125;
                                            </code>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="retro-button"
                >
                    Previous
                </Button>
                {currentStep < 2 && (
                    <Button
                        onClick={nextStep}
                        disabled={!templateName || !imagePreview}
                        className="retro-button"
                    >
                        Next
                    </Button>
                )}
                {currentStep === 2 && (
                    <Button
                        onClick={handleAnalyzeImage}
                        disabled={isAnalyzing}
                        className="retro-button"
                    >
                        {isAnalyzing
                            ? "Menganalisis..."
                            : "Analisa Gambar & Lanjutkan"}
                    </Button>
                )}
                {currentStep === 3 && (
                    <Button
                        onClick={handleSaveTemplate}
                        className="retro-button"
                    >
                        Save Template
                    </Button>
                )}
            </div>
        </div>
    );
}
