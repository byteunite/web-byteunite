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
};
