import { GoogleGenAI } from "@google/genai";

// Inisialisasi Gemini AI client. Kunci API akan diambil secara otomatis dari GEMINI_API_KEY.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

interface SlideData {
    tipe_slide: string;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
    prompt_untuk_image?: string;
}

interface CarouselData {
    slides: SlideData[];
    caption: string;
    hashtags: string[];
}

/**
 * Generate carousel slides untuk topik tertentu menggunakan Gemini AI
 *
 * @param title - Judul topik
 * @param description - Deskripsi detail topik
 * @param category - Kategori topik (opsional)
 * @param keywords - Kata kunci terkait (opsional)
 * @returns Promise<CarouselData> - Data carousel yang siap digunakan
 */
export async function generateTopicCarousel(
    title: string,
    description: string,
    category?: string,
    keywords?: string[]
): Promise<CarouselData> {
    // Membuat User Prompt yang terstruktur
    const userPrompt = `
Kamu adalah seorang content creator profesional yang ahli dalam membuat konten edukatif dan menarik untuk Instagram carousel.

Buat konten carousel Instagram yang informatif dan engaging untuk topik berikut:

**TOPIK:** ${title}
**DESKRIPSI:** ${description}
${category ? `**KATEGORI:** ${category}` : ""}
${
    keywords && keywords.length > 0
        ? `**KATA KUNCI:** ${keywords.join(", ")}`
        : ""
}

INSTRUKSI PENTING:
1. Buat 5-8 slides yang berisi informasi edukatif tentang topik ini
2. Gunakan struktur: INTRO → KONTEN UTAMA (3-5 slides) → KESIMPULAN/CALL TO ACTION
3. Setiap slide harus informatif namun tetap ringkas dan mudah dipahami
4. Gunakan bahasa yang engaging dan sesuai untuk media sosial
5. Untuk setiap slide, buatkan prompt untuk generate image yang relevan

JENIS SLIDE yang bisa digunakan:
- INTRO: Slide pembuka yang menarik perhatian
- POIN_UTAMA: Menjelaskan poin-poin penting
- DETAIL: Memberikan detail atau penjelasan lebih dalam
- LIST: Daftar item atau tips
- FAKTA: Menyajikan fakta menarik
- KESIMPULAN: Ringkasan atau penutup
- CALL_TO_ACTION: Ajakan untuk engage

FORMAT OUTPUT WAJIB:
{
    "slides": [
        {
            "tipe_slide": "INTRO",
            "judul_slide": "Judul menarik (max 6 kata)",
            "sub_judul_slide": "Sub judul yang mendukung (max 10 kata)",
            "konten_slide": "Konten utama yang lebih detail namun tetap ringkas (2-3 kalimat singkat atau 3-5 bullet points)",
            "prompt_untuk_image": "Deskripsi untuk generate image yang relevan dengan slide ini (bahasa Inggris, detailed, artistic)"
        }
    ],
    "caption": "Caption Instagram yang menarik dengan emoji, hook di awal, dan call to action di akhir (max 150 kata)",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", ...] (10-15 hashtags yang relevan)
}

PENTING:
- Response HARUS dalam format JSON yang valid
- Konten harus informatif, akurat, dan bermanfaat
- Sesuaikan tone dengan target audience
- Pastikan semua slide kohesif dan mengalir dengan baik
    `;

    const systemMessage = `
Anda adalah pembuat konten edukatif untuk media sosial yang ahli dalam memproduksi output dalam format JSON yang terstruktur. Tugas Anda adalah mengubah topik edukatif menjadi sebuah array of objects untuk carousel postingan media sosial, PLUS caption dan hashtag yang menarik.

FORMAT OUTPUT WAJIB:
1. Output harus berupa JSON Object dengan 3 properti utama:
   - "slides": Array of Objects (carousel slides, 5-8 slide)
   - "caption": String (caption untuk postingan sosial media)
   - "hashtags": Array of Strings (hashtag-hashtag yang relevan)
2. Total slide per topik harus 5-8 slide, dengan struktur: INTRO → KONTEN UTAMA → KESIMPULAN/CTA
3. Teks (judul_slide, sub_judul_slide, konten_slide, caption) harus ringkas dan dalam Bahasa Indonesia yang engaging.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                responseMimeType: "application/json",
                systemInstruction: systemMessage,
            },
        });

        // Mengurai teks JSON yang dikembalikan oleh model
        const jsonString = response.text?.trim() || "";
        // Beberapa model mungkin mengembalikan JSON dalam Markdown block, hapus backtick jika ada
        const cleanedJsonString = jsonString
            .replace(/^```json\n/, "")
            .replace(/\n```$/, "");

        const carouselData: CarouselData = JSON.parse(cleanedJsonString);

        // Validasi structure
        if (!carouselData.slides || !Array.isArray(carouselData.slides)) {
            throw new Error("Invalid carousel data structure");
        }

        return carouselData;
    } catch (error) {
        console.error("Error generating topic carousel:", error);
        throw new Error(
            `Failed to generate carousel: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
