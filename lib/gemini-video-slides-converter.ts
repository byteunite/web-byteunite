import { GoogleGenAI } from "@google/genai";

// Type definitions untuk Video Slides
export type VideoSlideType =
    | "VIDEO_COVER"
    | "VIDEO_POINT"
    | "VIDEO_QUESTION"
    | "VIDEO_ANSWER"
    | "VIDEO_LIST"
    | "VIDEO_QUOTE"
    | "VIDEO_TRANSITION"
    | "VIDEO_CLOSING";

export interface VideoSlide {
    tipe_slide: VideoSlideType;
    judul_slide: string;
    sub_judul_slide?: string;
    konten_slide?: string;
    list_items?: string[];
    background_color?: string;
    text_color?: string;
    prompt_untuk_image?: string;
    saved_image_url?: string;
}

// Type untuk Carousel Slide (from template/[id])
export interface Slide {
    tipe_slide: string;
    judul_slide: string;
    sub_judul_slide?: string;
    konten_slide?: string;
    list_items?: string[];
    [key: string]: any;
}

// Inisialisasi Gemini AI client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

/**
 * AI Prompt untuk mengkonversi carousel slides menjadi video slides
 *
 * Sistem ini menggunakan AI untuk:
 * 1. Menganalisis carousel slides yang ada
 * 2. Mengidentifikasi tipe konten (riddle, tutorial, facts, etc)
 * 3. Mengkonversi ke format video slides yang optimized
 * 4. Menyederhanakan text untuk video format
 */

interface ConversionResult {
    videoSlides: VideoSlide[];
    success: boolean;
    error?: string;
}

/**
 * Generate AI prompt untuk konversi slides
 */
function generateConversionPrompt(
    carouselSlides: Slide[],
    category: string
): string {
    const slidesData = JSON.stringify(carouselSlides, null, 2);

    return `You are an expert content optimizer for vertical video formats (TikTok/Reels/Shorts).

TASK: Convert carousel slides into video slides optimized for background video with narrator.

CATEGORY: ${category}

CAROUSEL SLIDES DATA:
${slidesData}

VIDEO SLIDE TYPES AVAILABLE:
1. VIDEO_COVER - Opening slide (gradient background, bold title, subtitle)
2. VIDEO_POINT - Single key point (numbered badge, main text, supporting text)
3. VIDEO_QUESTION - Question slide (question mark icon, question text)
4. VIDEO_ANSWER - Answer/solution slide (checkmark icon, answer text)
5. VIDEO_LIST - List items (numbered bullets, max 4-5 items)
6. VIDEO_QUOTE - Quote/highlight (elegant design with quotation marks)
7. VIDEO_TRANSITION - Transition/pause (emoji icon, short text, for pacing)
8. VIDEO_CLOSING - Closing CTA (colored background, social handle, call to action)

CONVERSION RULES:
1. Keep text SHORT and SIMPLE - video narrator will explain details
2. First slide MUST be VIDEO_COVER
3. Last slide MUST be VIDEO_CLOSING
4. For riddles: Use VIDEO_QUESTION → VIDEO_TRANSITION → VIDEO_ANSWER pattern
5. For tutorials/tips: Use VIDEO_POINT for each tip
6. For lists: Combine multiple points into VIDEO_LIST (max 4-5 items)
7. Add VIDEO_TRANSITION between major sections for pacing
8. Extract main message only, remove verbose text
9. Make each slide standalone (narrator provides context)
10. GENERATE IMAGE PROMPTS: Create "prompt_untuk_image" for EVERY slide with consistent visual style

IMAGE PROMPT GUIDELINES (WAJIB DIPATUHI):
GAYA VISUAL WAJIB:
- Gaya: Foto monokrom (hitam-putih) dengan efek rasterize yang kuat dan terlihat jelas
- Komposisi: Objek utama berukuran kecil (maksimal 1/3 dari total ruang), positioned centered, dengan white space dominan
- Objek: HARUS objek konkret dan realistis yang relevan dengan konten (DILARANG abstrak/icon/symbol)
- Efek: HARUS memiliki efek rasterize/halftone yang jelas dengan dot pattern prominent
- Background: WAJIB pure white background #FFFFFF (tidak ada variasi warna)
- Format: Objek utuh, tidak terpotong (complete object, no cropping, full view)

PEMILIHAN OBJEK BERDASARKAN TIPE SLIDE:
- VIDEO_COVER: Objek yang merepresentasikan topik utama (laptop, book, smartphone)
- VIDEO_POINT/VIDEO_ANSWER: Objek yang merepresentasikan konsep (lightbulb, key, compass)
- VIDEO_QUESTION: Objek yang merepresentasikan pertanyaan/mystery (magnifying glass, question mark shape object)
- VIDEO_LIST: Objek yang merepresentasikan checklist/items (clipboard, notebook, pen)
- VIDEO_QUOTE: Objek yang merepresentasikan wisdom (book, glasses, quote marks object)
- VIDEO_TRANSITION: Objek yang merepresentasikan perubahan (arrow, bridge, door)
- VIDEO_CLOSING: Objek yang merepresentasikan action (rocket, trophy, target)

TEMPLATE PROMPT (WAJIB):
"A [concrete object description], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"

CONTOH PROMPT YANG BENAR:
- "A modern laptop computer, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- "A lightbulb, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- "A red apple, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"

OUTPUT FORMAT (JSON):
{
  "videoSlides": [
    {
      "tipe_slide": "VIDEO_COVER",
      "judul_slide": "Short catchy title",
      "sub_judul_slide": "Brief subtitle (optional)",
      "prompt_untuk_image": "Descriptive image prompt in English"
    },
    {
      "tipe_slide": "VIDEO_POINT",
      "judul_slide": "Main point text (2-3 words max)",
      "konten_slide": "Supporting detail (one short sentence)",
      "prompt_untuk_image": "A [concrete object], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
    },
    {
      "tipe_slide": "VIDEO_LIST",
      "judul_slide": "List title",
      "sub_judul_slide": "Context (optional)",
      "list_items": ["Item 1", "Item 2", "Item 3"],
      "prompt_untuk_image": "A [concrete object], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
    },
    {
      "tipe_slide": "VIDEO_CLOSING",
      "judul_slide": "Closing message",
      "sub_judul_slide": "CTA subtitle",
      "konten_slide": "Engagement text",
      "prompt_untuk_image": "A [concrete object], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
    }
  ]
}

IMPORTANT:
- Keep judul_slide under 50 characters
- Keep konten_slide under 100 characters
- List items under 60 characters each
- Use engaging, conversational Indonesian language
- Focus on ONE main message per slide
- ALWAYS generate "prompt_untuk_image" for ALL slides following the template above
- Every prompt MUST end with: "Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- Use ONLY concrete, realistic objects (NO abstract icons or symbols)
- Objects must be small (max 1/3 of space) with dominant white space
- Style: Black and white with strong rasterize/halftone effect

Generate the optimized video slides now:`;
}

