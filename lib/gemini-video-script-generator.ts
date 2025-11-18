import { GoogleGenAI } from "@google/genai";

// Inisialisasi Gemini AI client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

interface SlideData {
    tipe_slide: string;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
}

interface VideoScriptData {
    script: string;
    estimatedDuration: string;
    tips: string[];
}

/**
 * Generate script video untuk TikTok/Reels/Shorts menggunakan Gemini AI
 * Script dibuat berdasarkan caption dan content dari slides
 *
 * @param caption - Caption Instagram yang sudah ada
 * @param slides - Array of slide data
 * @param category - Kategori konten (riddles/sites/topics)
 * @returns Promise<VideoScriptData> - Script video yang siap dibaca oleh content creator
 */
export async function generateVideoScript(
    caption: string,
    slides: SlideData[],
    category: string = "riddles"
): Promise<VideoScriptData> {
    // Membuat ringkasan dari slides
    const slidesContent = slides
        .map((slide, index) => {
            return `Slide ${index + 1} (${slide.tipe_slide}):
Judul: ${slide.judul_slide}
Sub Judul: ${slide.sub_judul_slide}
Konten: ${slide.konten_slide}`;
        })
        .join("\n\n");

    const userPrompt = `
Kamu adalah seorang content creator profesional yang ahli dalam membuat script video untuk TikTok, Instagram Reels, dan YouTube Shorts.

Buatkan script video yang engaging dan ready untuk dibaca oleh content creator berdasarkan konten berikut:

**KATEGORI:** ${category}
**CAPTION INSTAGRAM:** ${caption}

**ISI SLIDES:**
${slidesContent}

INSTRUKSI PENTING:
1. Script harus natural seperti ngobrol santai dengan teman
2. Durasi ideal: 30-60 detik (maksimal 90 detik) - cocok untuk TikTok/Reels/Shorts
3. Hook kuat di 3 detik pertama (wajib menarik perhatian!)
4. Gunakan bahasa Indonesia casual, relatable, dan engaging
5. Sisipkan pause alami untuk transisi antar poin
6. Gunakan call-to-action yang jelas di akhir
7. Berikan cue untuk gesture/visual aids (misal: [tunjuk ke teks], [zoom in], dll)
8. Script harus mengalir natural, tidak kaku atau terlalu formal

STRUKTUR SCRIPT:
1. HOOK (3-5 detik pertama) - Buat penonton stop scrolling!
2. INTRO (5-10 detik) - Perkenalan singkat topik
3. KONTEN UTAMA (30-50 detik) - Explain poin-poin dari slides
4. OUTRO & CTA (5-10 detik) - Kesimpulan dan ajakan engage

TIPS TEKNIS:
- Gunakan kata-kata yang mudah diucapkan (avoid tongue twisters)
- Buat natural pauses dengan tanda [...] 
- Tambahkan [emphasis] untuk kata yang perlu ditekankan
- Sisipkan [visual cue] untuk membantu editing
- Pace harus cepat tapi jelas - sesuai format short-form content

FORMAT OUTPUT WAJIB:
{
    "script": "Script lengkap dengan cue visual dan timing",
    "estimatedDuration": "Estimasi durasi dalam detik (contoh: '45-60 detik')",
    "tips": ["Tip 1 untuk delivery", "Tip 2 untuk editing", "Tip 3 untuk visual"]
}

CONTOH SCRIPT YANG BAIK:
"[Close up ke wajah] Eh, tau gak sih... [pause] bahwa 90% orang gagal di hal ini! [zoom out]

Halo guys! Hari ini gue mau bahas tentang [topik] yang sering bikin kalian bingung.

[Cut ke visual 1] Pertama, [poin 1 dengan penjelasan singkat]. Simple kan?

[Transition] Terus yang kedua, ini penting banget nih... [poin 2]. [Tunjuk ke teks]

[Cut ke visual 2] Dan yang terakhir, [poin 3]. Ini game changer!

[Close up] Jadi intinya... [kesimpulan singkat]. 

Kalau bermanfaat, jangan lupa save dan share ke temen kalian ya! [wave] Sampai jumpa di konten berikutnya!"

PENTING:
- Response HARUS dalam format JSON yang valid
- Script harus mudah dibaca dan diucapkan
- Durasi harus realistis (hitung sekitar 150-160 kata per menit untuk pace natural)
- Tips harus actionable dan helpful untuk content creator
    `;

    const systemMessage = `
Anda adalah expert video script writer untuk short-form content (TikTok, Reels, Shorts).
Tugas Anda adalah membuat script yang:
1. Natural dan conversational (seperti ngobrol dengan teman)
2. Engaging dengan hook yang kuat
3. Terstruktur dengan timing yang tepat
4. Mudah dibaca dan diucapkan oleh content creator
5. Dilengkapi dengan visual cues untuk editing

Output HARUS berupa JSON Object dengan 3 properti:
- "script": String (script lengkap dengan cue visual)
- "estimatedDuration": String (estimasi durasi)
- "tips": Array of Strings (tips untuk delivery dan editing)

Script harus optimized untuk format vertical video (9:16) dengan durasi 30-90 detik.
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

        const jsonString = response.text?.trim() || "";
        const cleanedJsonString = jsonString
            .replace(/^```json\n/, "")
            .replace(/\n```$/, "");

        const scriptData: VideoScriptData = JSON.parse(cleanedJsonString);

        // Validasi structure
        if (
            !scriptData.script ||
            !scriptData.estimatedDuration ||
            !scriptData.tips
        ) {
            throw new Error("Invalid script data structure");
        }

        return scriptData;
    } catch (error) {
        console.error("Error generating video script:", error);
        throw new Error(
            `Failed to generate video script: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
