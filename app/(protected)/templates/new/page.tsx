"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input-retro";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Trash2,
    Plus,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Move,
    RotateCcw,
    Copy,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { TemplateElement, CanvasLayer, CanvasConfiguration } from "@/lib/types";
import { useAuthStore } from "@/stores/useAuthStore";

const steps = [
    { id: 1, name: "Upload & Info" },
    { id: 2, name: "Analisis Gambar" },
    { id: 3, name: "Prompt Template" },
    { id: 4, name: "Canvas Editor" },
];

const fontFamilies = [
    {
        value: "Inter, system-ui, -apple-system, sans-serif",
        label: "Inter (Default)",
    },
    {
        value: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        label: "System Font",
    },
    { value: "Arial, Helvetica, sans-serif", label: "Arial" },
    { value: "Helvetica, Arial, sans-serif", label: "Helvetica" },
    { value: "Georgia, 'Times New Roman', serif", label: "Georgia" },
    { value: "'Times New Roman', Times, serif", label: "Times New Roman" },
    { value: "'Courier New', Courier, monospace", label: "Courier New" },
    { value: "Roboto, Arial, sans-serif", label: "Roboto" },
    { value: "'Open Sans', Arial, sans-serif", label: "Open Sans" },
    { value: "Lato, Arial, sans-serif", label: "Lato" },
    { value: "Montserrat, Arial, sans-serif", label: "Montserrat" },
    { value: "Poppins, Arial, sans-serif", label: "Poppins" },
    { value: "'Playfair Display', Georgia, serif", label: "Playfair Display" },
    { value: "'Source Sans Pro', Arial, sans-serif", label: "Source Sans Pro" },
    { value: "Nunito, Arial, sans-serif", label: "Nunito" },
    { value: "Raleway, Arial, sans-serif", label: "Raleway" },
    { value: "Ubuntu, Arial, sans-serif", label: "Ubuntu" },
];

