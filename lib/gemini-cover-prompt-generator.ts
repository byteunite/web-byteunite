import { GoogleGenAI } from "@google/genai";

// Inisialisasi Gemini AI client (gunakan env var GEMINI_API_KEY)
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export interface CoverUserPrompt {
    scene_description: string;
    overlay_text?: string;
}

export interface CoverPromptStyle {
    overall_vibe?: string;
    subject_style?: Record<string, string>;
    background_style?: Record<string, string>;
    text_style?: Record<string, string>;
    illustrative_elements?: Record<string, string>;
    color_palette?: Record<string, string>;
    composition?: Record<string, string>;
}

export interface CoverPromptData {
    user_prompt: CoverUserPrompt;
    settings?: {
        aspect_ratio?: string;
    };
    style?: CoverPromptStyle;
}

/**
 * Generate cover prompt JSON untuk cover slide post
 * Menggunakan Gemini AI (server-side)
 * @param caption - caption atau konteks konten
 * @param slides - array slide (tipe minimal diperlukan untuk konteks)
 * @param category - kategori konten
 */
export async function generateCoverPrompt(
    caption: string,
    slides: {
        tipe_slide: string;
        judul_slide: string;
        sub_judul_slide: string;
        konten_slide: string;
    }[],
    category: string = "riddles"
): Promise<CoverPromptData> {
    const slidesSummary = slides
        .map((s, i) => `Slide ${i + 1}: ${s.judul_slide} - ${s.konten_slide}`)
        .join("\n");

    const systemInstruction = `You are an expert AI prompt engineer. Produce a single, valid JSON object and NOTHING ELSE. The JSON MUST follow this exact schema (keys and nested keys present):

{
    "user_prompt": {
        "scene_description": "string",
        "overlay_text": "string"
    },
    "settings": {
        "aspect_ratio": "string"
    },
    "style": {
        "overall_vibe": "string",
        "subject_style": {
            "outline": "string",
            "pose_vibe": "string"
        },
        "background_style": {
            "type": "string",
            "lighting": "string"
        },
        "text_style": {
            "placement": "string",
            "font_vibe": "string",
            "extra_elements": "string"
        },
        "illustrative_elements": {
            "doodles": "string",
            "integration": "string"
        },
        "color_palette": {
            "tones": "string",
            "contrast": "string"
        },
        "composition": {
            "framing": "string",
            "depth": "string"
        }
    }
}

Use short, specific, AI-friendly phrases as values. Do NOT include any additional keys. Always return valid JSON even if you have to supply sensible defaults (empty strings).`;

    const userMessage = `Create a concise cover image prompt JSON for a social media cover slide that follows the required schema exactly.
Category: ${category}
Caption: ${caption}
Slides summary:
${slidesSummary}

Guidelines:
- scene_description: describe the visual scene (subject, action, setting, lighting, camera angle) in 8-20 words.
- overlay_text: short headline/overlay text (max 6-8 words) or empty string.
- settings.aspect_ratio: use "4:5" for portrait social posts.
- style.*: use short descriptive phrases (few words) for each field.

Return ONLY the JSON object with the exact schema.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userMessage,
            config: {
                responseMimeType: "application/json",
                systemInstruction,
            },
        });

        const raw = response.text?.trim() || "";
        const cleaned = raw.replace(/^```json\n/, "").replace(/\n```$/, "");
        const parsedRaw = JSON.parse(cleaned) as any;

        // Normalize and ensure required structure
        const normalize = (input: any): CoverPromptData => {
            const p = input || {};

            const user_prompt = {
                scene_description:
                    (p.user_prompt && p.user_prompt.scene_description) || "",
                overlay_text:
                    (p.user_prompt && p.user_prompt.overlay_text) || "",
            };

            const settings = {
                aspect_ratio: (p.settings && p.settings.aspect_ratio) || "4:5",
            };

            const style = {
                overall_vibe: (p.style && p.style.overall_vibe) || "",
                subject_style: {
                    outline:
                        (p.style &&
                            p.style.subject_style &&
                            p.style.subject_style.outline) ||
                        "",
                    pose_vibe:
                        (p.style &&
                            p.style.subject_style &&
                            p.style.subject_style.pose_vibe) ||
                        "",
                },
                background_style: {
                    type:
                        (p.style &&
                            p.style.background_style &&
                            p.style.background_style.type) ||
                        "",
                    lighting:
                        (p.style &&
                            p.style.background_style &&
                            p.style.background_style.lighting) ||
                        "",
                },
                text_style: {
                    placement:
                        (p.style &&
                            p.style.text_style &&
                            p.style.text_style.placement) ||
                        "",
                    font_vibe:
                        (p.style &&
                            p.style.text_style &&
                            p.style.text_style.font_vibe) ||
                        "",
                    extra_elements:
                        (p.style &&
                            p.style.text_style &&
                            p.style.text_style.extra_elements) ||
                        "",
                },
                illustrative_elements: {
                    doodles:
                        (p.style &&
                            p.style.illustrative_elements &&
                            p.style.illustrative_elements.doodles) ||
                        "",
                    integration:
                        (p.style &&
                            p.style.illustrative_elements &&
                            p.style.illustrative_elements.integration) ||
                        "",
                },
                color_palette: {
                    tones:
                        (p.style &&
                            p.style.color_palette &&
                            p.style.color_palette.tones) ||
                        "",
                    contrast:
                        (p.style &&
                            p.style.color_palette &&
                            p.style.color_palette.contrast) ||
                        "",
                },
                composition: {
                    framing:
                        (p.style &&
                            p.style.composition &&
                            p.style.composition.framing) ||
                        "",
                    depth:
                        (p.style &&
                            p.style.composition &&
                            p.style.composition.depth) ||
                        "",
                },
            };

            return { user_prompt, settings, style };
        };

        const normalized = normalize(parsedRaw);

        // Basic sanity check
        if (!normalized.user_prompt.scene_description) {
            // If scene_description is empty, attempt to derive from caption/slides
            normalized.user_prompt.scene_description = caption
                ? caption.slice(0, 120)
                : (slides[0] && slides[0].judul_slide) || "";
        }

        return normalized;
    } catch (err) {
        console.error("Error generating cover prompt:", err);
        throw new Error(
            `Failed to generate cover prompt: ${
                err instanceof Error ? err.message : String(err)
            }`
        );
    }
}
