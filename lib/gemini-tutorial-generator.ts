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
 * Generate carousel slides untuk tutorial tertentu menggunakan Gemini AI
 *
 * @param title - Judul tutorial
 * @param description - Deskripsi detail tutorial
 * @param category - Kategori tutorial (opsional)
 * @param keywords - Kata kunci terkait (opsional)
 * @param difficulty - Tingkat kesulitan (beginner/intermediate/advanced)
 * @returns Promise<CarouselData> - Data carousel yang siap digunakan
 */
export async function generateTutorialCarousel(
    title: string,
    description: string,
    category?: string,
    keywords?: string[],
    difficulty?: string
): Promise<CarouselData> {
    // Membuat User Prompt yang terstruktur untuk tutorial
    const userPrompt = `
Kamu adalah seorang content creator profesional yang ahli dalam membuat tutorial edukatif dan menarik untuk Instagram carousel.

Buat konten carousel Instagram yang informatif dan engaging untuk tutorial berikut:

**TUTORIAL:** ${title}
**DESKRIPSI:** ${description}
${category ? `**KATEGORI:** ${category}` : ""}
${difficulty ? `**TINGKAT KESULITAN:** ${difficulty}` : ""}
${
    keywords && keywords.length > 0
        ? `**KATA KUNCI:** ${keywords.join(", ")}`
        : ""
}

INSTRUKSI PENTING UNTUK TUTORIAL:
1. Buat 6-9 slides yang berisi langkah-langkah tutorial yang jelas dan terstruktur
2. Gunakan struktur: INTRO → PERSIAPAN/TOOLS → LANGKAH-LANGKAH (4-6 slides) → KESIMPULAN/TIPS
3. KONTEN HARUS SUPER SINGKAT & PADAT - target audience Indonesia dengan attention span pendek!
4. Setiap langkah harus actionable dan mudah diikuti
5. Gunakan bahasa casual, relatable, dan mudah dicerna (hindari kalimat panjang)
6. Prioritaskan visual over text - konten slide cukup 1-2 kalimat pendek atau 2-4 bullet points singkat
7. Untuk setiap slide, buatkan prompt untuk generate image yang eye-catching dan relevan dengan langkah tutorial

JENIS SLIDE yang bisa digunakan untuk TUTORIAL:
- INTRO: Slide pembuka yang menarik perhatian (hook kuat!) - perkenalan tutorial
- PERSIAPAN: Tools, materials, atau prerequisites yang dibutuhkan
- LANGKAH: Langkah-langkah tutorial yang jelas dan berurutan
- TIPS: Tips penting atau hal yang perlu diperhatikan
- CONTOH: Contoh hasil atau aplikasi dari tutorial
- KESIMPULAN: Ringkasan atau review singkat tutorial
- CALL_TO_ACTION: Ajakan untuk praktek atau engage (jelas & actionable)

ATURAN KONTEN SLIDE (PENTING!):
- Judul: Maksimal 4-5 kata, BOLD & CATCHY (untuk LANGKAH gunakan format: "Langkah 1: ..." atau "Step 1: ...")
- Sub Judul: Maksimal 6-8 kata, mendukung judul dan menjelaskan tujuan langkah
- Konten: MAKSIMAL 1-2 kalimat pendek (masing-masing max 10 kata) ATAU 2-4 bullet points super singkat (max 6 kata per poin)
  * PENTING: konten_slide HARUS berupa STRING, bukan array!
  * Jika bullet points, gabungkan dengan \\n (newline), contoh: "• Poin 1\\n• Poin 2\\n• Poin 3"
  * GUNAKAN MARKDOWN untuk emphasis: **teks tebal**, *teks miring*
  * Contoh: "**Poin penting** untuk diingat" atau "*Tips:* Lakukan ini setiap hari"
  * Gunakan bold (**) untuk kata kunci atau poin penting yang perlu ditonjolkan
  * Gunakan italic (*) untuk catatan tambahan atau penekanan ringan
  * Untuk langkah tutorial, berikan instruksi yang spesifik dan actionable
- Hindari paragraf panjang - orang Indonesia suka konten visual yang cepat dibaca!
- Gunakan emoji dengan bijak untuk visual appeal dan memudahkan pemahaman

GAYA VISUAL WAJIB (untuk prompt_untuk_image):
1. Gaya harus konsisten: Foto monokrom (hitam-putih) dengan efek rasterize yang kuat dan terlihat jelas.
2. Komposisi: Objek utama harus berukuran kecil dan merupakan benda nyata yang relevant (maksimal 1/3 dari total ruang), diposisikan di tengah (centered), dengan white space yang dominan.
3. DILARANG menggunakan elemen grafis abstrak atau geometris di latar belakang - fokus HANYA pada objek utama dengan background putih polos.
4. Efek Visual: Objek utama HARUS memiliki efek rasterize/halftone yang jelas dan terlihat, dengan dot pattern atau screen printing effect yang prominent.
5. Objek HARUS utuh, tidak terpotong, dan berdiri sempurna (complete object, no cropping, full view).
6. Format Prompt: Gunakan template berikut: "[Deskripsi Objek Tunggal yang Jelas], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation."
7. PENTING: Prompt HARUS URL-safe tanpa karakter khusus seperti parentheses, hashtag, atau tanda baca kompleks

ATURAN PEMILIHAN OBJEK UNTUK TUTORIAL (SANGAT PENTING):
1. WAJIB gunakan objek KONKRET dan REALISTIS yang merepresentasikan langkah atau konsep tutorial
2. DILARANG KERAS menggunakan objek abstrak seperti: icons, symbols, logos, atau elemen grafis
3. Pilih objek fisik yang nyata dan relevan dengan tutorial seperti:
   - Untuk tutorial coding: laptop, keyboard, code editor, terminal, mouse
   - Untuk tutorial design: tablet, stylus, color palette, pencil, ruler
   - Untuk tutorial cooking: ingredients, utensils, pot, pan, knife
   - Untuk tutorial fitness: dumbbells, yoga mat, running shoes, water bottle
   - Untuk tutorial photography: camera, lens, tripod, lighting equipment

PEMILIHAN OBJEK BERDASARKAN TIPE SLIDE TUTORIAL:
- INTRO: Objek yang merepresentasikan hasil akhir atau tema tutorial (misal: untuk "Buat Website" → "laptop with website display")
- PERSIAPAN: Objek yang merepresentasikan tools/materials (misal: untuk "Tools" → "toolbox", untuk "Materials" → "supplies")
- LANGKAH: Objek yang merepresentasikan action pada langkah tersebut (misal: untuk "Install" → "download icon", untuk "Configure" → "settings gear")
- TIPS: Objek yang merepresentasikan perhatian/penting (misal: untuk "Important" → "exclamation mark", untuk "Warning" → "caution sign")
- CONTOH: Objek yang merepresentasikan hasil (misal: untuk "Result" → "finished product", untuk "Sample" → "example item")
- KESIMPULAN: Objek yang merepresentasikan selesai/sukses (misal: untuk "Completed" → "check mark", untuk "Success" → "trophy")
- CALL_TO_ACTION: Objek yang merepresentasikan action berikutnya (misal: untuk "Practice" → "notebook", untuk "Share" → "megaphone")

CONTOH PROMPT YANG BENAR UNTUK TUTORIAL:
- "A modern laptop computer with code on screen, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- "A professional DSLR camera with lens attached, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- "A set of cooking utensils including spatula and whisk, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"

CONTOH PROMPT YANG SALAH (JANGAN GUNAKAN):
- "An icon of a camera..." ❌ (gunakan objek konkret seperti "DSLR camera")
- "Abstract coding symbol..." ❌ (harus objek fisik yang nyata)
- "Colorful background with..." ❌ (background harus pure white)
- Prompt tanpa "complete object with no cropping, full view" ❌ (objek akan terpotong)
- Prompt tanpa "no borders, no frames, clean isolation" ❌ (objek akan memiliki kotak/frame)

ATURAN WARNA PUTIH (SANGAT PENTING - WAJIB DIPATUHI):
1. Background HARUS SELALU menggunakan "pure white background" (#FFFFFF atau RGB 255,255,255) - TIDAK ADA variasi.
2. White space HARUS SELALU konsisten dengan tone putih yang PERSIS SAMA di SETIAP slide.
3. DILARANG menggunakan istilah seperti "light background", "bright background" - HARUS SELALU "pure white background #FFFFFF".
4. Setiap prompt_untuk_image HARUS SELALU diakhiri dengan kalimat: "Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation."

FORMAT OUTPUT WAJIB:
{
    "slides": [
        {
            "tipe_slide": "INTRO",
            "judul_slide": "Judul tutorial (max 5 kata)",
            "sub_judul_slide": "Sub judul yang mendukung (max 8 kata)",
            "konten_slide": "Konten SUPER SINGKAT dalam bentuk STRING dengan **markdown formatting**: bisa 1-2 kalimat pendek (max 10 kata/kalimat) ATAU bullet points digabung dengan \\n seperti: '• **Poin penting** pertama\\n• *Catatan:* Poin kedua\\n• Poin ketiga' (max 6 kata/poin). Gunakan **bold** untuk emphasis dan *italic* untuk catatan.",
            "prompt_untuk_image": "A [relevant object for tutorial], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
        },
        {
            "tipe_slide": "PERSIAPAN",
            "judul_slide": "Tools & Materials",
            "sub_judul_slide": "Yang kamu butuhkan",
            "konten_slide": "• **Tool 1**\\n• **Tool 2**\\n• **Tool 3**",
            "prompt_untuk_image": "..."
        },
        {
            "tipe_slide": "LANGKAH",
            "judul_slide": "Langkah 1: [Action]",
            "sub_judul_slide": "Mulai dengan [tujuan]",
            "konten_slide": "**Instruksi spesifik** untuk langkah ini. *Tips:* Perhatikan detail penting.",
            "prompt_untuk_image": "..."
        }
    ],
    "caption": "Caption Instagram untuk tutorial yang menarik dengan emoji, hook kuat di awal, overview singkat tutorial, dan call to action di akhir (max 120 kata, bahasa casual)",
    "hashtags": ["tutorial", "howto", "stepbystep", ...] (10-15 hashtags yang relevan dengan tutorial)
}

PENTING:
- Response HARUS dalam format JSON yang valid
- **konten_slide HARUS STRING, BUKAN ARRAY!** Jika bullet points, gabung dengan \\n
- Konten harus SANGAT RINGKAS - orang scroll cepat, jadi harus langsung to the point!
- Setiap langkah harus jelas, actionable, dan mudah diikuti
- Bahasa casual, relatable, tidak kaku - seperti ngobrol dengan teman
- Visual > Text - biarkan gambar yang berbicara, text hanya pendukung
- Pastikan setiap slide bisa dibaca dalam 3-5 detik maksimal
- Untuk tutorial, urutan langkah sangat penting - pastikan flow-nya logis
    `;

    const systemMessage = `
Anda adalah pembuat konten tutorial edukatif untuk media sosial yang ahli dalam memproduksi output dalam format JSON yang terstruktur. Tugas Anda adalah mengubah tutorial edukatif menjadi sebuah array of objects untuk carousel postingan media sosial, PLUS caption dan hashtag yang menarik.

FORMAT OUTPUT WAJIB:
1. Output harus berupa JSON Object dengan 3 properti utama:
   - "slides": Array of Objects (carousel slides, 6-9 slide untuk tutorial)
   - "caption": String (caption untuk postingan sosial media)
   - "hashtags": Array of Strings (hashtag-hashtag yang relevan)
2. Total slide per tutorial harus 6-9 slide, dengan struktur: INTRO → PERSIAPAN/TOOLS → LANGKAH-LANGKAH (berurutan dan jelas) → KESIMPULAN/TIPS/CTA
3. Teks (judul_slide, sub_judul_slide, konten_slide, caption) harus ringkas dan dalam Bahasa Indonesia yang engaging.
4. Untuk tutorial, pastikan setiap langkah memiliki instruksi yang jelas dan actionable

SANGAT PENTING - TYPE SAFETY:
- konten_slide HARUS bertipe STRING, TIDAK BOLEH array!
- Jika ingin bullet points, gabungkan dalam satu string dengan separator \\n
- Contoh yang BENAR: "• **Langkah pertama**\\n• *Tips:* Langkah kedua\\n• Langkah ketiga"
- Contoh yang SALAH: ["Langkah pertama", "Langkah kedua", "Langkah ketiga"]
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
        console.error("Error generating tutorial carousel:", error);
        throw new Error(
            `Failed to generate tutorial carousel: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