export default function NewTemplatePage() {
    const router = useRouter();
    const { addTemplate } = useTemplatesStore();
    const { user } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1 state
    const [templateName, setTemplateName] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDetails, setImageDetails] = useState<{
        width: number;
        height: number;
        ratio: string;
        size: string;
    } | null>(null);

    // Step 2 state
    const [elements, setElements] = useState<TemplateElement[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Step 3 state
    const [promptTemplate, setPromptTemplate] = useState("");

    // Function to generate dynamic prompt template based on elements
    const generatePromptTemplate = (elements: TemplateElement[]) => {
        const replaceableElements = elements.filter((el) => el.replaceable);

        if (replaceableElements.length === 0) {
            return `Create a new design in the style of the reference image.
Keep layout and visual rhythm consistent.
Replace:
- Title with: {{title}}
- Subtitle with: {{subtitle}}
- Topic/Subject: {{topic}}
Maintain color mood similar to reference; keep shapes & spacing.
Output must be a single image ready for social post (4:5).`;
        }

        let prompt =
            "Create a new design in the style of the reference image.\n";
        prompt += "Keep layout and visual rhythm consistent.\n\n";
        prompt += "Replace the following elements:\n";

        replaceableElements.forEach((el) => {
            const placeholderName = el.label.replace(/\s+/g, " ").trim();
            prompt += `- ${el.label} (${el.type}) with: {{${placeholderName}}}\n`;
        });

        prompt +=
            "\nMaintain color mood and visual hierarchy similar to reference.\n";
        prompt += "Keep shapes, spacing, and overall composition consistent.\n";
        prompt += "Output must be a single image ready for social media use.";

        return prompt;
    };

    // Function to calculate optimal canvas dimensions based on image
    const calculateCanvasDimensions = (
        imageWidth: number,
        imageHeight: number
    ) => {
        const maxCanvasWidth = 1200;
        const maxCanvasHeight = 1200;
        const minCanvasWidth = 400;
        const minCanvasHeight = 400;

        // Calculate aspect ratio
        const aspectRatio = imageWidth / imageHeight;

        let canvasWidth = imageWidth;
        let canvasHeight = imageHeight;

        // Scale down if too large
        if (canvasWidth > maxCanvasWidth || canvasHeight > maxCanvasHeight) {
            if (aspectRatio > 1) {
                // Landscape or square
                canvasWidth = maxCanvasWidth;
                canvasHeight = Math.round(maxCanvasWidth / aspectRatio);
            } else {
                // Portrait
                canvasHeight = maxCanvasHeight;
                canvasWidth = Math.round(maxCanvasHeight * aspectRatio);
            }
        }

        // Scale up if too small
        if (canvasWidth < minCanvasWidth || canvasHeight < minCanvasHeight) {
            if (aspectRatio > 1) {
                // Landscape or square
                canvasWidth = minCanvasWidth;
                canvasHeight = Math.round(minCanvasWidth / aspectRatio);
            } else {
                // Portrait
                canvasHeight = minCanvasHeight;
                canvasWidth = Math.round(minCanvasHeight * aspectRatio);
            }
        }

        return {
            width: Math.round(canvasWidth),
            height: Math.round(canvasHeight),
            aspectRatio,
        };
    };

    // Step 4 state - Canvas Editor
    const [canvasConfig, setCanvasConfig] = useState<CanvasConfiguration>({
        width: 800,
        height: 1000,
        backgroundColor: "#ffffff",
        layers: [],
        promptAdjustments: "",
    });
    const [selectedLayerId, setSelectedLayerId] = useState<string | undefined>(
        undefined
    );

    // Drag and resize state
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [resizeHandle, setResizeHandle] = useState<string>(""); // 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'

    // Auto-initialize canvas when entering step 4
    useEffect(() => {
        if (
            currentStep === 4 &&
            canvasConfig.layers.length === 0 &&
            imagePreview
        ) {
            initializeCanvas();
        }
    }, [currentStep]);

    // Load Google Fonts for canvas preview
    useEffect(() => {
        // Create and append Google Fonts link if not already present
        const existingLink = document.querySelector(
            'link[href*="fonts.googleapis.com"][href*="Roboto"]'
        );
        if (!existingLink) {
            const link = document.createElement("link");
            link.href =
                "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;500;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@400;600;700&family=Nunito:wght@400;600;700&family=Raleway:wght@400;500;600;700&family=Ubuntu:wght@400;500;700&display=swap";
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAnalyzeImage = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const detectedElements: TemplateElement[] = [
                {
                    id: uuidv4(),
                    label: "Judul Besar",
                    type: "text" as const,
                    replaceable: true,
                },
                {
                    id: uuidv4(),
                    label: "Subjudul",
                    type: "text" as const,
                    replaceable: true,
                },
                {
                    id: uuidv4(),
                    label: "Hero Image/Illustration",
                    type: "image" as const,
                    replaceable: true,
                },
                {
                    id: uuidv4(),
                    label: "Accent Shape",
                    type: "shape" as const,
                    replaceable: false,
                },
                {
                    id: uuidv4(),
                    label: "Background Pattern",
                    type: "shape" as const,
                    replaceable: false,
                },
                {
                    id: uuidv4(),
                    label: "Palette Primary",
                    type: "color" as const,
                    replaceable: true,
                },
                {
                    id: uuidv4(),
                    label: "Small Icon",
                    type: "icon" as const,
                    replaceable: true,
                },
            ];

            setElements(detectedElements);

            // Generate dynamic prompt template based on detected elements
            const generatedPrompt = generatePromptTemplate(detectedElements);
            setPromptTemplate(generatedPrompt);

            setIsAnalyzing(false);
            setCurrentStep(3);
        }, 1200);
    };

    const handleElementChange = (
        id: string,
        field: keyof TemplateElement,
        value: any
    ) => {
        const updatedElements = elements.map((el) =>
            el.id === id ? { ...el, [field]: value } : el
        );
        setElements(updatedElements);

        // Update prompt template when element label or replaceable status changes
        if (field === "label" || field === "replaceable") {
            const generatedPrompt = generatePromptTemplate(updatedElements);
            setPromptTemplate(generatedPrompt);
        }
    };

    const handleDeleteElement = (id: string) => {
        const updatedElements = elements.filter((el) => el.id !== id);
        setElements(updatedElements);

        // Update prompt template after deletion
        const generatedPrompt = generatePromptTemplate(updatedElements);
        setPromptTemplate(generatedPrompt);
    };

    const handleAddElement = (type: TemplateElement["type"]) => {
        const typeLabels = {
            text: "Teks Baru",
            image: "Gambar Baru",
            color: "Warna Baru",
            shape: "Bentuk Baru",
            icon: "Ikon Baru",
        };

        const newElement: TemplateElement = {
            id: uuidv4(),
            label: typeLabels[type],
            type,
            replaceable: true,
            description: "",
        };

        const updatedElements = [...elements, newElement];
        setElements(updatedElements);

        // Update prompt template with new elements
        const generatedPrompt = generatePromptTemplate(updatedElements);
        setPromptTemplate(generatedPrompt);
    };

    // Canvas management functions
    const initializeCanvas = () => {
        // Calculate canvas dimensions based on uploaded image
        let canvasDimensions = { width: 800, height: 1000, aspectRatio: 0.8 };

        if (imageDetails) {
            canvasDimensions = calculateCanvasDimensions(
                imageDetails.width,
                imageDetails.height
            );
        }

        // Update canvas config with calculated dimensions
        setCanvasConfig((prev) => ({
            ...prev,
            width: canvasDimensions.width,
            height: canvasDimensions.height,
        }));

        const initialLayers: CanvasLayer[] = [
            {
                id: uuidv4(),
                name: "Reference Background",
                type: "background",
                visible: true,
                locked: true, // Lock the reference image to prevent accidental changes
                opacity: 60, // Make it semi-transparent to serve as a guide
                zIndex: 0,
                x: 0,
                y: 0,
                width: canvasDimensions.width,
                height: canvasDimensions.height,
                rotation: 0,
                imageUrl: imagePreview || undefined,
                backgroundColor: "#f8f9fa",
                aiPrompt:
                    "This is the reference image that serves as a guide for the design layout and composition.",
            },
            {
                id: uuidv4(),
                name: "Title Text",
                type: "text",
                visible: true,
                locked: false,
                opacity: 100,
                zIndex: 2,
                x: Math.round(canvasDimensions.width * 0.05), // 5% margin
                y: Math.round(canvasDimensions.height * 0.1), // 10% from top
                width: Math.round(canvasDimensions.width * 0.9), // 90% width
                height: Math.round(canvasDimensions.height * 0.12), // 12% height
                rotation: 0,
                text: "{{Judul Besar}}",
                fontSize: Math.round(canvasDimensions.width / 20), // Responsive font size
                fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                fontWeight: "bold",
                textAlign: "center",
                color: "#000000",
                backgroundColor: "transparent",
                aiPrompt:
                    "Create a compelling title that grabs attention. Keep it under 60 characters. Use power words and clear messaging.",
            },
            {
                id: uuidv4(),
                name: "Subtitle Text",
                type: "text",
                visible: true,
                locked: false,
                opacity: 100,
                zIndex: 3,
                x: Math.round(canvasDimensions.width * 0.05), // 5% margin
                y: Math.round(canvasDimensions.height * 0.25), // 25% from top
                width: Math.round(canvasDimensions.width * 0.9), // 90% width
                height: Math.round(canvasDimensions.height * 0.08), // 8% height
                rotation: 0,
                text: "{{Subjudul}}",
                fontSize: Math.round(canvasDimensions.width / 35), // Responsive font size
                fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                fontWeight: "normal",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "transparent",
                aiPrompt:
                    "Create a supporting subtitle that explains or elaborates the main title. Keep it under 100 characters and easy to read.",
            },
        ];

        setCanvasConfig((prev) => ({
            ...prev,
            layers: initialLayers,
        }));
    };

    const addCanvasLayer = (type: CanvasLayer["type"]) => {
        const defaultAiPrompts = {
            text: "Create engaging text content that fits the design context. Keep it clear and readable.",
            background:
                "Design a background that supports the overall composition without overwhelming other elements.",
            foreground:
                "Create a foreground element that adds visual interest while maintaining design harmony.",
        };

        const newLayer: CanvasLayer = {
            id: uuidv4(),
            name:
                type === "text"
                    ? "New Text"
                    : type === "background"
                    ? "New Background"
                    : "New Foreground",
            type,
            visible: true,
            locked: false,
            opacity: 100,
            zIndex: canvasConfig.layers.length,
            x: 100,
            y: 100,
            width: type === "text" ? 400 : 200,
            height: type === "text" ? 50 : 200,
            rotation: 0,
            aiPrompt: defaultAiPrompts[type],
            ...(type === "text"
                ? {
                      text: "New text",
                      fontSize: 24,
                      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                      fontWeight: "normal",
                      textAlign: "center",
                      color: "#000000",
                      backgroundColor: "transparent",
                  }
                : {
                      backgroundColor: "#e2e8f0",
                  }),
        };

        setCanvasConfig((prev) => ({
            ...prev,
            layers: [...prev.layers, newLayer],
        }));
        setSelectedLayerId(newLayer.id);
    };

    const updateLayer = (layerId: string, updates: Partial<CanvasLayer>) => {
        setCanvasConfig((prev) => ({
            ...prev,
            layers: prev.layers.map((layer) =>
                layer.id === layerId ? { ...layer, ...updates } : layer
            ),
        }));
    };

    const deleteLayer = (layerId: string) => {
        setCanvasConfig((prev) => ({
            ...prev,
            layers: prev.layers.filter((layer) => layer.id !== layerId),
        }));
        if (selectedLayerId === layerId) {
            setSelectedLayerId(undefined);
        }
    };

    const duplicateLayer = (layerId: string) => {
        const layerToDuplicate = canvasConfig.layers.find(
            (layer) => layer.id === layerId
        );
        if (layerToDuplicate) {
            const duplicatedLayer: CanvasLayer = {
                ...layerToDuplicate,
                id: uuidv4(),
                name: layerToDuplicate.name + " Copy",
                x: layerToDuplicate.x + 20,
                y: layerToDuplicate.y + 20,
                zIndex: canvasConfig.layers.length,
            };
            setCanvasConfig((prev) => ({
                ...prev,
                layers: [...prev.layers, duplicatedLayer],
            }));
        }
    };

    const reorderLayers = (fromIndex: number, toIndex: number) => {
        const newLayers = [...canvasConfig.layers];
        const [removed] = newLayers.splice(fromIndex, 1);
        newLayers.splice(toIndex, 0, removed);

        // Update zIndex based on new order
        const reorderedLayers = newLayers.map((layer, index) => ({
            ...layer,
            zIndex: index,
        }));

        setCanvasConfig((prev) => ({
            ...prev,
            layers: reorderedLayers,
        }));
    };

    // Layer ordering functions
    const moveLayerUp = (layerId: string) => {
        const layers = [...canvasConfig.layers];
        const currentLayer = layers.find((layer) => layer.id === layerId);
        if (!currentLayer) return;

        const currentZIndex = currentLayer.zIndex;
        const layerAbove = layers.find(
            (layer) => layer.zIndex === currentZIndex + 1
        );

        if (layerAbove) {
            // Swap zIndex values
            const updatedLayers = layers.map((layer) => {
                if (layer.id === currentLayer.id) {
                    return { ...layer, zIndex: currentZIndex + 1 };
                } else if (layer.id === layerAbove.id) {
                    return { ...layer, zIndex: currentZIndex };
                }
                return layer;
            });

            setCanvasConfig((prev) => ({
                ...prev,
                layers: updatedLayers,
            }));
        }
    };

    const moveLayerDown = (layerId: string) => {
        const layers = [...canvasConfig.layers];
        const currentLayer = layers.find((layer) => layer.id === layerId);
        if (!currentLayer) return;

        const currentZIndex = currentLayer.zIndex;
        const layerBelow = layers.find(
            (layer) => layer.zIndex === currentZIndex - 1
        );

        if (layerBelow) {
            // Swap zIndex values
            const updatedLayers = layers.map((layer) => {
                if (layer.id === currentLayer.id) {
                    return { ...layer, zIndex: currentZIndex - 1 };
                } else if (layer.id === layerBelow.id) {
                    return { ...layer, zIndex: currentZIndex };
                }
                return layer;
            });

            setCanvasConfig((prev) => ({
                ...prev,
                layers: updatedLayers,
            }));
        }
    };

    // Drag and resize handlers
    const handleMouseDown = (
        e: React.MouseEvent,
        layerId: string,
        action: "drag" | "resize",
        handle?: string
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const layer = canvasConfig.layers.find((l) => l.id === layerId);
        if (!layer || layer.locked) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const canvasRect = (e.currentTarget as HTMLElement)
            .closest(".canvas-container")
            ?.getBoundingClientRect();
        if (!canvasRect) return;

        setSelectedLayerId(layerId);

        if (action === "drag") {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - canvasRect.left,
                y: e.clientY - canvasRect.top,
            });
        } else if (action === "resize" && handle) {
            setIsResizing(true);
            setResizeHandle(handle);
            setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: layer.width,
                height: layer.height,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!selectedLayerId) return;

        const layer = canvasConfig.layers.find((l) => l.id === selectedLayerId);
        if (!layer || layer.locked) return;

        const canvasRect = (
            e.currentTarget as HTMLElement
        ).getBoundingClientRect();
        const scale = Math.min(600, canvasConfig.width) / canvasConfig.width;

        if (isDragging) {
            const currentX = e.clientX - canvasRect.left;
            const currentY = e.clientY - canvasRect.top;

            const newX = Math.max(
                0,
                Math.min(
                    canvasConfig.width - layer.width,
                    layer.x + (currentX - dragStart.x) / scale
                )
            );
            const newY = Math.max(
                0,
                Math.min(
                    canvasConfig.height - layer.height,
                    layer.y + (currentY - dragStart.y) / scale
                )
            );

            updateLayer(selectedLayerId, { x: newX, y: newY });

            setDragStart({ x: currentX, y: currentY });
        } else if (isResizing) {
            const deltaX = (e.clientX - resizeStart.x) / scale;
            const deltaY = (e.clientY - resizeStart.y) / scale;

            let newWidth = layer.width;
            let newHeight = layer.height;
            let newX = layer.x;
            let newY = layer.y;

            // Handle different resize directions
            if (resizeHandle.includes("e")) {
                newWidth = Math.max(20, resizeStart.width + deltaX);
            }
            if (resizeHandle.includes("w")) {
                newWidth = Math.max(20, resizeStart.width - deltaX);
                newX = Math.max(0, layer.x + deltaX);
            }
            if (resizeHandle.includes("s")) {
                newHeight = Math.max(20, resizeStart.height + deltaY);
            }
            if (resizeHandle.includes("n")) {
                newHeight = Math.max(20, resizeStart.height - deltaY);
                newY = Math.max(0, layer.y + deltaY);
            }

            // Ensure element stays within canvas bounds
            newX = Math.max(0, Math.min(canvasConfig.width - newWidth, newX));
            newY = Math.max(0, Math.min(canvasConfig.height - newHeight, newY));
            newWidth = Math.min(canvasConfig.width - newX, newWidth);
            newHeight = Math.min(canvasConfig.height - newY, newHeight);

            updateLayer(selectedLayerId, {
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle("");
    };

    // Keyboard controls for fine positioning
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!selectedLayerId) return;

        const layer = canvasConfig.layers.find((l) => l.id === selectedLayerId);
        if (!layer || layer.locked) return;

        const step = e.shiftKey ? 10 : 1; // Shift for larger steps
        let updates: Partial<CanvasLayer> = {};

        switch (e.key) {
            case "ArrowLeft":
                e.preventDefault();
                updates.x = Math.max(0, layer.x - step);
                break;
            case "ArrowRight":
                e.preventDefault();
                updates.x = Math.min(
                    canvasConfig.width - layer.width,
                    layer.x + step
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                updates.y = Math.max(0, layer.y - step);
                break;
            case "ArrowDown":
                e.preventDefault();
                updates.y = Math.min(
                    canvasConfig.height - layer.height,
                    layer.y + step
                );
                break;
            case "Delete":
            case "Backspace":
                e.preventDefault();
                deleteLayer(selectedLayerId);
                break;
            case "d":
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    duplicateLayer(selectedLayerId);
                }
                break;
        }

        if (Object.keys(updates).length > 0) {
            updateLayer(selectedLayerId, updates);
        }
    };

    const handleSaveTemplate = () => {
        if (!user) {
            toast.error("You must be logged in to create a template.");
            return;
        }

        // Combine original prompt with canvas adjustments
        const finalPrompt = canvasConfig.promptAdjustments
            ? `${promptTemplate}\n\nCanvas Layout Instructions:\n${canvasConfig.promptAdjustments}`
            : promptTemplate;

        const newTemplate = addTemplate({
            name: templateName,
            referenceImageUrl:
                imagePreview || "https://picsum.photos/seed/default/800/1000",
            elements,
            promptTemplate: finalPrompt,
            ownerId: user.id,
            canvasConfig:
                canvasConfig.layers.length > 0 ? canvasConfig : undefined,
        });

        toast.success("Template berhasil disimpan!");
        router.push(`/templates/${newTemplate.id}`);
    };

    const nextStep = () => {
        const newStep = Math.min(currentStep + 1, steps.length);
        setCurrentStep(newStep);

        // Auto-initialize canvas when entering step 4
        if (newStep === 4 && canvasConfig.layers.length === 0) {
            // Small delay to ensure state is updated
            setTimeout(() => {
                initializeCanvas();
            }, 100);
        }
    };
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
                                    <ImageDropzone
                                        onImageUpload={(file: File) => {
                                            if (file) {
                                                const url =
                                                    URL.createObjectURL(file);
                                                setImagePreview(url);

                                                // Get image dimensions
                                                const img = new Image();
                                                img.onload = () => {
                                                    const ratio = (
                                                        img.width / img.height
                                                    ).toFixed(2);
                                                    const ratioFormatted =
                                                        img.width > img.height
                                                            ? `${
                                                                  Math.round(
                                                                      (img.width /
                                                                          img.height) *
                                                                          10
                                                                  ) / 10
                                                              }:1`
                                                            : img.width ===
                                                              img.height
                                                            ? "1:1"
                                                            : `1:${
                                                                  Math.round(
                                                                      (img.height /
                                                                          img.width) *
                                                                          10
                                                                  ) / 10
                                                              }`;

                                                    setImageDetails({
                                                        width: img.width,
                                                        height: img.height,
                                                        ratio: ratioFormatted,
                                                        size: `${(
                                                            file.size /
                                                            (1024 * 1024)
                                                        ).toFixed(2)} MB`,
                                                    });
                                                };
                                                img.src = url;
                                            }
                                        }}
                                        imagePreview={imagePreview}
                                        setImagePreview={setImagePreview}
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
                            <h2 className="text-xl font-semibold mb-6">
                                Step 3: Prompt Template
                            </h2>

                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Elements by Category */}
                                    <div>
                                        <Label className="text-base font-medium">
                                            Design Elements
                                        </Label>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Konfigurasi elemen-elemen yang
                                            terdeteksi dalam gambar referensi
                                        </p>

                                        {/* Group elements by type */}
                                        {(() => {
                                            const typeConfig = {
                                                text: {
                                                    icon: "📝",
                                                    label: "Elemen Teks",
                                                    color: "bg-blue-500/10 border-blue-200",
                                                },
                                                image: {
                                                    icon: "🖼️",
                                                    label: "Elemen Gambar",
                                                    color: "bg-green-500/10 border-green-200",
                                                },
                                                color: {
                                                    icon: "🎨",
                                                    label: "Elemen Warna",
                                                    color: "bg-purple-500/10 border-purple-200",
                                                },
                                                shape: {
                                                    icon: "🔷",
                                                    label: "Elemen Bentuk",
                                                    color: "bg-orange-500/10 border-orange-200",
                                                },
                                                icon: {
                                                    icon: "⭐",
                                                    label: "Elemen Ikon",
                                                    color: "bg-yellow-500/10 border-yellow-200",
                                                },
                                            };

                                            // Group existing elements by type
                                            const elementsByType =
                                                elements.reduce((acc, el) => {
                                                    if (!acc[el.type])
                                                        acc[el.type] = [];
                                                    acc[el.type].push(el);
                                                    return acc;
                                                }, {} as Record<string, TemplateElement[]>);

                                            // Show all categories, even empty ones
                                            return Object.entries(
                                                typeConfig
                                            ).map(([type, config]) => {
                                                const typeElements =
                                                    elementsByType[type] || [];

                                                return (
                                                    <div
                                                        key={type}
                                                        className="mb-6"
                                                    >
                                                        <div
                                                            className={`p-4 rounded-lg border-2 border-dashed ${config.color}`}
                                                        >
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg">
                                                                        {
                                                                            config.icon
                                                                        }
                                                                    </span>
                                                                    <h4 className="font-medium text-sm">
                                                                        {
                                                                            config.label
                                                                        }{" "}
                                                                        (
                                                                        {
                                                                            typeElements.length
                                                                        }
                                                                        )
                                                                    </h4>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        handleAddElement(
                                                                            type as TemplateElement["type"]
                                                                        )
                                                                    }
                                                                    className="h-7 px-2 text-xs"
                                                                >
                                                                    <Plus className="w-3 h-3 mr-1" />
                                                                    Tambah
                                                                </Button>
                                                            </div>

                                                            <div className="space-y-3">
                                                                {typeElements.length >
                                                                0 ? (
                                                                    typeElements.map(
                                                                        (
                                                                            el
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    el.id
                                                                                }
                                                                                className="bg-background p-4 rounded-md border"
                                                                            >
                                                                                <div className="flex items-start justify-between mb-3">
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-2 mb-2">
                                                                                            <Input
                                                                                                value={
                                                                                                    el.label
                                                                                                }
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    handleElementChange(
                                                                                                        el.id,
                                                                                                        "label",
                                                                                                        e
                                                                                                            .target
                                                                                                            .value
                                                                                                    )
                                                                                                }
                                                                                                className="font-medium text-sm h-8 max-w-[200px]"
                                                                                                placeholder="Nama elemen..."
                                                                                            />
                                                                                            <span className="text-xs px-2 py-1 bg-muted rounded-full">
                                                                                                {
                                                                                                    el.type
                                                                                                }
                                                                                            </span>
                                                                                        </div>
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
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                            onClick={() =>
                                                                                                handleDeleteElement(
                                                                                                    el.id
                                                                                                )
                                                                                            }
                                                                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                                        >
                                                                                            <Trash2 className="w-3 h-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <Label
                                                                                        htmlFor={`desc-${el.id}`}
                                                                                        className="text-xs text-muted-foreground"
                                                                                    >
                                                                                        Prompt
                                                                                        Element
                                                                                    </Label>
                                                                                    <Textarea
                                                                                        id={`desc-${el.id}`}
                                                                                        placeholder={(() => {
                                                                                            const placeholders =
                                                                                                {
                                                                                                    text: "Contoh: Judul utama yang menarik perhatian, font bold, warna kontras",
                                                                                                    image: "Contoh: Ilustrasi hero dengan style minimalis, ukuran dominan",
                                                                                                    color: "Contoh: Warna primer brand #3B82F6, digunakan untuk aksen dan CTA",
                                                                                                    shape: "Contoh: Bentuk geometris sebagai accent, lingkaran dengan gradient",
                                                                                                    icon: "Contoh: Ikon sosial media, style outline, ukuran 24px",
                                                                                                };
                                                                                            return (
                                                                                                placeholders[
                                                                                                    el.type as keyof typeof placeholders
                                                                                                ] ||
                                                                                                "Deskripsi elemen..."
                                                                                            );
                                                                                        })()}
                                                                                        value={
                                                                                            el.description ||
                                                                                            ""
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleElementChange(
                                                                                                el.id,
                                                                                                "description",
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                        className="retro-input min-h-[80px] text-sm"
                                                                                    />

                                                                                    {/* Dummy data examples */}
                                                                                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                                                                        <span className="font-medium">
                                                                                            Contoh
                                                                                            data:
                                                                                        </span>{" "}
                                                                                        {(() => {
                                                                                            const examples =
                                                                                                {
                                                                                                    text: '"Revolusi Digital 2024", "Subtitle yang menjelaskan"',
                                                                                                    image: '"Hero illustration", "Product mockup", "Background pattern"',
                                                                                                    color: '"#3B82F6", "Primary blue", "Accent orange #FB923C"',
                                                                                                    shape: '"Circle accent", "Triangle decoration", "Line separator"',
                                                                                                    icon: '"Social icon", "Arrow indicator", "Star rating"',
                                                                                                };
                                                                                            return (
                                                                                                examples[
                                                                                                    el.type as keyof typeof examples
                                                                                                ] ||
                                                                                                "Contoh data"
                                                                                            );
                                                                                        })()}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    // Empty state
                                                                    <div className="text-center py-8 text-muted-foreground">
                                                                        <div className="text-2xl mb-2">
                                                                            {
                                                                                config.icon
                                                                            }
                                                                        </div>
                                                                        <p className="text-sm">
                                                                            Belum
                                                                            ada{" "}
                                                                            {config.label.toLowerCase()}
                                                                        </p>
                                                                        <p className="text-xs mt-1">
                                                                            Klik
                                                                            tombol
                                                                            "Tambah"
                                                                            untuk
                                                                            menambahkan
                                                                            elemen
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>

                                    {/* Prompt Template Section */}
                                    <div>
                                        <Label
                                            htmlFor="prompt-template"
                                            className="text-base font-medium"
                                        >
                                            AI Prompt Template
                                        </Label>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Template instruksi untuk AI
                                            generator. Gunakan placeholder untuk
                                            membuat design yang dapat
                                            dikustomisasi.
                                        </p>
                                        <Textarea
                                            id="prompt-template"
                                            value={promptTemplate}
                                            onChange={(e) =>
                                                setPromptTemplate(
                                                    e.target.value
                                                )
                                            }
                                            placeholder={(() => {
                                                const replaceableElements =
                                                    elements.filter(
                                                        (el) => el.replaceable
                                                    );
                                                if (
                                                    replaceableElements.length >
                                                    0
                                                ) {
                                                    let placeholder =
                                                        "Create a modern design in the style of the reference image.\n";
                                                    placeholder +=
                                                        "Replace the following elements:\n";
                                                    replaceableElements
                                                        .slice(0, 3)
                                                        .forEach((el) => {
                                                            placeholder += `- ${el.label} with: {{${el.label}}}\n`;
                                                        });
                                                    placeholder +=
                                                        "Maintain visual hierarchy and color scheme from the reference.";
                                                    return placeholder;
                                                }
                                                return `Create a modern design in the style of the reference image. 
Replace the main title with: {{title}}
Replace the subtitle with: {{subtitle}}
Use topic: {{topic}} as the main focus.
Maintain the visual hierarchy and color scheme from the reference.`;
                                            })()}
                                            className="retro-input min-h-[200px] text-sm leading-relaxed"
                                        />

                                        {/* Template Guidelines */}
                                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <h4 className="text-sm font-medium text-blue-900 mb-2">
                                                💡 Tips Menulis Prompt:
                                            </h4>
                                            <ul className="text-xs text-blue-800 space-y-1">
                                                <li>
                                                    • Gunakan "Create a [style]
                                                    design" untuk memulai
                                                </li>
                                                <li>
                                                    • Sebutkan elemen yang harus
                                                    dipertahankan dari referensi
                                                </li>
                                                <li>
                                                    • Gunakan placeholder untuk
                                                    teks yang akan diganti
                                                </li>
                                                <li>
                                                    • Jelaskan layout dan
                                                    proporsi yang diinginkan
                                                </li>
                                                <li>
                                                    • Sebutkan format output
                                                    (contoh: "4:5 ratio for
                                                    social media")
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar - Sticky */}
                                <div className="sticky top-6 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                                    {/* Reference Image Card */}
                                    <div className="bg-muted/50 p-4 rounded-md retro-border">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <span>🖼️</span>
                                            Reference Image
                                        </h3>
                                        {imagePreview ? (
                                            <div className="space-y-3">
                                                <div className="flex justify-center">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Reference"
                                                        className="max-w-full max-h-[200px] object-contain rounded-md retro-border bg-white"
                                                        style={{
                                                            aspectRatio: "auto",
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {templateName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Template referensi untuk
                                                        konfigurasi elemen
                                                    </p>
                                                </div>

                                                {imageDetails && (
                                                    <div className="grid grid-cols-1 gap-2 text-xs">
                                                        <div className="p-2 bg-background rounded border">
                                                            <div className="text-muted-foreground">
                                                                Dimensi
                                                            </div>
                                                            <div className="font-medium">
                                                                {
                                                                    imageDetails.width
                                                                }{" "}
                                                                ×{" "}
                                                                {
                                                                    imageDetails.height
                                                                }
                                                                px
                                                            </div>
                                                        </div>
                                                        <div className="p-2 bg-background rounded border">
                                                            <div className="text-muted-foreground">
                                                                Rasio & Format
                                                            </div>
                                                            <div className="font-medium">
                                                                {
                                                                    imageDetails.ratio
                                                                }{" "}
                                                                •{" "}
                                                                {imageDetails.width >
                                                                imageDetails.height
                                                                    ? "Landscape"
                                                                    : imageDetails.width ===
                                                                      imageDetails.height
                                                                    ? "Square"
                                                                    : "Portrait"}
                                                            </div>
                                                        </div>
                                                        <div className="p-2 bg-background rounded border">
                                                            <div className="text-muted-foreground">
                                                                Ukuran File
                                                            </div>
                                                            <div className="font-medium">
                                                                {
                                                                    imageDetails.size
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-muted-foreground">
                                                <div className="text-2xl mb-2">
                                                    📷
                                                </div>
                                                <p className="text-sm">
                                                    Belum ada gambar referensi
                                                </p>
                                                <p className="text-xs mt-1">
                                                    Upload gambar di step 1
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-md retro-border">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <span>🏷️</span>
                                            Available Placeholders
                                        </h3>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            Gunakan placeholder ini di dalam
                                            prompt Anda. Mereka akan diganti
                                            saat membuat design.
                                        </p>
                                        <div className="space-y-2">
                                            {/* Show placeholders for replaceable elements */}
                                            {elements
                                                .filter((el) => el.replaceable)
                                                .map((el) => (
                                                    <div
                                                        key={el.id}
                                                        className="p-2 bg-background rounded border"
                                                    >
                                                        <code className="text-sm text-green-600">
                                                            &#123;&#123;
                                                            {el.label}
                                                            &#125;&#125;
                                                        </code>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {el.type ===
                                                                "text" &&
                                                                "Elemen teks"}
                                                            {el.type ===
                                                                "image" &&
                                                                "Elemen gambar"}
                                                            {el.type ===
                                                                "color" &&
                                                                "Elemen warna"}
                                                            {el.type ===
                                                                "shape" &&
                                                                "Elemen bentuk"}
                                                            {el.type ===
                                                                "icon" &&
                                                                "Elemen ikon"}
                                                            {el.description &&
                                                                ` - ${el.description.substring(
                                                                    0,
                                                                    50
                                                                )}${
                                                                    el
                                                                        .description
                                                                        .length >
                                                                    50
                                                                        ? "..."
                                                                        : ""
                                                                }`}
                                                        </p>
                                                    </div>
                                                ))}

                                            {/* Show default placeholders if no replaceable elements */}
                                            {elements.filter(
                                                (el) => el.replaceable
                                            ).length === 0 && (
                                                <>
                                                    <div className="p-2 bg-background rounded border">
                                                        <code className="text-sm text-green-600">
                                                            &#123;&#123;title&#125;&#125;
                                                        </code>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Judul utama design
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-background rounded border">
                                                        <code className="text-sm text-green-600">
                                                            &#123;&#123;subtitle&#125;&#125;
                                                        </code>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Subjudul atau
                                                            tagline
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-background rounded border">
                                                        <code className="text-sm text-green-600">
                                                            &#123;&#123;topic&#125;&#125;
                                                        </code>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Topik atau tema
                                                            utama
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Element Summary */}
                                    <div className="bg-muted/50 p-4 rounded-md retro-border">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <span>📊</span>
                                            Element Summary
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            {(() => {
                                                const typeLabels = {
                                                    text: "Teks",
                                                    image: "Gambar",
                                                    color: "Warna",
                                                    shape: "Bentuk",
                                                    icon: "Ikon",
                                                };

                                                const elementCounts =
                                                    elements.reduce(
                                                        (acc, el) => {
                                                            acc[el.type] =
                                                                (acc[el.type] ||
                                                                    0) + 1;
                                                            return acc;
                                                        },
                                                        {} as Record<
                                                            string,
                                                            number
                                                        >
                                                    );

                                                return Object.entries(
                                                    typeLabels
                                                ).map(([type, label]) => (
                                                    <div
                                                        key={type}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <span>{label}</span>
                                                        <span className="text-muted-foreground">
                                                            {elementCounts[
                                                                type
                                                            ] || 0}
                                                        </span>
                                                    </div>
                                                ));
                                            })()}
                                            <div className="pt-2 border-t border-border">
                                                <div className="flex justify-between items-center font-medium">
                                                    <span>Total Elements</span>
                                                    <span>
                                                        {elements.length}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                    <span>Replaceable</span>
                                                    <span>
                                                        {
                                                            elements.filter(
                                                                (el) =>
                                                                    el.replaceable
                                                            ).length
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-6">
                                Step 4: Canvas Editor
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Sesuaikan layout dan elemen design dengan canvas
                                editor. Canvas akan otomatis menggunakan dimensi
                                dan gambar referensi dari step sebelumnya
                                sebagai panduan.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">
                                    💡 Canvas Controls:
                                </h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-blue-900 mb-1">
                                            Mouse:
                                        </p>
                                        <ul className="text-xs text-blue-800 space-y-1">
                                            <li>
                                                • <strong>Drag:</strong> Klik
                                                dan drag untuk pindah posisi
                                            </li>
                                            <li>
                                                • <strong>Resize:</strong> Hover
                                                untuk resize handles
                                            </li>
                                            <li>
                                                • <strong>Select:</strong> Klik
                                                untuk pilih elemen
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-blue-900 mb-1">
                                            Keyboard:
                                        </p>
                                        <ul className="text-xs text-blue-800 space-y-1">
                                            <li>
                                                • <strong>Arrow Keys:</strong>{" "}
                                                Geser 1px (Shift+10px)
                                            </li>
                                            <li>
                                                •{" "}
                                                <strong>
                                                    Delete/Backspace:
                                                </strong>{" "}
                                                Hapus elemen
                                            </li>
                                            <li>
                                                • <strong>Ctrl+D:</strong>{" "}
                                                Duplicate elemen
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-blue-900 mb-1">
                                            Layer Management:
                                        </p>
                                        <ul className="text-xs text-blue-800 space-y-1">
                                            <li>
                                                • <strong>Up/Down:</strong>{" "}
                                                Chevron buttons untuk reorder
                                            </li>
                                            <li>
                                                • <strong>Delete:</strong> Trash
                                                button (min. 1 layer)
                                            </li>
                                            <li>
                                                • <strong>Visibility:</strong>{" "}
                                                Eye button toggle
                                            </li>
                                            <li>
                                                • <strong>Lock:</strong> Lock
                                                button untuk proteksi
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-4 gap-6">
                                {/* Canvas Area - 3 columns */}
                                <div className="lg:col-span-3">
                                    <div className="bg-muted/30 p-6 rounded-lg retro-border">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium text-lg flex items-center gap-2">
                                                🎨 Canvas Preview
                                                {imageDetails && (
                                                    <span className="text-sm font-normal text-muted-foreground">
                                                        (from{" "}
                                                        {imageDetails.width}×
                                                        {imageDetails.height}px
                                                        image)
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>
                                                    {canvasConfig.width} ×{" "}
                                                    {canvasConfig.height}px
                                                    {imageDetails && (
                                                        <span className="ml-1 text-xs">
                                                            •{" "}
                                                            {imageDetails.ratio}
                                                        </span>
                                                    )}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={initializeCanvas}
                                                    className="h-7 px-2 text-xs"
                                                >
                                                    Reset Canvas
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Canvas Container */}
                                        <div className="flex justify-center">
                                            <div
                                                className="canvas-container relative border-2 border-border rounded-md overflow-hidden shadow-lg select-none focus:outline-none focus:ring-2 focus:ring-primary"
                                                style={{
                                                    width: Math.min(
                                                        600,
                                                        canvasConfig.width
                                                    ),
                                                    height: Math.min(
                                                        750,
                                                        (canvasConfig.height /
                                                            canvasConfig.width) *
                                                            Math.min(
                                                                600,
                                                                canvasConfig.width
                                                            )
                                                    ),
                                                    backgroundColor:
                                                        canvasConfig.backgroundColor,
                                                }}
                                                tabIndex={0}
                                                onKeyDown={handleKeyDown}
                                                onMouseMove={handleMouseMove}
                                                onMouseUp={handleMouseUp}
                                                onMouseLeave={handleMouseUp}
                                            >
                                                {/* Render layers */}
                                                {canvasConfig.layers
                                                    .filter(
                                                        (layer) => layer.visible
                                                    )
                                                    .sort(
                                                        (a, b) =>
                                                            a.zIndex - b.zIndex
                                                    )
                                                    .map((layer) => (
                                                        <div
                                                            key={layer.id}
                                                            className={`absolute group transition-all duration-200 ${
                                                                layer.locked
                                                                    ? "cursor-not-allowed"
                                                                    : isDragging &&
                                                                      selectedLayerId ===
                                                                          layer.id
                                                                    ? "cursor-grabbing"
                                                                    : "cursor-grab"
                                                            } ${
                                                                selectedLayerId ===
                                                                layer.id
                                                                    ? "ring-2 ring-primary ring-offset-1"
                                                                    : "hover:ring-1 hover:ring-muted-foreground/50"
                                                            }`}
                                                            style={{
                                                                left: `${
                                                                    (layer.x /
                                                                        canvasConfig.width) *
                                                                    100
                                                                }%`,
                                                                top: `${
                                                                    (layer.y /
                                                                        canvasConfig.height) *
                                                                    100
                                                                }%`,
                                                                width: `${
                                                                    (layer.width /
                                                                        canvasConfig.width) *
                                                                    100
                                                                }%`,
                                                                height: `${
                                                                    (layer.height /
                                                                        canvasConfig.height) *
                                                                    100
                                                                }%`,
                                                                opacity:
                                                                    layer.opacity /
                                                                    100,
                                                                transform: `rotate(${layer.rotation}deg)`,
                                                                zIndex: layer.zIndex,
                                                                backgroundColor:
                                                                    layer.backgroundColor,
                                                                borderRadius:
                                                                    layer.borderRadius
                                                                        ? `${layer.borderRadius}px`
                                                                        : undefined,
                                                            }}
                                                            onMouseDown={(e) =>
                                                                handleMouseDown(
                                                                    e,
                                                                    layer.id,
                                                                    "drag"
                                                                )
                                                            }
                                                            onClick={() =>
                                                                setSelectedLayerId(
                                                                    layer.id
                                                                )
                                                            }
                                                        >
                                                            {layer.type ===
                                                                "text" && (
                                                                <div
                                                                    className="w-full h-full flex items-center justify-center p-2"
                                                                    style={{
                                                                        fontSize: `${Math.max(
                                                                            8,
                                                                            (layer.fontSize ||
                                                                                24) *
                                                                                0.3
                                                                        )}px`,
                                                                        fontFamily:
                                                                            layer.fontFamily,
                                                                        fontWeight:
                                                                            layer.fontWeight,
                                                                        textAlign:
                                                                            layer.textAlign,
                                                                        color: layer.color,
                                                                        padding:
                                                                            layer.padding
                                                                                ? `${layer.padding}px`
                                                                                : undefined,
                                                                    }}
                                                                >
                                                                    {layer.text ||
                                                                        "Text"}
                                                                </div>
                                                            )}
                                                            {layer.type ===
                                                                "background" &&
                                                                layer.imageUrl && (
                                                                    <img
                                                                        src={
                                                                            layer.imageUrl
                                                                        }
                                                                        alt={
                                                                            layer.name
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            {layer.type ===
                                                                "foreground" && (
                                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex items-center justify-center">
                                                                    <span className="text-xs font-medium opacity-70">
                                                                        {
                                                                            layer.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Resize Handles - Only show for selected layer */}
                                                            {selectedLayerId ===
                                                                layer.id &&
                                                                !layer.locked && (
                                                                    <>
                                                                        {/* Corner handles */}
                                                                        <div
                                                                            className="absolute -top-1 -left-1 w-3 h-3 bg-primary border border-white rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100"
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleMouseDown(
                                                                                    e,
                                                                                    layer.id,
                                                                                    "resize",
                                                                                    "nw"
                                                                                )
                                                                            }
                                                                        />
                                                                        <div
                                                                            className="absolute -top-1 -right-1 w-3 h-3 bg-primary border border-white rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100"
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleMouseDown(
                                                                                    e,
                                                                                    layer.id,
                                                                                    "resize",
                                                                                    "ne"
                                                                                )
                                                                            }
                                                                        />
                                                                        <div
                                                                            className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary border border-white rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100"
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleMouseDown(
                                                                                    e,
                                                                                    layer.id,
                                                                                    "resize",
                                                                                    "sw"
                                                                                )
                                                                            }
                                                                        />
                                                                        <div
                                                                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary border border-white rounded-full cursor-se-resize opacity-0 group-hover:opacity-100"
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleMouseDown(
                                                                                    e,
                                                                                    layer.id,
                                                                                    "resize",
                                                                                    "se"
                                                                                )
                                                                            }
                                                                        />

                                                                        {/* Edge handles */}
                                                                        <div
                                                                            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary border border-white rounded-full cursor-n-resize opacity-0 group-hover:opacity-100"
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleMouseDown(
                                                                                    e,
                                                                                    layer.id,
                                                                                    "resize",
                                                                                    "n"
                                                                                )
                                                                            }
                                                                        />
                                                                        <div
                                                                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary border border-white rounded-full cursor-s-resize opacity-0 group-hover:opacity-100"
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleMouseDown(
                                                                                    e,
                                                                                    layer.id,
                                                                                    "resize",
                                                                                    "s"
                                                                                )
                                                                            }
                                                                        />
                                                                        <div
                                                                            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary border border-white rounded-full cursor-w-resize opacity-0 group-hover:opacity-100"
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleMouseDown(
                                                                                    e,
                                                                                    layer.id,
                                                                                    "resize",
                                                                                    "w"
                                                                                )
                                                                            }
                                                                        />
                                                                        <div
                                                                            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary border border-white rounded-full cursor-e-resize opacity-0 group-hover:opacity-100"
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleMouseDown(
                                                                                    e,
                                                                                    layer.id,
                                                                                    "resize",
                                                                                    "e"
                                                                                )
                                                                            }
                                                                        />

                                                                        {/* Move handle (center) */}
                                                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                                                                            <Move className="w-4 h-4 text-primary bg-white rounded-full p-0.5 border border-primary" />
                                                                        </div>
                                                                    </>
                                                                )}
                                                        </div>
                                                    ))}

                                                {/* Empty Canvas State */}
                                                {canvasConfig.layers.length ===
                                                    0 && (
                                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                        <div className="text-center">
                                                            <div className="text-4xl mb-2">
                                                                🎨
                                                            </div>
                                                            <p className="text-sm">
                                                                Canvas kosong
                                                            </p>
                                                            <p className="text-xs mt-1">
                                                                Klik "Initialize
                                                                Canvas" untuk
                                                                memulai
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Canvas Controls */}
                                        <div className="mt-4 flex flex-wrap gap-2 items-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    addCanvasLayer("text")
                                                }
                                                className="h-8 px-3 text-xs"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Add Text
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    addCanvasLayer("foreground")
                                                }
                                                className="h-8 px-3 text-xs"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Add Element
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    addCanvasLayer("background")
                                                }
                                                className="h-8 px-3 text-xs"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Add Background
                                            </Button>

                                            {/* Status indicator */}
                                            {(isDragging || isResizing) && (
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4">
                                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                                    {isDragging &&
                                                        "Dragging..."}
                                                    {isResizing &&
                                                        `Resizing (${resizeHandle})...`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar - Layer Panel - 1 column */}
                                <div className="space-y-4">
                                    {/* Layer List */}
                                    <div className="bg-muted/50 p-4 rounded-md retro-border">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <span>📚</span>
                                            Layers ({canvasConfig.layers.length}
                                            )
                                        </h3>

                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {canvasConfig.layers
                                                .sort(
                                                    (a, b) =>
                                                        b.zIndex - a.zIndex
                                                )
                                                .map((layer, index) => (
                                                    <div
                                                        key={layer.id}
                                                        className={`p-3 rounded border cursor-pointer transition-colors ${
                                                            selectedLayerId ===
                                                            layer.id
                                                                ? "bg-primary/10 border-primary"
                                                                : "bg-background hover:bg-muted/50"
                                                        }`}
                                                        onClick={() =>
                                                            setSelectedLayerId(
                                                                layer.id
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium truncate flex-1">
                                                                {layer.name}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                {/* Layer ordering buttons */}
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        moveLayerUp(
                                                                            layer.id
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        layer.zIndex ===
                                                                        Math.max(
                                                                            ...canvasConfig.layers.map(
                                                                                (
                                                                                    l
                                                                                ) =>
                                                                                    l.zIndex
                                                                            )
                                                                        )
                                                                    }
                                                                    className="h-6 w-6 p-0"
                                                                    title="Move layer up (front)"
                                                                >
                                                                    <ChevronUp className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        moveLayerDown(
                                                                            layer.id
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        layer.zIndex ===
                                                                        Math.min(
                                                                            ...canvasConfig.layers.map(
                                                                                (
                                                                                    l
                                                                                ) =>
                                                                                    l.zIndex
                                                                            )
                                                                        )
                                                                    }
                                                                    className="h-6 w-6 p-0"
                                                                    title="Move layer down (back)"
                                                                >
                                                                    <ChevronDown className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        updateLayer(
                                                                            layer.id,
                                                                            {
                                                                                visible:
                                                                                    !layer.visible,
                                                                            }
                                                                        );
                                                                    }}
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    {layer.visible ? (
                                                                        <Eye className="w-3 h-3" />
                                                                    ) : (
                                                                        <EyeOff className="w-3 h-3" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        updateLayer(
                                                                            layer.id,
                                                                            {
                                                                                locked: !layer.locked,
                                                                            }
                                                                        );
                                                                    }}
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    {layer.locked ? (
                                                                        <Lock className="w-3 h-3" />
                                                                    ) : (
                                                                        <Unlock className="w-3 h-3" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        if (
                                                                            canvasConfig
                                                                                .layers
                                                                                .length >
                                                                            1
                                                                        ) {
                                                                            if (
                                                                                window.confirm(
                                                                                    `Are you sure you want to delete "${layer.name}"?`
                                                                                )
                                                                            ) {
                                                                                deleteLayer(
                                                                                    layer.id
                                                                                );
                                                                            }
                                                                        } else {
                                                                            toast.error(
                                                                                "Cannot delete the last remaining layer"
                                                                            );
                                                                        }
                                                                    }}
                                                                    disabled={
                                                                        canvasConfig
                                                                            .layers
                                                                            .length <=
                                                                        1
                                                                    }
                                                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:text-gray-400"
                                                                    title={
                                                                        canvasConfig
                                                                            .layers
                                                                            .length <=
                                                                        1
                                                                            ? "Cannot delete last layer"
                                                                            : "Delete layer"
                                                                    }
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                                                                {layer.type}
                                                            </span>
                                                            <span>
                                                                {layer.opacity}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}

                                            {canvasConfig.layers.length ===
                                                0 && (
                                                <div className="text-center py-6 text-muted-foreground">
                                                    <p className="text-sm">
                                                        Belum ada layer
                                                    </p>
                                                    <p className="text-xs mt-1">
                                                        Klik tombol "Add" di
                                                        bawah canvas
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Layer Properties */}
                                    {selectedLayerId &&
                                        (() => {
                                            const selectedLayer =
                                                canvasConfig.layers.find(
                                                    (l) =>
                                                        l.id === selectedLayerId
                                                );
                                            if (!selectedLayer) return null;

                                            return (
                                                <div className="bg-muted/50 p-4 rounded-md retro-border">
                                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                        <span>⚙️</span>
                                                        Layer Properties
                                                    </h3>

                                                    <div className="space-y-3">
                                                        {/* Layer Name */}
                                                        <div>
                                                            <Label className="text-xs">
                                                                Name
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    selectedLayer.name
                                                                }
                                                                onChange={(e) =>
                                                                    updateLayer(
                                                                        selectedLayerId,
                                                                        {
                                                                            name: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                className="h-7 text-xs"
                                                            />
                                                        </div>

                                                        {/* Position & Size */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <Label className="text-xs">
                                                                    X
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        selectedLayer.x
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateLayer(
                                                                            selectedLayerId,
                                                                            {
                                                                                x:
                                                                                    parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ) ||
                                                                                    0,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="h-7 text-xs"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">
                                                                    Y
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        selectedLayer.y
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateLayer(
                                                                            selectedLayerId,
                                                                            {
                                                                                y:
                                                                                    parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ) ||
                                                                                    0,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="h-7 text-xs"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">
                                                                    Width
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        selectedLayer.width
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateLayer(
                                                                            selectedLayerId,
                                                                            {
                                                                                width:
                                                                                    parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ) ||
                                                                                    0,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="h-7 text-xs"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">
                                                                    Height
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        selectedLayer.height
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateLayer(
                                                                            selectedLayerId,
                                                                            {
                                                                                height:
                                                                                    parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ) ||
                                                                                    0,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="h-7 text-xs"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Opacity */}
                                                        <div>
                                                            <Label className="text-xs">
                                                                Opacity (%)
                                                            </Label>
                                                            <Input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={
                                                                    selectedLayer.opacity
                                                                }
                                                                onChange={(e) =>
                                                                    updateLayer(
                                                                        selectedLayerId,
                                                                        {
                                                                            opacity:
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                ),
                                                                        }
                                                                    )
                                                                }
                                                                className="h-7"
                                                            />
                                                            <div className="text-xs text-center mt-1">
                                                                {
                                                                    selectedLayer.opacity
                                                                }
                                                                %
                                                            </div>
                                                        </div>

                                                        {/* Text Properties */}
                                                        {selectedLayer.type ===
                                                            "text" && (
                                                            <div className="space-y-3 pt-3 border-t">
                                                                <div>
                                                                    <Label className="text-xs">
                                                                        Text
                                                                        Content
                                                                    </Label>
                                                                    <Textarea
                                                                        value={
                                                                            selectedLayer.text ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateLayer(
                                                                                selectedLayerId,
                                                                                {
                                                                                    text: e
                                                                                        .target
                                                                                        .value,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="text-xs min-h-[60px]"
                                                                        placeholder="Enter text content..."
                                                                    />
                                                                </div>

                                                                {/* Font Family */}
                                                                <div>
                                                                    <Label className="text-xs">
                                                                        Font
                                                                        Family
                                                                    </Label>
                                                                    <Select
                                                                        value={
                                                                            selectedLayer.fontFamily ||
                                                                            "Inter, system-ui, -apple-system, sans-serif"
                                                                        }
                                                                        onValueChange={(
                                                                            value
                                                                        ) =>
                                                                            updateLayer(
                                                                                selectedLayerId,
                                                                                {
                                                                                    fontFamily:
                                                                                        value,
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="h-7 text-xs">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {fontFamilies.map(
                                                                                (
                                                                                    font
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            font.value
                                                                                        }
                                                                                        value={
                                                                                            font.value
                                                                                        }
                                                                                    >
                                                                                        <span
                                                                                            style={{
                                                                                                fontFamily:
                                                                                                    font.value,
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                font.label
                                                                                            }
                                                                                        </span>
                                                                                    </SelectItem>
                                                                                )
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <Label className="text-xs">
                                                                            Font
                                                                            Size
                                                                        </Label>
                                                                        <Input
                                                                            type="number"
                                                                            value={
                                                                                selectedLayer.fontSize ||
                                                                                24
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLayer(
                                                                                    selectedLayerId,
                                                                                    {
                                                                                        fontSize:
                                                                                            parseInt(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            ) ||
                                                                                            24,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="h-7 text-xs"
                                                                            min="8"
                                                                            max="200"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs">
                                                                            Color
                                                                        </Label>
                                                                        <Input
                                                                            type="color"
                                                                            value={
                                                                                selectedLayer.color ||
                                                                                "#000000"
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLayer(
                                                                                    selectedLayerId,
                                                                                    {
                                                                                        color: e
                                                                                            .target
                                                                                            .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className="h-7 text-xs"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Font Weight and Text Align */}
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <Label className="text-xs">
                                                                            Font
                                                                            Weight
                                                                        </Label>
                                                                        <Select
                                                                            value={
                                                                                selectedLayer.fontWeight ||
                                                                                "normal"
                                                                            }
                                                                            onValueChange={(
                                                                                value
                                                                            ) =>
                                                                                updateLayer(
                                                                                    selectedLayerId,
                                                                                    {
                                                                                        fontWeight:
                                                                                            value as
                                                                                                | "normal"
                                                                                                | "bold"
                                                                                                | "light",
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            <SelectTrigger className="h-7 text-xs">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="light">
                                                                                    Light
                                                                                </SelectItem>
                                                                                <SelectItem value="normal">
                                                                                    Normal
                                                                                </SelectItem>
                                                                                <SelectItem value="bold">
                                                                                    Bold
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs">
                                                                            Text
                                                                            Align
                                                                        </Label>
                                                                        <Select
                                                                            value={
                                                                                selectedLayer.textAlign ||
                                                                                "center"
                                                                            }
                                                                            onValueChange={(
                                                                                value
                                                                            ) =>
                                                                                updateLayer(
                                                                                    selectedLayerId,
                                                                                    {
                                                                                        textAlign:
                                                                                            value as
                                                                                                | "left"
                                                                                                | "center"
                                                                                                | "right",
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            <SelectTrigger className="h-7 text-xs">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="left">
                                                                                    Left
                                                                                </SelectItem>
                                                                                <SelectItem value="center">
                                                                                    Center
                                                                                </SelectItem>
                                                                                <SelectItem value="right">
                                                                                    Right
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* AI Prompt for Layer */}
                                                        <div className="pt-3 border-t">
                                                            <Label className="text-xs font-medium">
                                                                🤖 AI
                                                                Instructions for
                                                                this Layer
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground mb-2">
                                                                Instruksi khusus
                                                                untuk AI dalam
                                                                menggenerate
                                                                element ini
                                                            </p>
                                                            <Textarea
                                                                value={
                                                                    selectedLayer.aiPrompt ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateLayer(
                                                                        selectedLayerId,
                                                                        {
                                                                            aiPrompt:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                                placeholder={(() => {
                                                                    const placeholders =
                                                                        {
                                                                            text: "Contoh: Keep text under 100 characters. Use compelling and attention-grabbing words. Maintain brand tone.",
                                                                            background:
                                                                                "Contoh: Ensure background complements foreground elements. Use subtle patterns or gradients.",
                                                                            foreground:
                                                                                "Contoh: Make this element stand out but not overpower text. Use complementary colors.",
                                                                        };
                                                                    return (
                                                                        placeholders[
                                                                            selectedLayer.type as keyof typeof placeholders
                                                                        ] ||
                                                                        "Instruksi khusus untuk AI..."
                                                                    );
                                                                })()}
                                                                className="text-xs min-h-[80px]"
                                                            />
                                                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                                                <p className="font-medium text-blue-900 mb-1">
                                                                    💡 Contoh AI
                                                                    Instructions:
                                                                </p>
                                                                <ul className="text-blue-800 space-y-1">
                                                                    {selectedLayer.type ===
                                                                        "text" && (
                                                                        <>
                                                                            <li>
                                                                                •
                                                                                "Limit
                                                                                to
                                                                                50
                                                                                characters
                                                                                max"
                                                                            </li>
                                                                            <li>
                                                                                •
                                                                                "Use
                                                                                action
                                                                                words
                                                                                and
                                                                                urgency"
                                                                            </li>
                                                                            <li>
                                                                                •
                                                                                "Avoid
                                                                                technical
                                                                                jargon"
                                                                            </li>
                                                                        </>
                                                                    )}
                                                                    {selectedLayer.type ===
                                                                        "background" && (
                                                                        <>
                                                                            <li>
                                                                                •
                                                                                "Use
                                                                                gradient
                                                                                from
                                                                                top
                                                                                to
                                                                                bottom"
                                                                            </li>
                                                                            <li>
                                                                                •
                                                                                "Ensure
                                                                                high
                                                                                contrast
                                                                                with
                                                                                text"
                                                                            </li>
                                                                            <li>
                                                                                •
                                                                                "Keep
                                                                                pattern
                                                                                subtle"
                                                                            </li>
                                                                        </>
                                                                    )}
                                                                    {selectedLayer.type ===
                                                                        "foreground" && (
                                                                        <>
                                                                            <li>
                                                                                •
                                                                                "Make
                                                                                element
                                                                                eye-catching"
                                                                            </li>
                                                                            <li>
                                                                                •
                                                                                "Use
                                                                                brand
                                                                                colors"
                                                                            </li>
                                                                            <li>
                                                                                •
                                                                                "Ensure
                                                                                visual
                                                                                hierarchy"
                                                                            </li>
                                                                        </>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2 pt-3 border-t">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    duplicateLayer(
                                                                        selectedLayerId
                                                                    )
                                                                }
                                                                className="h-7 px-2 text-xs flex-1"
                                                            >
                                                                <Copy className="w-3 h-3 mr-1" />
                                                                Copy
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    deleteLayer(
                                                                        selectedLayerId
                                                                    )
                                                                }
                                                                className="h-7 px-2 text-xs text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                    {/* Prompt Adjustments */}
                                    <div className="bg-muted/50 p-4 rounded-md retro-border">
                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                            <span>✏️</span>
                                            Prompt Adjustments
                                        </h3>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            Tambahkan instruksi khusus
                                            berdasarkan canvas layout
                                        </p>
                                        <Textarea
                                            value={
                                                canvasConfig.promptAdjustments
                                            }
                                            onChange={(e) =>
                                                setCanvasConfig((prev) => ({
                                                    ...prev,
                                                    promptAdjustments:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Contoh: Ensure text is readable with high contrast. Position elements according to canvas layout. Maintain visual hierarchy..."
                                            className="text-xs min-h-[80px]"
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
                    <Button onClick={nextStep} className="retro-button">
                        Lanjut ke Canvas
                    </Button>
                )}
                {currentStep === 4 && (
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
