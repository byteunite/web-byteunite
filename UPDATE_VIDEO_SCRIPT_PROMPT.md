# Update Video Script Generator - Ultra-Short Format

## 📋 Perubahan yang Dilakukan

### Tanggal: 23 November 2025

**File yang diubah:** `lib/gemini-video-script-generator.ts`

---

## 🎯 Tujuan Update

1. **Align dengan `cleanScriptForPrompter` function** di `DownloadSlidesButton.tsx`
2. **Script yang dihasilkan 100% clean** - siap dibaca di teleprompter tanpa perlu editing manual
3. **Video ultra-short (25-30 detik)** dengan cut-to-cut editing setiap 3 detik

---

## ✨ Fitur Baru

### 1. **Script Format - Clean & Ready**

#### ❌ Format Lama (Perlu Cleaning):

```
CREATOR: Halo guys!
**Hook:** Ini fakta mengejutkan!
### INTRO
*Yuk kita bahas topik ini...*
```

#### ✅ Format Baru (Clean):

```
[Close up shocked face]
Ini rahasia yang 99% orang gak tau!

[Cut to slide 1]
Fakta pertama bakal bikin kamu terkejut.

[Zoom in text]
Yang kedua? Ini lebih gila lagi!
```

### 2. **Ultra-Short Duration (25-30 detik)**

-   **Target:** 25-30 detik (maksimal 35 detik)
-   **Sebelumnya:** 30-90 detik
-   **Alasan:** Retention rate lebih tinggi untuk TikTok/Reels/Shorts

### 3. **Cut-to-Cut Editing Style**

Setiap 3 detik = 1 cut untuk maintain attention:

| Waktu  | Segmen     | Deskripsi          |
| ------ | ---------- | ------------------ |
| 0-3s   | HOOK       | Powerful statement |
| 3-6s   | POIN 1     | Fakta mengejutkan  |
| 6-9s   | POIN 2     | Info kedua         |
| 9-12s  | POIN 3     | Mindblowing fact   |
| 12-15s | TWIST      | Plot twist/bonus   |
| 15-18s | CONCLUSION | Kesimpulan kuat    |
| 18-21s | CTA        | Call-to-action     |
| 21-25s | OUTRO      | Hook next video    |

**Total: 8 cuts dalam 25 detik** = High engagement!

---

## 🔧 Technical Changes

### Perubahan di `userPrompt`:

#### 1. **Duration Target**

```typescript
// OLD:
"Durasi ideal: 30-60 detik (maksimal 90 detik)";

// NEW:
"**Durasi TARGET: 25-30 detik** (maksimal 35 detik) - super pendek dan padat!";
```

#### 2. **Cut-to-Cut Instruction**

```typescript
// NEW:
"**CUT setiap 3 detik** - Buat segmen pendek untuk keep attention (cut-to-cut editing style)";
```

#### 3. **Aturan Format Script**

```typescript
// NEW RULES:
"❌ JANGAN gunakan identifier seperti 'CREATOR:', 'HOST:', 'NARRATOR:', atau label apapun";
"❌ JANGAN gunakan header/section seperti 'HOOK:', 'INTRO:', 'OUTRO:'";
"❌ JANGAN gunakan markdown formatting seperti **, *, ###, atau sejenisnya";
"✅ HANYA tulis kalimat narasi yang siap dibaca langsung";
"✅ Gunakan [visual cue] HANYA untuk petunjuk editing/visual";
```

#### 4. **Structure Breakdown**

```typescript
// NEW STRUCTURE (25-30 detik):
"1. **HOOK (0-3 detik)** - Powerful statement [Cut 1]
2. **POIN 1 (3-6 detik)** - Fakta shocking [Cut 2]
3. **POIN 2 (6-9 detik)** - Transisi cepat [Cut 3]
4. **POIN 3 (9-12 detik)** - Mindblowing [Cut 4]
5. **TWIST/BONUS (12-15 detik)** - Plot twist [Cut 5]
6. **CONCLUSION (15-18 detik)** - Kesimpulan [Cut 6]
7. **CTA (18-21 detik)** - Call-to-action [Cut 7]
8. **OUTRO (21-25 detik)** - Hook next video [Cut 8]"
```

### Perubahan di `systemMessage`:

```typescript
// OLD:
"Script harus optimized untuk format vertical video (9:16) dengan durasi 30-90 detik.";

// NEW:
"Super pendek dan padat: TARGET 25-30 detik (maksimal 35 detik)";
"BERSIH dari label/identifier - langsung narasi yang siap dibaca";
"Terstruktur untuk cut-to-cut editing (8-10 cuts dalam 25-30 detik)";
"TANPA markdown formatting (**bold**, *italic*, ###header)";
"TANPA identifier (CREATOR:, HOST:, HOOK:, INTRO:, etc)";
```

---

## 🎬 Contoh Output

### Before (Format Lama):

```
HOOK: Halo guys! **Tau gak sih...**

INTRO: Hari ini gue mau bahas tentang fakta menarik.

CREATOR: *Pertama*, ini yang bikin shock.
[tunjuk ke teks]

HOST: Yang kedua, ini lebih gila lagi!

OUTRO: Jadi intinya... [kesimpulan].
Jangan lupa like dan follow ya!
```

