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
1. Buat 5-7 slides yang berisi informasi edukatif tentang topik ini
2. Gunakan struktur: INTRO → KONTEN UTAMA (3-4 slides) → KESIMPULAN/CALL TO ACTION
3. KONTEN HARUS SUPER SINGKAT & PADAT - target audience Indonesia dengan attention span pendek!
4. Gunakan bahasa casual, relatable, dan mudah dicerna (hindari kalimat panjang)
5. Prioritaskan visual over text - konten slide cukup 1-2 kalimat pendek atau 2-4 bullet points singkat
6. Untuk setiap slide, buatkan prompt untuk generate image yang eye-catching

JENIS SLIDE yang bisa digunakan:
- INTRO: Slide pembuka yang menarik perhatian (hook kuat!)
- POIN_UTAMA: Menjelaskan poin-poin penting (singkat & jelas)
- DETAIL: Memberikan detail atau penjelasan (tetap ringkas)
- LIST: Daftar item atau tips (maksimal 4 poin)
- FAKTA: Menyajikan fakta menarik (1-2 fakta per slide)
- KESIMPULAN: Ringkasan atau penutup (simple & memorable)
- CALL_TO_ACTION: Ajakan untuk engage (jelas & actionable)

ATURAN KONTEN SLIDE (PENTING!):
- Judul: Maksimal 4-5 kata, BOLD & CATCHY
- Sub Judul: Maksimal 6-8 kata, mendukung judul
- Konten: MAKSIMAL 1-2 kalimat pendek (masing-masing max 10 kata) ATAU 2-4 bullet points super singkat (max 6 kata per poin)
  * PENTING: konten_slide HARUS berupa STRING, bukan array!
  * Jika bullet points, gabungkan dengan \\n (newline), contoh: "• Poin 1\\n• Poin 2\\n• Poin 3"
  * GUNAKAN MARKDOWN untuk emphasis: **teks tebal**, *teks miring*
  * Contoh: "**Poin penting** untuk diingat" atau "*Tips:* Lakukan ini setiap hari"
  * Gunakan bold (**) untuk kata kunci atau poin penting yang perlu ditonjolkan
  * Gunakan italic (*) untuk catatan tambahan atau penekanan ringan
- Hindari paragraf panjang - orang Indonesia suka konten visual yang cepat dibaca!
- Gunakan emoji dengan bijak untuk visual appeal

GAYA VISUAL WAJIB (untuk prompt_untuk_image):
1. Gaya harus konsisten: Foto monokrom (hitam-putih) dengan efek rasterize yang kuat dan terlihat jelas.
2. Komposisi: Objek utama harus berukuran kecil dan merupakan benda nyata yang relevant (maksimal 1/3 dari total ruang), diposisikan di tengah (centered), dengan white space yang dominan.
3. DILARANG menggunakan elemen grafis abstrak atau geometris di latar belakang - fokus HANYA pada objek utama dengan background putih polos.
4. Efek Visual: Objek utama HARUS memiliki efek rasterize/halftone yang jelas dan terlihat, dengan dot pattern atau screen printing effect yang prominent.
5. Objek HARUS utuh, tidak terpotong, dan berdiri sempurna (complete object, no cropping, full view).
6. Format Prompt: Gunakan template berikut: "[Deskripsi Objek Tunggal yang Jelas], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation."
7. PENTING: Prompt HARUS URL-safe tanpa karakter khusus seperti parentheses, hashtag, atau tanda baca kompleks

ATURAN PEMILIHAN OBJEK UNTUK TOPIK EDUKATIF (SANGAT PENTING):
1. WAJIB gunakan objek KONKRET dan REALISTIS yang merepresentasikan konsep atau kategori topik
2. DILARANG KERAS menggunakan objek abstrak seperti: icons, symbols, logos, atau elemen grafis
3. Pilih objek fisik yang nyata dan relevan dengan topik seperti:
   - Untuk topik pembelajaran: buku, pensil, laptop, kacamata, notepad
   - Untuk topik teknologi: keyboard, mouse, smartphone, headphone, chip
   - Untuk topik bisnis: briefcase, calculator, chart paper, pen
   - Untuk topik kesehatan: apple, water bottle, yoga mat, running shoes
   - Untuk topik produktivitas: clock, calendar, checklist, coffee cup

PEMILIHAN OBJEK BERDASARKAN TIPE SLIDE:
- INTRO: Objek yang merepresentasikan topik utama (misal: untuk "Belajar Coding" → "laptop", untuk "Kesehatan" → "apple")
- POIN_UTAMA/DETAIL: Objek yang merepresentasikan konsep utama (misal: untuk "Tips" → "lightbulb", untuk "Strategi" → "chess piece")
- LIST: Objek yang merepresentasikan item list (misal: untuk "Checklist" → "clipboard with checkmarks")
- FAKTA: Objek yang merepresentasikan data/informasi (misal: untuk "Statistik" → "magnifying glass", untuk "Research" → "microscope")
- KESIMPULAN: Objek yang merepresentasikan ringkasan (misal: untuk "Summary" → "notebook", untuk "Key Points" → "key")
- CALL_TO_ACTION: Objek yang merepresentasikan action (misal: untuk "Start" → "rocket", untuk "Join" → "handshake", untuk "Learn" → "open book")

CONTOH PROMPT YANG BENAR UNTUK TOPIK EDUKATIF:
- "A modern laptop computer, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- "An open book with visible pages, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- "A lightbulb, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
- "A red apple, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"

CONTOH PROMPT YANG SALAH (JANGAN GUNAKAN):
- "An icon of a computer..." ❌ (gunakan objek konkret seperti "laptop")
- "Abstract tech symbol..." ❌ (harus objek fisik yang nyata)
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
            "judul_slide": "Judul menarik (max 5 kata)",
            "sub_judul_slide": "Sub judul yang mendukung (max 8 kata)",
            "konten_slide": "Konten SUPER SINGKAT dalam bentuk STRING dengan **markdown formatting**: bisa 1-2 kalimat pendek (max 10 kata/kalimat) ATAU bullet points digabung dengan \\n seperti: '• **Poin penting** pertama\\n• *Catatan:* Poin kedua\\n• Poin ketiga' (max 6 kata/poin). Gunakan **bold** untuk emphasis dan *italic* untuk catatan.",
            "prompt_untuk_image": "A [relevant object], complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
        }
    ],
    "caption": "Caption Instagram yang menarik dengan emoji, hook kuat di awal, dan call to action di akhir (max 100 kata, bahasa casual)",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3", ...] (10-15 hashtags yang relevan)
}

PENTING:
- Response HARUS dalam format JSON yang valid
- **konten_slide HARUS STRING, BUKAN ARRAY!** Jika bullet points, gabung dengan \\n
- Konten harus SANGAT RINGKAS - orang scroll cepat, jadi harus langsung to the point!
- Bahasa casual, relatable, tidak kaku - seperti ngobrol dengan teman
- Visual > Text - biarkan gambar yang berbicara, text hanya pendukung
- Pastikan setiap slide bisa dibaca dalam 3-5 detik maksimal
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

SANGAT PENTING - TYPE SAFETY:
- konten_slide HARUS bertipe STRING, TIDAK BOLEH array!
- Jika ingin bullet points, gabungkan dalam satu string dengan separator \\n
- Contoh yang BENAR: "• Poin pertama\\n• Poin kedua\\n• Poin ketiga"
- Contoh yang SALAH: ["Poin pertama", "Poin kedua", "Poin ketiga"]
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
