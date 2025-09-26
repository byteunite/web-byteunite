import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Template } from "@/lib/types";

interface TemplatesState {
    templates: Template[];
    addTemplate: (
        template: Omit<Template, "id" | "createdAt" | "updatedAt">
    ) => Template;
    getTemplate: (id: string) => Template | undefined;
    updateTemplate: (id: string, template: Partial<Template>) => void;
    deleteTemplate: (id: string) => void;
    _hydrated: boolean;
}

const seedTemplates: Template[] = [
    {
        id: "template-1",
        name: "Iklan Kopi Senja",
        referenceImageUrl: "https://picsum.photos/seed/template1/800/1000",
        elements: [
            {
                id: uuidv4(),
                label: "Judul Besar",
                type: "text",
                replaceable: true,
                description: "Teks judul utama",
            },
            {
                id: uuidv4(),
                label: "Subjudul",
                type: "text",
                replaceable: true,
                description: "Teks pendukung",
            },
            {
                id: uuidv4(),
                label: "Gambar Produk",
                type: "image",
                replaceable: true,
                description: "Foto utama produk",
            },
            {
                id: uuidv4(),
                label: "Bentuk Aksen",
                type: "shape",
                replaceable: false,
                description: "Elemen dekoratif",
            },
            {
                id: uuidv4(),
                label: "Warna Palet",
                type: "color",
                replaceable: true,
                description: "Warna dominan",
            },
        ],
        promptTemplate: `Create a new design in the style of the reference image.
Keep layout and visual rhythm consistent.
Replace:
- Title with: {{title}}
- Subtitle with: {{subtitle}}
- Topic/Subject: {{topic}}
Maintain color mood similar to reference; keep shapes & spacing.
Output must be a single image ready for social post (4:5).`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: "user-1",
    },
    {
        id: "template-2",
        name: "Promo Konser Musik Indie",
        referenceImageUrl: "https://picsum.photos/seed/template2/800/1000",
        elements: [
            {
                id: uuidv4(),
                label: "Nama Acara",
                type: "text",
                replaceable: true,
            },
            {
                id: uuidv4(),
                label: "Tanggal & Lokasi",
                type: "text",
                replaceable: true,
            },
            {
                id: uuidv4(),
                label: "Foto Artis",
                type: "image",
                replaceable: true,
            },
            {
                id: uuidv4(),
                label: "Pola Latar",
                type: "shape",
                replaceable: false,
            },
            {
                id: uuidv4(),
                label: "Ikon Sponsor",
                type: "icon",
                replaceable: true,
            },
        ],
        promptTemplate: `Generate a concert promo poster based on the reference.
Feature artist: {{artist_name}}.
Event details: {{event_details}}.
The overall mood should be energetic and youthful.
Use the topic {{topic}} to inspire the background visuals.
The final image should be a 9:16 vertical poster.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: "user-1",
    },
];

export const useTemplatesStore = create<TemplatesState>()(
    persist(
        (set, get) => ({
            templates: [],
            _hydrated: false,
            addTemplate: (templateData) => {
                const newTemplate: Template = {
                    ...templateData,
                    id: uuidv4(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({
                    templates: [...state.templates, newTemplate],
                }));
                return newTemplate;
            },
            getTemplate: (id) => {
                return get().templates.find((t) => t.id === id);
            },
            updateTemplate: (id, updatedData) => {
                set((state) => ({
                    templates: state.templates.map((t) =>
                        t.id === id
                            ? {
                                  ...t,
                                  ...updatedData,
                                  updatedAt: new Date().toISOString(),
                              }
                            : t
                    ),
                }));
            },
            deleteTemplate: (id) => {
                set((state) => ({
                    templates: state.templates.filter((t) => t.id !== id),
                }));
            },
        }),
        {
            name: "templates-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state._hydrated = true;
                    if (state.templates.length === 0) {
                        console.log("Seeding initial templates...");
                        state.templates = seedTemplates;
                    }
                }
            },
        }
    )
);