**Masalah:** Perlu di-clean manual, ada identifier, ada markdown.

### After (Format Baru):

```
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
```

**Keuntungan:**

-   ✅ Langsung siap dibaca di teleprompter
-   ✅ Clean, no markdown, no identifier
-   ✅ [Visual cue] hanya untuk editing
-   ✅ 8 cuts dalam ~25 detik

---

## 🔄 Integrasi dengan `cleanScriptForPrompter`

Fungsi `cleanScriptForPrompter` di `DownloadSlidesButton.tsx` melakukan:

1. ❌ Remove identifiers (CREATOR:, HOST:, etc.)
2. ❌ Remove visual cues [text]
3. ❌ Remove bold **text**
4. ❌ Remove italic _text_
5. ❌ Remove headers (###, ##, #)
6. ✅ Format dengan line breaks yang natural

**Dengan prompt baru:**

-   Script sudah clean dari awal (no identifiers, no markdown)
-   Hanya perlu remove [visual cues] saat copy untuk prompter
-   Function `cleanScriptForPrompter` tetap jalan, tapi kerjanya minimal

---

## 📊 Perbandingan

| Aspek              | Sebelum                   | Sesudah          |
| ------------------ | ------------------------- | ---------------- |
| **Durasi**         | 30-90 detik               | 25-30 detik      |
| **Format**         | Ada markdown & identifier | Clean, siap baca |
| **Cuts**           | Tidak specific            | Every 3 detik    |
| **Structure**      | 4 section                 | 8 micro-segments |
| **Kata per detik** | ~2.5 kata/detik           | ~2 kata/detik    |
| **Total kata**     | 75-150 kata               | 50-60 kata       |
| **Cleaning**       | Manual heavy              | Auto minimal     |

---

## 🚀 Benefits

### 1. **Workflow Improvement**

-   ✅ Script langsung siap pakai
-   ✅ No manual cleaning required
-   ✅ Faster production time

### 2. **Better Engagement**

-   ✅ Shorter = Higher retention
-   ✅ Quick cuts = Maintain attention
-   ✅ Pace cepat = More engaging

### 3. **Platform Optimization**

-   ✅ Perfect untuk TikTok (15-30s sweet spot)
-   ✅ Instagram Reels (under 30s performs best)
-   ✅ YouTube Shorts (quick format wins)

### 4. **Content Creator Friendly**

-   ✅ Easy to read dari teleprompter
-   ✅ Clear visual cues untuk editing
-   ✅ Actionable tips included

---

## 🎯 Usage

```typescript
import { generateVideoScript } from "@/lib/gemini-video-script-generator";

const result = await generateVideoScript(
    caption,
    slides,
    "riddles" // atau "sites", "topics"
);

console.log(result);
// {
//   script: "[Clean script without labels or markdown]",
//   estimatedDuration: "25-30 detik",
//   tips: [
//     "Pace cepat dan energik",
//     "Cut setiap 3 detik untuk maintain attention",
//     "Use dynamic visuals per segment"
//   ]
// }
```

### Copy untuk Prompter:

```typescript
// Di DownloadSlidesButton.tsx
const copyNarrationForPrompter = async () => {
    // Script sudah clean, function ini cuma remove [visual cues]
    const cleanedScript = cleanScriptForPrompter(videoScript.script);
    await navigator.clipboard.writeText(cleanedScript);
};
```

---

## 📝 Testing Checklist

-   [ ] Generate script untuk kategori "riddles"
-   [ ] Generate script untuk kategori "sites"
-   [ ] Generate script untuk kategori "topics"
-   [ ] Verify duration: 25-30 detik
-   [ ] Verify format: No markdown, no identifiers
-   [ ] Verify structure: 8 segments (~3 detik each)
-   [ ] Test copy untuk prompter
-   [ ] Verify `cleanScriptForPrompter` works minimal
-   [ ] Check tips relevance untuk cut-to-cut editing

---

## 🔮 Future Improvements

1. **Dynamic Duration**: Option untuk pilih 15s, 30s, atau 60s
2. **Platform-Specific**: Different style untuk TikTok vs Reels vs Shorts
3. **Voice Tone**: Option untuk casual, professional, atau energetic
4. **Language Support**: English version
5. **A/B Testing**: Generate 2-3 variations

---

## 📚 Related Files

-   `lib/gemini-video-script-generator.ts` - Main generator
-   `components/DownloadSlidesButton.tsx` - UI & copy function
-   `app/api/generate-video-script/route.ts` - API endpoint
-   `app/api/save-video-script/route.ts` - Save to database

---

## ✅ Conclusion

Prompt untuk generate video script sekarang:

1. ✅ **Aligned** dengan `cleanScriptForPrompter` function
2. ✅ **Ultra-short** format (25-30 detik)
3. ✅ **Cut-to-cut** style (every 3 detik)
4. ✅ **Clean output** (no markdown, no identifiers)
5. ✅ **Ready untuk teleprompter** (langsung bisa dibaca)

Script yang dihasilkan langsung siap pakai dengan minimal processing! 🎉