/**
 * Call Gemini AI untuk konversi slides
 */
async function callAIForConversion(
    prompt: string,
    systemMessage: string
): Promise<{ videoSlides: VideoSlide[] } | null> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                systemInstruction: systemMessage,
            },
        });

        const jsonString = response.text?.trim() || "";

        // Clean JSON string dari markdown code blocks jika ada
        const cleanedJsonString = jsonString
            .replace(/^```json\n/, "")
            .replace(/\n```$/, "")
            .trim();

        // Parse JSON response
        const parsed = JSON.parse(cleanedJsonString);

        // Validate structure
        if (!parsed.videoSlides || !Array.isArray(parsed.videoSlides)) {
            console.error("Invalid AI response structure");
            return null;
        }

        return parsed;
    } catch (error) {
        console.error("Gemini AI Conversion Error:", error);
        return null;
    }
}

/**
 * Validate video slides structure
 */
function validateVideoSlides(slides: any[]): VideoSlide[] {
    const validTypes: VideoSlideType[] = [
        "VIDEO_COVER",
        "VIDEO_POINT",
        "VIDEO_QUESTION",
        "VIDEO_ANSWER",
        "VIDEO_LIST",
        "VIDEO_QUOTE",
        "VIDEO_TRANSITION",
        "VIDEO_CLOSING",
    ];

    return slides
        .filter((slide) => {
            // Check if tipe_slide is valid
            if (!validTypes.includes(slide.tipe_slide)) {
                console.warn(`Invalid slide type: ${slide.tipe_slide}`);
                return false;
            }

            // Check if judul_slide exists
            if (!slide.judul_slide || typeof slide.judul_slide !== "string") {
                console.warn("Missing or invalid judul_slide");
                return false;
            }

            return true;
        })
        .map((slide) => ({
            tipe_slide: slide.tipe_slide as VideoSlideType,
            judul_slide: slide.judul_slide,
            sub_judul_slide: slide.sub_judul_slide || undefined,
            konten_slide: slide.konten_slide || undefined,
            list_items: slide.list_items || undefined,
            prompt_untuk_image: slide.prompt_untuk_image || undefined,
            saved_image_url: slide.saved_image_url || undefined,
        }));
}

/**
 * Main function: Convert carousel slides to video slides using Gemini AI
 */
