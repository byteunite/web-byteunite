export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
};

export type TemplateElement = {
    id: string;
    label: string;
    type: "text" | "image" | "color" | "shape" | "icon";
    description?: string;
    replaceable: boolean;
};

export type Template = {
    id: string;
    name: string;
    referenceImageUrl?: string;
    elements: TemplateElement[];
    promptTemplate: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    canvasConfig?: CanvasConfiguration;
};

export type CanvasLayer = {
    id: string;
    name: string;
    type: "background" | "foreground" | "text";
    visible: boolean;
    locked: boolean;
    opacity: number;
    zIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    // For image layers
    imageUrl?: string;
    // For text layers
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: "normal" | "bold" | "light";
    textAlign?: "left" | "center" | "right";
    color?: string;
    backgroundColor?: string;
    padding?: number;
    borderRadius?: number;
    // AI prompt for this specific layer
    aiPrompt?: string;
};

export type CanvasConfiguration = {
    width: number;
    height: number;
    backgroundColor: string;
    layers: CanvasLayer[];
    selectedLayerId?: string;
    promptAdjustments: string;
};

export type Design = {
    id: string;
    templateId: string;
    title: string;
    topic: string;
    generatedImageUrl?: string;
    promptFinal: string;
    caption: string;
    createdAt: string;
    ownerId: string;
    canvasConfig?: CanvasConfiguration;
};
