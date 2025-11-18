# Video Script Generator Feature

## 📋 Overview

Fitur ini memungkinkan content creator untuk generate script video yang ready untuk dibaca di TikTok, Instagram Reels, dan YouTube Shorts berdasarkan content slides yang sudah disimpan. Script di-generate menggunakan Gemini AI dan dapat disimpan ke database.

## ✨ Features

### 1. **AI-Powered Script Generation**

-   Generate script video berdasarkan caption dan content dari slides
-   Script dioptimalkan untuk format short-form content (30-90 detik)
-   Menggunakan bahasa Indonesia casual dan engaging
-   Dilengkapi dengan visual cues untuk editing

### 2. **Script Details**

-   **Script Content**: Text lengkap yang ready untuk dibaca
-   **Estimated Duration**: Durasi estimasi script (contoh: "45-60 detik")
-   **Delivery Tips**: Tips untuk delivery dan editing video

### 3. **Script Management**

-   Copy script ke clipboard dengan format lengkap
-   Save script ke database untuk referensi di masa depan
-   Script tersimpan di field `videoScript` pada model Riddle, Site, dan Topic

## 🏗️ Architecture

### Files Created/Modified

#### 1. **Library: `/lib/gemini-video-script-generator.ts`**

```typescript
// Generate video script menggunakan Gemini AI
export async function generateVideoScript(
    caption: string,
    slides: SlideData[],
    category: string = "riddles"
): Promise<VideoScriptData>;
```

**Features:**

-   Natural language processing untuk convert slides menjadi script
-   Hook kuat di 3 detik pertama
-   Structure: HOOK → INTRO → KONTEN → OUTRO & CTA
-   Visual cues: [close up], [zoom out], [pause], dll

#### 2. **API Endpoint: `/app/api/generate-video-script/route.ts`**

```typescript
POST / api / generate - video - script;
```

**Request Body:**

```json
{
    "caption": "Caption Instagram yang sudah ada",
    "slides": [
        {
            "tipe_slide": "INTRO",
            "judul_slide": "Judul Slide",
            "sub_judul_slide": "Sub Judul",
            "konten_slide": "Konten slide"
        }
    ],
    "category": "riddles" // atau "sites", "topics"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "script": "Script lengkap dengan visual cues...",
        "estimatedDuration": "45-60 detik",
        "tips": ["Tip 1 untuk delivery", "Tip 2 untuk editing"]
    }
}
```

#### 3. **API Endpoint: `/app/api/save-video-script/route.ts`**

```typescript
POST / api / save - video - script;
```

**Request Body:**

```json
{
    "contentId": "mongodb_object_id",
    "category": "riddles", // atau "sites", "topics"
    "videoScript": {
        "script": "Script lengkap...",
        "estimatedDuration": "45-60 detik",
        "tips": ["tip1", "tip2"]
    }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Video script saved successfully",
  "data": {
    "script": "...",
    "estimatedDuration": "...",
    "tips": [...]
  }
}
```

#### 4. **Database Models Updated**

-   `/models/Riddle.ts`
-   `/models/Site.ts`
-   `/models/Topic.ts`

**New Field Added:**

```typescript
interface IVideoScript {
    script: string;
    estimatedDuration: string;
    tips: string[];
}

// Added to Riddle, Site, and Topic interfaces
videoScript?: IVideoScript; // Optional field
```

#### 5. **Component: `/components/DownloadSlidesButton.tsx`**

**New Props:**

```typescript
interface DownloadSlidesButtonProps {
    // ... existing props
    contentId?: string; // ID untuk save video script ke database
}
```

**New Features in UI:**

-   Generate Script button dengan loading state
-   Script preview dengan scrollable content
-   Duration indicator
-   Tips section
-   Copy Script button
-   Save to DB button (jika contentId tersedia)

## 🎨 UI/UX

### Video Script Section Location

Section Video Script muncul di bagian bawah modal "Saved Slides", setelah section Download All.

### Visual Design

-   **Icon**: Video icon (purple) untuk identifikasi
-   **Layout**: Collapsible section dengan button "Generate Script"
-   **Script Display**:
    -   Background purple-50
    -   White content box dengan border purple-200
    -   Max height 48 (overflow scroll)
    -   Whitespace preserved untuk line breaks
-   **Tips Display**: Bulleted list dengan purple accent

### User Flow

1. User membuka modal "Saved Slides"
2. User melihat section "Video Script (TikTok/Reels/Shorts)"
3. User click "Generate Script"
4. Loading state ditampilkan
5. Script muncul dengan duration dan tips
6. User bisa:
    - Copy script ke clipboard
    - Save script ke database (jika contentId ada)

## 📝 Script Format

### Generated Script Structure

