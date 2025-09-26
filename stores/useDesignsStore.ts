import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Design } from "@/lib/types";

interface DesignsState {
    designs: Design[];
    addDesign: (design: Omit<Design, "id" | "createdAt">) => Design;
    getDesign: (id: string) => Design | undefined;
    updateDesign: (id: string, design: Partial<Design>) => void;
    deleteDesign: (id: string) => void;
    _hydrated: boolean;
}

const seedDesigns: Design[] = [
    {
        id: "design-1",
        templateId: "template-1",
        title: "Kopi Pagi",
        topic: "Semangat pagi bersama secangkir kopi",
        generatedImageUrl: "https://picsum.photos/seed/design1/900/1125",
        promptFinal:
            'A promotional image for a coffee brand with the title "Kopi Pagi".',
        caption: "Awali harimu dengan semangat dari secangkir Kopi Senja! ☕️",
        createdAt: new Date().toISOString(),
        ownerId: "user-1",
    },
    {
        id: "design-2",
        templateId: "template-1",
        title: "Diskon Kilat",
        topic: "Promo spesial akhir pekan",
        generatedImageUrl: "https://picsum.photos/seed/design2/900/1125",
        promptFinal: "A promotional image for a special weekend discount.",
        caption: "Jangan lewatkan Diskon Kilat akhir pekan ini! ✨",
        createdAt: new Date().toISOString(),
        ownerId: "user-1",
    },
    {
        id: "design-3",
        templateId: "template-2",
        title: "Konser Indie Fest",
        topic: "Festival musik indie terbesar tahun ini",
        generatedImageUrl: "https://picsum.photos/seed/design3/900/1125",
        promptFinal:
            "A poster for the biggest indie music festival of the year.",
        caption: "Saksikan band favoritmu di Indie Fest 2025! 🎸",
        createdAt: new Date().toISOString(),
        ownerId: "user-1",
    },
];

export const useDesignsStore = create<DesignsState>()(
    persist(
        (set, get) => ({
            designs: [],
            _hydrated: false,
            addDesign: (designData) => {
                const newDesign: Design = {
                    ...designData,
                    id: uuidv4(),
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({ designs: [...state.designs, newDesign] }));
                return newDesign;
            },
            getDesign: (id) => {
                return get().designs.find((d) => d.id === id);
            },
            updateDesign: (id, updatedData) => {
                set((state) => ({
                    designs: state.designs.map((d) =>
                        d.id === id ? { ...d, ...updatedData } : d
                    ),
                }));
            },
            deleteDesign: (id) => {
                set((state) => ({
                    designs: state.designs.filter((d) => d.id !== id),
                }));
            },
        }),
        {
            name: "designs-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state._hydrated = true;
                    if (state.designs.length === 0) {
                        console.log("Seeding initial designs...");
                        state.designs = seedDesigns;
                    }
                }
            },
        }
    )
);
