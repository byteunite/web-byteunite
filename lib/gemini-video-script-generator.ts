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
2. **Durasi TARGET: 25-30 detik** (maksimal 35 detik) - super pendek dan padat!
3. **CUT setiap 3 detik** - Buat segmen pendek untuk keep attention (cut-to-cut editing style)
4. Hook kuat di 3 detik pertama (wajib menarik perhatian!)
5. Gunakan bahasa Indonesia casual, relatable, dan engaging
6. Setiap kalimat pendek dan impactful - langsung ke poin!
7. HINDARI kata sambung yang panjang, langsung to the point
8. Script harus mengalir natural dan cepat

STRUKTUR SCRIPT (Total ~25-30 detik):
1. **HOOK (0-3 detik)** - Powerful statement atau pertanyaan mengejutkan! [Cut 1]
2. **POIN 1 (3-6 detik)** - Fakta atau info pertama yang shocking [Cut 2]
3. **POIN 2 (6-9 detik)** - Fakta kedua dengan transisi cepat [Cut 3]
4. **POIN 3 (9-12 detik)** - Fakta ketiga yang mindblowing [Cut 4]
5. **TWIST/BONUS (12-15 detik)** - Info bonus atau plot twist [Cut 5]
6. **CONCLUSION (15-18 detik)** - Kesimpulan singkat yang kuat [Cut 6]
7. **CTA (18-21 detik)** - Call-to-action yang jelas dan cepat [Cut 7]
8. **OUTRO (21-25 detik)** - Penutup dengan hook untuk next video [Cut 8]

ATURAN WAJIB UNTUK SCRIPT:
❌ JANGAN gunakan identifier seperti "CREATOR:", "HOST:", "NARRATOR:", atau label apapun
❌ JANGAN gunakan header/section seperti "HOOK:", "INTRO:", "OUTRO:"
❌ JANGAN gunakan markdown formatting seperti **, *, ###, atau sejenisnya
✅ HANYA tulis kalimat narasi yang siap dibaca langsung
✅ Gunakan [visual cue] HANYA untuk petunjuk editing/visual
✅ Pisahkan setiap segmen dengan baris baru untuk clarity
✅ Setiap segmen = 1 cut (sekitar 3 detik)

FORMAT SCRIPT YANG BENAR:
Tulis narasi langsung tanpa label apapun. Gunakan line break untuk pisahkan setiap cut.
Sisipkan [visual cue] hanya untuk petunjuk kamera/editing.

TIPS PENULISAN SCRIPT:
- Kalimat pendek: 5-10 kata per kalimat maksimal
- Pace cepat: langsung ke poin, no fluff
- Gunakan kata yang powerfull dan emotive
- Setiap 3 detik = 1 visual cut/change
- Hindari penjelasan panjang - buat penasaran!
- End dengan cliffhanger atau strong CTA

FORMAT OUTPUT WAJIB:
{
    "script": "Script lengkap TANPA label/identifier, hanya narasi bersih dengan [visual cue]",
    "estimatedDuration": "25-30 detik",
    "tips": ["Tip untuk delivery cepat", "Tip untuk cut-to-cut editing", "Tip untuk maintain energy"]
}

CONTOH SCRIPT YANG BAIK (Format Bersih):
[Close up shocked face]
Ini rahasia yang 99% orang gak tau!

[Cut to slide 1]
Fakta pertama bakal bikin kamu terkejut.

[Zoom in text]
Yang kedua? Ini lebih gila lagi!

[Cut to slide 2]
Dan yang ketiga... game changer banget!

[Dramatic pause]
Tapi ada satu hal yang jarang dibahas.

[Cut to final slide]
Ini yang bikin semuanya masuk akal!

[Close up confident]
Sekarang kamu udah tau rahasianya.

[Point to screen]
Save video ini biar gak lupa! Follow untuk tips lainnya!

PENTING:
- Response HARUS dalam format JSON yang valid
- Script harus BERSIH tanpa markdown, tanpa label, tanpa identifier
- Script langsung siap dibaca di teleprompter/prompter
- Durasi harus pendek: target 25-30 detik (50-60 kata total)
- Setiap segmen dirancang untuk cut setiap 3 detik
- Tips harus fokus pada pace cepat dan cut-to-cut editing
    `;

    const systemMessage = `
Anda adalah expert video script writer untuk ultra-short-form content (TikTok, Reels, Shorts).
Spesialisasi: Cut-to-cut editing style dengan pace sangat cepat (cut setiap 3 detik).

Tugas Anda adalah membuat script yang:
1. Super pendek dan padat: TARGET 25-30 detik (maksimal 35 detik)
2. BERSIH dari label/identifier - langsung narasi yang siap dibaca
3. Natural dan conversational dengan pace cepat
4. Hook yang sangat kuat di 3 detik pertama
5. Terstruktur untuk cut-to-cut editing (8-10 cuts dalam 25-30 detik)
6. Hanya menggunakan [visual cue] untuk petunjuk kamera/editing
7. TANPA markdown formatting (**bold**, *italic*, ###header)
8. TANPA identifier (CREATOR:, HOST:, HOOK:, INTRO:, etc)

CRITICAL: Script harus 100% bersih dan langsung siap dibaca di teleprompter.
Format yang salah akan ditolak!

Output HARUS berupa JSON Object dengan 3 properti:
- "script": String (narasi bersih TANPA label/markdown, hanya [visual cue])
- "estimatedDuration": String (target: "25-30 detik")
- "tips": Array of Strings (fokus pada pace cepat dan cut-to-cut editing)

Script dioptimasi untuk:
- Format vertical video 9:16
- Durasi 25-30 detik (maksimal 35 detik)
- Cut setiap 3 detik untuk maintain attention
- Pace sangat cepat dengan kalimat pendek (5-10 kata)
- High retention rate dengan quick cuts
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