export async function convertCarouselToVideoSlides(
    carouselSlides: Slide[],
    category: string,
    contentId: string
): Promise<ConversionResult> {
    try {
        // Generate AI prompt
        const prompt = generateConversionPrompt(carouselSlides, category);

        // System message untuk Gemini AI
        const systemMessage = `
Anda adalah expert content optimizer untuk vertical video formats (TikTok, Reels, Shorts).
Spesialisasi: Mengkonversi carousel slides Instagram menjadi video slides yang optimized untuk background video dengan narrator.

TUGAS UTAMA:
1. Analisis carousel slides yang diberikan
2. Identifikasi tipe konten dan kategori
3. Konversi ke format video slides yang simple dan clean
4. Text disederhanakan untuk video format dengan narrator
5. Generate image prompts untuk setiap slide dengan gaya konsisten
6. Output dalam format JSON yang valid

PRINSIP KONVERSI:
- Text harus SHORT dan SIMPLE (narrator akan jelaskan detail)
- Fokus pada ONE main message per slide
- Visual hierarchy yang jelas
- Tidak distract dari narrator
- Background seamless dengan narrator area (40% bawah)
- SETIAP slide HARUS memiliki "prompt_untuk_image" dengan gaya konsisten

GAYA VISUAL UNTUK IMAGE PROMPT (WAJIB):
1. Gaya: Foto monokrom (hitam-putih) dengan efek rasterize yang kuat dan prominent halftone dots
2. Komposisi: Objek kecil (max 1/3 space), centered, dominant white space
3. Objek: HARUS konkret dan realistis (laptop, book, lightbulb, apple) - DILARANG abstrak/icon
4. Background: WAJIB "pure white background #FFFFFF" - tidak ada variasi
5. Format objek: Complete, no cropping, full view, utuh tidak terpotong
6. Template: "A [concrete object], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"

OUTPUT FORMAT (JSON):
{
  "videoSlides": [
    {
      "tipe_slide": "VIDEO_COVER" | "VIDEO_POINT" | "VIDEO_QUESTION" | "VIDEO_ANSWER" | "VIDEO_LIST" | "VIDEO_QUOTE" | "VIDEO_TRANSITION" | "VIDEO_CLOSING",
      "judul_slide": "Main text (max 50 chars)",
      "sub_judul_slide": "Subtitle (optional, max 40 chars)",
      "konten_slide": "Supporting text (optional, max 100 chars)",
      "list_items": ["item1", "item2"], // only for VIDEO_LIST
      "prompt_untuk_image": "MUST follow template above with concrete object, white background, rasterize effect"
    }
  ]
}

ATURAN WAJIB:
- First slide MUST be VIDEO_COVER
- Last slide MUST be VIDEO_CLOSING  
- Keep text MINIMAL (narrator provides context)
- ALWAYS generate "prompt_untuk_image" for ALL slides
- Every image prompt MUST end with: "Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- Use ONLY concrete realistic objects (NO abstract/icon/symbol)
- Bahasa Indonesia casual dan engaging
- Response MUST be valid JSON
        `;

        // Call AI for conversion
        const aiResult = await callAIForConversion(prompt, systemMessage);

        if (!aiResult || !aiResult.videoSlides) {
            return {
                videoSlides: [],
                success: false,
                error: "AI conversion failed",
            };
        }

        // Validate and clean the results
        const validatedSlides = validateVideoSlides(aiResult.videoSlides);

        if (validatedSlides.length === 0) {
            return {
                videoSlides: [],
                success: false,
                error: "No valid slides after validation",
            };
        }

        // Ensure first slide is COVER and last is CLOSING
        if (validatedSlides[0].tipe_slide !== "VIDEO_COVER") {
            console.warn("First slide is not VIDEO_COVER, adding one");
            validatedSlides.unshift({
                tipe_slide: "VIDEO_COVER",
                judul_slide: "Content Video",
                sub_judul_slide: "ByteUnite.dev",
            });
        }

        if (
            validatedSlides[validatedSlides.length - 1].tipe_slide !==
            "VIDEO_CLOSING"
        ) {
            console.warn("Last slide is not VIDEO_CLOSING, adding one");
            validatedSlides.push({
                tipe_slide: "VIDEO_CLOSING",
                judul_slide: "Terima Kasih!",
                sub_judul_slide: "Follow untuk konten menarik lainnya",
                konten_slide: "Comment pendapatmu di bawah!",
            });
        }

        return {
            videoSlides: validatedSlides,
            success: true,
        };
    } catch (error) {
        console.error("Conversion Error:", error);
        return {
            videoSlides: [],
            success: false,
            error: (error as Error).message,
        };
    }
}

/**
 * Save video slides to database
 */
export async function saveVideoSlidesToDatabase(
    contentId: string,
    category: string,
    videoSlides: VideoSlide[]
): Promise<boolean> {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const endpoint = `${baseUrl}/api/${category}/${contentId}/video-slides`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                videoSlides,
            }),
        });

        return response.ok;
    } catch (error) {
        console.error("Save to database error:", error);
        return false;
    }
}
