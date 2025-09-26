"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { useDesignsStore } from "@/stores/useDesignsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Template } from "@/lib/types";

const steps = [
    { id: 1, name: "Pilih Template" },
    { id: 2, name: "Masukkan Topik & Detail" },
    { id: 3, name: "Generate & Simpan" },
];

function GenerateDesignWizard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { templates, getTemplate } = useTemplatesStore();
    const { addDesign } = useDesignsStore();
    const { user } = useAuthStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null
    );

    // Step 2 state
    const [topic, setTopic] = useState("");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");

    // Step 3 state
    const [finalPrompt, setFinalPrompt] = useState("");
    const [caption, setCaption] = useState("");
    const [generatedImage, setGeneratedImage] = useState("");

    useEffect(() => {
        const templateId = searchParams.get("templateId");
        if (templateId) {
            const t = getTemplate(templateId);
            if (t) {
                setSelectedTemplate(t);
                setCurrentStep(2);
            }
        }
    }, [searchParams, getTemplate]);

    const handleCreatePrompt = () => {
        if (!selectedTemplate) return;

        let prompt = selectedTemplate.promptTemplate
            .replace(/{{topic}}/g, topic)
            .replace(/{{title}}/g, title)
            .replace(/{{subtitle}}/g, subtitle);

        setFinalPrompt(prompt);

        const captionInstruction = `Write a short, catchy Indonesian caption (max 180 chars) about ${topic} with a friendly, youthful tone. End with 1 emoji.`;
        setCaption(`Ini adalah caption contoh untuk topik "${topic}"! ✨`); // Mock caption

        setGeneratedImage(
            `https://picsum.photos/seed/${Math.random()}/900/1125`
        );

        setCurrentStep(3);
    };

    const handleSaveDesign = () => {
        if (!user || !selectedTemplate) {
            toast.error("Error saving design. User or template not found.");
            return;
        }
        const newDesign = addDesign({
            templateId: selectedTemplate.id,
            title: title || "Untitled Design",
            topic,
            generatedImageUrl: generatedImage,
            promptFinal: finalPrompt,
            caption,
            ownerId: user.id,
        });
        toast.success("Design berhasil disimpan!");
        router.push(`/designs/${newDesign.id}`);
    };

    const nextStep = () =>
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Generate New Design</h1>

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
                                Step 1: Pilih Template
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {templates.map((t) => (
                                    <Card
                                        key={t.id}
                                        className="cursor-pointer hover:border-primary"
                                        onClick={() => {
                                            setSelectedTemplate(t);
                                            nextStep();
                                        }}
                                    >
                                        <CardContent className="p-2">
                                            <img
                                                src={t.referenceImageUrl}
                                                alt={t.name}
                                                className="aspect-[4/5] w-full object-cover rounded-md"
                                            />
                                            <p className="font-semibold mt-2 text-sm">
                                                {t.name}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && selectedTemplate && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Step 2: Masukkan Topik & Detail
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Template Terpilih
                                    </h3>
                                    <img
                                        src={selectedTemplate.referenceImageUrl}
                                        alt={selectedTemplate.name}
                                        className="w-full rounded-md retro-border"
                                    />
                                    <p className="font-bold mt-2">
                                        {selectedTemplate.name}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="topic">
                                            Topic (Wajib)
                                        </Label>
                                        <Input
                                            id="topic"
                                            value={topic}
                                            onChange={(e) =>
                                                setTopic(e.target.value)
                                            }
                                            className="retro-input"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="title">
                                            Title (Opsional)
                                        </Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            className="retro-input"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="subtitle">
                                            Subtitle (Opsional)
                                        </Label>
                                        <Input
                                            id="subtitle"
                                            value={subtitle}
                                            onChange={(e) =>
                                                setSubtitle(e.target.value)
                                            }
                                            className="retro-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && selectedTemplate && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Step 3: Generate (Mock) & Simpan
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Final Prompt
                                    </h3>
                                    <Textarea
                                        value={finalPrompt}
                                        readOnly
                                        className="retro-input min-h-[150px] bg-muted/50"
                                    />
                                    <h3 className="font-semibold mb-2 mt-4">
                                        Hasil Gambar (Mock)
                                    </h3>
                                    <img
                                        src={generatedImage}
                                        alt="Generated Design"
                                        className="w-full rounded-md retro-border"
                                    />
                                    <Button
                                        onClick={() =>
                                            setGeneratedImage(
                                                `https://picsum.photos/seed/${Math.random()}/900/1125`
                                            )
                                        }
                                        className="retro-button w-full mt-2"
                                    >
                                        Regenerate (Mock)
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="final-title">
                                            Title
                                        </Label>
                                        <Input
                                            id="final-title"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            className="retro-input"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="final-caption">
                                            Caption
                                        </Label>
                                        <Textarea
                                            id="final-caption"
                                            value={caption}
                                            onChange={(e) =>
                                                setCaption(e.target.value)
                                            }
                                            className="retro-input min-h-[150px]"
                                        />
                                    </div>
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
                {currentStep === 2 && (
                    <Button
                        onClick={handleCreatePrompt}
                        disabled={!topic}
                        className="retro-button"
                    >
                        Buat Prompt
                    </Button>
                )}
                {currentStep === 3 && (
                    <Button onClick={handleSaveDesign} className="retro-button">
                        Simpan Design
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function NewDesignPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GenerateDesignWizard />
        </Suspense>
    );
}