```
[Visual cue] Hook yang menarik di 3 detik pertama! [action]

Intro singkat tentang topik...

[Cut to visual] Poin pertama dengan penjelasan. [gesture]

[Transition] Poin kedua yang penting... [emphasis]

[Close up] Kesimpulan dan call to action!
```

### Copy Format (When Copied)

```
VIDEO SCRIPT - RIDDLES
Duration: 45-60 detik

[Full script content with visual cues...]

---
TIPS FOR DELIVERY:
1. Tip pertama untuk delivery
2. Tip kedua untuk editing
3. Tip ketiga untuk visual
```

## 🚀 Usage Example

### In Template Page

```tsx
<DownloadSlidesButton
    slides={processedData}
    riddleId={id}
    caption={fetchedData.carouselData.caption}
    hashtags={fetchedData.carouselData.hashtags}
    category={category}
    contentId={id} // Important: untuk save functionality
/>
```

### Generate Script Programmatically

```typescript
import { generateVideoScript } from "@/lib/gemini-video-script-generator";

const scriptData = await generateVideoScript(
    "Caption Instagram yang menarik...",
    [
        {
            tipe_slide: "INTRO",
            judul_slide: "Judul Menarik",
            sub_judul_slide: "Sub judul pendukung",
            konten_slide: "Konten yang singkat dan padat",
        },
        // ... more slides
    ],
    "riddles"
);

console.log(scriptData.script);
console.log(scriptData.estimatedDuration);
console.log(scriptData.tips);
```

## 🔍 Script Generation Logic

### AI Prompt Strategy

1. **Hook First**: 3-5 detik pertama harus menarik perhatian
2. **Natural Flow**: Bahasa casual seperti ngobrol dengan teman
3. **Visual Cues**: Sisipkan [cue] untuk membantu editing
4. **Pace Control**: ~150-160 kata per menit untuk natural delivery
5. **CTA Clear**: Call to action yang jelas di akhir

### Timing Calculation

-   Hook: 3-5 detik
-   Intro: 5-10 detik
-   Konten Utama: 30-50 detik (tergantung jumlah slides)
-   Outro & CTA: 5-10 detik
-   **Total**: 30-90 detik (ideal untuk short-form content)

## 📊 Database Schema

### Before

```typescript
{
  title: String,
  riddle: String,
  solution: String,
  carouselData: {
    slides: [...],
    caption: String,
    hashtags: [String]
  }
}
```

### After

```typescript
{
  title: String,
  riddle: String,
  solution: String,
  carouselData: {
    slides: [...],
    caption: String,
    hashtags: [String]
  },
  videoScript: {  // NEW FIELD
    script: String,
    estimatedDuration: String,
    tips: [String]
  }
}
```

## ⚠️ Error Handling

### Generate Script Errors

-   Invalid input validation
-   Gemini AI errors
-   Network errors
-   JSON parsing errors

### Save Script Errors

-   Missing contentId
-   Invalid category
-   Database connection errors
-   Document not found

## 🎯 Best Practices

### For Content Creators

1. **Review Before Using**: Selalu review script sebelum recording
2. **Customize**: Feel free untuk modify script sesuai style kamu
3. **Practice**: Practice delivery sebelum recording
4. **Visual Planning**: Gunakan visual cues untuk planning shot

### For Developers

1. **Validate Input**: Selalu validate caption dan slides sebelum generate
2. **Handle Errors**: Implement proper error handling
3. **Optimize Prompts**: Adjust AI prompts untuk hasil yang lebih baik
4. **Cache Results**: Consider caching untuk script yang sama

## 🔄 Future Enhancements

1. **Multiple Languages**: Support untuk bahasa lain
2. **Duration Customization**: Allow user pilih durasi (15s, 30s, 60s, 90s)
3. **Style Presets**: Different script styles (formal, casual, comedy, educational)
4. **Voice-over Integration**: Generate dengan voice-over timing
5. **Edit History**: Track script versions
6. **A/B Testing**: Compare script performance

## 📖 Related Documentation

-   [SAVE_SLIDES_FEATURE.md](./SAVE_SLIDES_FEATURE.md) - Save slides feature
-   [FEATURE_DOWNLOAD_SLIDES.md](./FEATURE_DOWNLOAD_SLIDES.md) - Download slides feature
-   [Gemini API Documentation](https://ai.google.dev/docs)

## 🤝 Contributing

Jika ada improvement untuk prompt atau script structure, silakan update file:

-   `/lib/gemini-video-script-generator.ts`

Dan test hasilnya dengan berbagai jenis content (riddles, sites, topics).

---

**Created**: November 2024  
**Last Updated**: November 2024  
**Version**: 1.0.0
