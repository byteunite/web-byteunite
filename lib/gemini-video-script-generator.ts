import { GoogleGenAI } from "@google/genai";

// Inisialisasi Gemini AI client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export interface SlideData {
    tipe_slide: string;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
}

export interface VideoScriptSinglePart {
    parts: 1;
    reason: string;
    script: string;
    estimatedDuration: string;
    keyPoints: string[];
    tips: string[];
}

export interface VideoScriptMultiPart {
    parts: 2;
    reason: string;
    part1: {
        script: string;
        estimatedDuration: string;
        keyPoints: string[];
        cliffhanger: string;
    };
    part2: {
        script: string;
        estimatedDuration: string;
        keyPoints: string[];
        connection: string;
    };
    tips: string[];
}

export type VideoScriptData = VideoScriptSinglePart | VideoScriptMultiPart;

// Legacy interface untuk backward compatibility
export interface LegacyVideoScriptData {
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

ANALISIS KONTEN TERLEBIH DAHULU:
🎯 **TENTUKAN PEMBAGIAN PART (1 atau 2 Part):**
- Jika konten bisa disampaikan dengan optimal dalam 25-35 detik tanpa mengorbankan detail penting → BUAT 1 PART
- Jika konten terlalu padat dan butuh 40-60+ detik untuk menyampaikan semua detail penting → BUAT 2 PART
- Pertimbangan utama: KUALITAS ENGAGEMENT > Panjang konten
- Part 1 harus bisa stand alone tapi tetap bikin penasaran untuk Part 2
- Setiap part harus maksimal 35 detik untuk retention optimal

⚠️ JANGAN HILANGKAN DETAIL PENTING:
- Identifikasi 3-5 poin kunci yang WAJIB ada di script
- Jika harus split jadi 2 part, distribusikan detail secara seimbang
- Part 1: Setup + Poin penting 1-2 + Strong cliffhanger
- Part 2: Quick recap (2-3 detik) + Poin penting 3-5 + Kesimpulan + CTA
- Prioritaskan fakta yang paling shocking/engaging di setiap part

📊 OPTIMASI RETENTION:
- Target durasi per part: 25-35 detik (sweet spot untuk retention)
- Cut setiap 3 detik untuk maintain attention
- Hook super kuat di awal setiap part (0-3 detik)
- Jika 2 part: End Part 1 dengan cliffhanger yang kuat!
- Pace cepat, tidak bertele-tele, langsung to the point

🔗 KONTINUITAS ANTAR PART (jika 2 part):
- Part 1 ending: Buat pertanyaan atau statement yang bikin penasaran
- Contoh: "Tapi yang paling gila... itu ada di part 2!"
- Part 2 opening: Quick recap singkat (2-3 detik) untuk connect ke Part 1
- Contoh: "Tadi kita udah bahas [poin Part 1], sekarang..."
- Setiap part harus bisa stand alone tapi lebih powerful kalau ditonton berurutan

INSTRUKSI PENTING:
1. Script harus natural seperti ngobrol santai dengan teman
2. **Durasi TARGET per part: 25-35 detik** - super pendek dan padat!
3. **CUT setiap 3 detik** - Buat segmen pendek untuk keep attention (cut-to-cut editing style)
4. Hook kuat di 3 detik pertama (wajib menarik perhatian!)
5. Gunakan bahasa Indonesia casual, relatable, dan engaging
6. Setiap kalimat pendek dan impactful - langsung ke poin!
7. HINDARI kata sambung yang panjang, langsung to the point
8. Script harus mengalir natural dan cepat
9. **JANGAN KORBANKAN DETAIL PENTING** - Semua poin kunci harus masuk

STRUKTUR SCRIPT:

📌 **JIKA 1 PART (25-35 detik):**
1. **HOOK (0-3 detik)** - Powerful statement atau pertanyaan mengejutkan! [Cut 1]
2. **POIN 1 (3-6 detik)** - Fakta atau info pertama yang shocking [Cut 2]
3. **POIN 2 (6-9 detik)** - Fakta kedua dengan transisi cepat [Cut 3]
4. **POIN 3 (9-12 detik)** - Fakta ketiga yang mindblowing [Cut 4]
5. **TWIST/BONUS (12-15 detik)** - Info bonus atau plot twist [Cut 5]
6. **CONCLUSION (15-18 detik)** - Kesimpulan singkat yang kuat [Cut 6]
7. **CTA (18-21 detik)** - Call-to-action yang jelas dan cepat [Cut 7]
8. **OUTRO (21-25 detik)** - Penutup dengan hook untuk next video [Cut 8]

📌 **JIKA 2 PART:**

**PART 1 (25-35 detik):**
1. **HOOK (0-3 detik)** - Super powerful hook yang bikin penasaran [Cut 1]
2. **SETUP (3-6 detik)** - Context singkat tapi jelas [Cut 2]
3. **POIN KUNCI 1 (6-10 detik)** - Detail penting pertama [Cut 3-4]
4. **POIN KUNCI 2 (10-14 detik)** - Detail penting kedua [Cut 5-6]
5. **BUILD TENSION (14-18 detik)** - Mulai naikin curiosity [Cut 7]
6. **CLIFFHANGER (18-25 detik)** - "Tapi yang paling gila... ada di part 2!" [Cut 8-9]
7. **CTA PART 1 (25-30 detik)** - "Swipe atau cek part 2 sekarang!" [Cut 10]

**PART 2 (25-35 detik):**
1. **QUICK RECAP (0-3 detik)** - "Tadi kita udah bahas [ringkas Part 1]..." [Cut 1]
2. **TRANSITION (3-5 detik)** - "Sekarang yang lebih gila..." [Cut 2]
3. **POIN KUNCI 3 (5-10 detik)** - Detail penting ketiga [Cut 3-4]
4. **POIN KUNCI 4 (10-15 detik)** - Detail penting keempat [Cut 5-6]
5. **REVEAL/TWIST (15-20 detik)** - Plot twist atau info paling shocking [Cut 7-8]
6. **CONCLUSION (20-25 detik)** - Kesimpulan yang kuat [Cut 9]
7. **STRONG CTA (25-30 detik)** - Save, follow, comment [Cut 10]

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

**JIKA 1 PART:**
{
    "parts": 1,
    "reason": "Alasan kenapa cukup 1 part (engagement optimal, detail cukup, dll)",
    "script": "Script lengkap TANPA label/identifier, hanya narasi bersih dengan [visual cue]",
    "estimatedDuration": "25-35 detik",
    "keyPoints": ["Poin penting 1", "Poin penting 2", "Poin penting 3"],
    "tips": ["Tip untuk delivery", "Tip untuk editing", "Tip untuk retention"]
}

**JIKA 2 PART:**
{
    "parts": 2,
    "reason": "Alasan kenapa perlu 2 part (konten padat, butuh detail, engagement lebih baik split, dll)",
    "part1": {
        "script": "Script Part 1 dengan cliffhanger kuat di akhir",
        "estimatedDuration": "25-35 detik",
        "keyPoints": ["Poin penting yang dibahas di Part 1"],
        "cliffhanger": "Kalimat cliffhanger yang bikin penasaran Part 2"
    },
    "part2": {
        "script": "Script Part 2 dengan recap singkat di awal",
        "estimatedDuration": "25-35 detik",
        "keyPoints": ["Poin penting yang dibahas di Part 2"],
        "connection": "Cara Part 2 connect ke Part 1"
    },
    "tips": ["Tip untuk kontinuitas antar part", "Tip untuk maintain engagement", "Tip untuk CTA"]
}

CONTOH SCRIPT YANG BAIK:

**CONTOH 1 PART (Konten Simple):**
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

**CONTOH 2 PART (Konten Padat):**

PART 1:
[Close up shocked]
Ada 5 fakta gila yang jarang orang tau!

[Cut to slide 1]
Pertama, ini bakal blow your mind!

[Zoom in]
Kedua, fakta ini bikin segalanya make sense.

[Cut to slide 2]
Dan yang ketiga? Ini yang paling shocking!

[Build tension]
Tapi tunggu dulu... masih ada yang lebih gila!

[Dramatic pause]
Fakta keempat dan kelima... bahkan lebih mindblowing!

[Cliffhanger]
Dan yang terakhir? Literally mengubah segalanya!

[Point to next video]
Lanjut ke part 2 SEKARANG! Trust me, you don't wanna miss this!

PART 2:
[Quick recap]
Tadi kita udah bahas 3 fakta gila, sekarang...

[Transition]
Fakta keempat ini yang bikin semua connect!

[Reveal]
Dan akhirnya... yang paling game-changing!

[Mind blown expression]
Fakta kelima ini literally mengubah perspektif!

[Explain impact]
Bayangin kalau kamu tau ini dari dulu!

[Strong conclusion]
Sekarang semua puzzle pieces udah lengkap!

[CTA]
Save kedua part ini! Share ke yang butuh tau! Follow untuk konten serupa!

PENTING:
- Response HARUS dalam format JSON yang valid sesuai struktur di atas
- ANALISIS dulu: Apakah konten ini butuh 1 atau 2 part?
- Jika 2 part: Pastikan cliffhanger Part 1 kuat dan Part 2 connect dengan baik
- SEMUA detail penting dari slides WAJIB masuk ke script (jangan ada yang hilang!)
- Script harus BERSIH tanpa markdown, tanpa label, tanpa identifier
- Script langsung siap dibaca di teleprompter/prompter
- Durasi per part: 25-35 detik (sweet spot untuk retention)
- Setiap segmen dirancang untuk cut setiap 3 detik
- Tips harus fokus pada pace cepat, retention, dan engagement
- Jika 2 part: Setiap part harus valuable sendiri tapi lebih powerful kalau ditonton berurutan
    `;

    const systemMessage = `
Anda adalah expert video script writer untuk ultra-short-form content (TikTok, Reels, Shorts).
Spesialisasi: Cut-to-cut editing style dengan pace sangat cepat (cut setiap 3 detik).

TUGAS UTAMA:
1. ANALISIS konten untuk tentukan optimal 1 atau 2 part
2. Prioritaskan KUALITAS ENGAGEMENT dan RETENTION
3. JANGAN HILANGKAN detail penting dari konten original
4. Buat script yang natural, cepat, dan engaging

KRITERIA PEMBAGIAN PART:
✅ 1 PART jika:
- Konten bisa dijelaskan lengkap dalam 25-35 detik tanpa rush
- 3-4 poin kunci utama
- Detail tidak terlalu kompleks
- Engagement lebih baik dalam satu flow utuh

✅ 2 PART jika:
- Konten butuh 40-60+ detik untuk explain semua detail penting
- 5+ poin kunci yang semuanya penting
- Detail kompleks yang butuh waktu lebih
- Engagement lebih baik dengan build-up dan cliffhanger
- Part 1 bisa create curiosity yang kuat untuk Part 2

ATURAN WAJIB:
1. Super pendek dan padat: TARGET 25-35 detik per part
2. BERSIH dari label/identifier - langsung narasi yang siap dibaca
3. Natural dan conversational dengan pace cepat
4. Hook yang sangat kuat di 3 detik pertama setiap part
5. Terstruktur untuk cut-to-cut editing (8-10 cuts per part)
6. Hanya menggunakan [visual cue] untuk petunjuk kamera/editing
7. TANPA markdown formatting (**bold**, *italic*, ###header)
8. TANPA identifier (CREATOR:, HOST:, HOOK:, INTRO:, etc)
9. SEMUA detail penting WAJIB masuk (jangan ada yang terlewat!)
10. Jika 2 part: Cliffhanger Part 1 harus kuat, Part 2 harus connect smooth

OPTIMASI RETENTION:
- Pace super cepat, langsung to the point
- Cut setiap 3 detik untuk maintain attention
- Hook kuat di awal (critical first 3 seconds!)
- Jika 2 part: End Part 1 dengan pertanyaan atau statement yang bikin penasaran
- Jangan bertele-tele, setiap kata harus purposeful

CRITICAL: Script harus 100% bersih dan langsung siap dibaca di teleprompter.

Output HARUS berupa JSON Object dengan struktur:
- Jika 1 part: "parts", "reason", "script", "estimatedDuration", "keyPoints", "tips"
- Jika 2 part: "parts", "reason", "part1", "part2", "tips"

Script dioptimasi untuk:
- Format vertical video 9:16
- Durasi 25-35 detik per part
- Cut setiap 3 detik untuk maintain attention
- Pace sangat cepat dengan kalimat pendek (5-10 kata)
- High retention rate dengan quick cuts dan strong hooks
- Jika 2 part: Continuity dan curiosity yang kuat antar part
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

        // Validasi structure berdasarkan tipe parts
        if (!scriptData.parts || !scriptData.reason || !scriptData.tips) {
            throw new Error(
                "Invalid script data structure: missing required fields"
            );
        }

        if (scriptData.parts === 1) {
            if (
                !scriptData.script ||
                !scriptData.estimatedDuration ||
                !scriptData.keyPoints
            ) {
                throw new Error("Invalid single part script data structure");
            }
        } else if (scriptData.parts === 2) {
            if (
                !scriptData.part1 ||
                !scriptData.part2 ||
                !scriptData.part1.script ||
                !scriptData.part2.script ||
                !scriptData.part1.estimatedDuration ||
                !scriptData.part2.estimatedDuration
            ) {
                throw new Error("Invalid multi-part script data structure");
            }
        } else {
            throw new Error("Invalid parts value: must be 1 or 2");
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
