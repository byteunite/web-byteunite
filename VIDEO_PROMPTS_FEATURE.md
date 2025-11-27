# Video Prompts Feature - AI Video Generation Integration

## 📋 Overview

Fitur baru yang ditambahkan ke `generateVideoScript` function untuk menghasilkan prompt video yang terstruktur dan siap digunakan dengan AI video generators seperti **Veo 3**, **OpenAI Sora**, **Runway**, **Pika**, dll.

## 🎯 Tujuan

1. **Menghasilkan prompt video yang terstruktur per slide** untuk AI video generation
2. **Memastikan setiap video clip tidak terlalu panjang** (3-5 detik per clip)
3. **Menjaga kontinuitas visual** untuk membentuk satu kesatuan cerita yang koheren
4. **Optimasi untuk short-form content** (TikTok, Reels, Shorts)

## 🔧 Technical Changes

### 1. Interface Baru: `VideoPrompt`

```typescript
export interface VideoPrompt {
    slideNumber: number; // Nomor slide yang sesuai
    duration: string; // Durasi video clip (3-5 detik)
    prompt: string; // Prompt detail untuk AI video generator
    visualStyle: string; // Style visual (cinematic, modern, etc)
    cameraMovement: string; // Camera movement (zoom, pan, etc)
    mood: string; // Mood/tone (mysterious, exciting, etc)
}
```

### 2. Update Interface: `VideoScriptSinglePart` & `VideoScriptMultiPart`

Kedua interface sekarang include `videoPrompts: VideoPrompt[]`:

```typescript
export interface VideoScriptSinglePart {
    parts: 1;
    reason: string;
    script: string;
    estimatedDuration: string;
    keyPoints: string[];
    tips: string[];
    videoPrompts: VideoPrompt[]; // ✨ BARU
}

export interface VideoScriptMultiPart {
    parts: 2;
    reason: string;
    part1: {
        script: string;
        estimatedDuration: string;
        keyPoints: string[];
        cliffhanger: string;
        videoPrompts: VideoPrompt[]; // ✨ BARU
    };
    part2: {
        script: string;
        estimatedDuration: string;
        keyPoints: string[];
        connection: string;
        videoPrompts: VideoPrompt[]; // ✨ BARU
    };
    tips: string[];
}
```

### 3. Enhanced Prompt untuk Gemini AI

UserPrompt sekarang include instruksi lengkap untuk generate video prompts:

-   **Struktur per slide**: Setiap slide mendapat video prompt yang spesifik
-   **Duration management**: Setiap clip 3-5 detik
-   **Visual consistency**: Style konsisten di semua clips
-   **Smooth transitions**: Planning untuk seamless flow antar clips
-   **AI-optimized language**: Deskripsi yang clear untuk AI generators

## 📝 Format Video Prompts

### Contoh untuk Riddles/Mystery Content:

```json
{
    "slideNumber": 1,
    "duration": "3 detik",
    "prompt": "Close-up of an ancient mysterious artifact glowing in dim light, camera slowly rotating around it, shadows dancing on stone walls, cinematic lighting with golden hour ambiance",
    "visualStyle": "cinematic mysterious",
    "cameraMovement": "slow orbital rotation",
    "mood": "mysterious and intriguing"
}
```

### Contoh untuk Educational/Sites Content:

```json
{
    "slideNumber": 2,
    "duration": "4 detik",
    "prompt": "Aerial drone shot sweeping over famous historical landmark, golden hour lighting, revealing intricate architectural details, smooth forward movement transitioning to slight tilt down",
    "visualStyle": "documentary cinematic",
    "cameraMovement": "aerial forward tracking with tilt",
    "mood": "awe-inspiring and educational"
}
```

### Contoh untuk Trending Topics:

```json
{
    "slideNumber": 1,
    "duration": "3 detik",
    "prompt": "Fast-paced montage of social media notifications popping up, vibrant neon colors, modern tech aesthetic, quick zoom transitions between smartphone screens showing trending content",
    "visualStyle": "modern vibrant digital",
    "cameraMovement": "quick zoom cuts",
    "mood": "energetic and current"
}
```

## 🎬 How It Works

1. **AI Analysis**: Gemini AI analyze konten slides
2. **Script Generation**: Generate narration script (existing feature)
3. **Video Prompt Generation**: Generate detailed video prompts per slide ✨ **NEW**
4. **Structured Output**: Return JSON dengan script + video prompts

## 📊 Output Structure

### Single Part (1 Part):

```json
{
    "parts": 1,
    "reason": "Konten cukup untuk 1 part...",
    "script": "Narasi lengkap...",
    "estimatedDuration": "30 detik",
    "keyPoints": ["Point 1", "Point 2"],
    "tips": ["Tip 1", "Tip 2"],
    "videoPrompts": [
        {
            "slideNumber": 1,
            "duration": "3 detik",
            "prompt": "Opening scene description...",
            "visualStyle": "cinematic",
            "cameraMovement": "zoom in",
            "mood": "exciting"
        }
        // ... more prompts
    ]
}
```

### Multi-Part (2 Parts):

```json
{
    "parts": 2,
    "reason": "Konten padat butuh 2 part...",
    "part1": {
        "script": "Part 1 script...",
        "estimatedDuration": "30 detik",
        "keyPoints": ["Point 1"],
        "cliffhanger": "Cliffhanger statement...",
        "videoPrompts": [
            // ... prompts untuk Part 1
        ]
    },
    "part2": {
        "script": "Part 2 script...",
        "estimatedDuration": "30 detik",
        "keyPoints": ["Point 2"],
        "connection": "Connection statement...",
        "videoPrompts": [
            // ... prompts untuk Part 2
        ]
    },
    "tips": ["Tip 1", "Tip 2"]
}
```

## 🎯 Key Benefits

### 1. **Ready for AI Video Generation**

-   Prompts siap digunakan dengan Veo 3, Sora, Runway, Pika
-   Format terstruktur dan detail
-   AI-optimized descriptions

### 2. **Visual Cohesion**

-   Consistent style di semua clips
-   Smooth transitions antar scenes
-   Professional storytelling flow

### 3. **Duration Management**

-   Setiap clip 3-5 detik (optimal untuk short-form)
-   Total duration match dengan script
-   No video yang terlalu panjang atau pendek

### 4. **Context-Relevant**

-   Visual 100% support narasi
-   Sesuai dengan kategori content (riddles/sites/topics)
-   Mood progression yang natural

### 5. **Production Ready**

-   Detailed camera movements
-   Lighting & mood specifications
-   Setting & composition guides

## 🚀 Usage Example

```typescript
import { generateVideoScript } from "./lib/gemini-video-script-generator";

const scriptData = await generateVideoScript(
    "Caption Instagram...",
    slidesData,
    "riddles"
);

// Access video prompts
if (scriptData.parts === 1) {
    const videoPrompts = scriptData.videoPrompts;
    // Use prompts with AI video generator
} else {
    const part1Prompts = scriptData.part1.videoPrompts;
    const part2Prompts = scriptData.part2.videoPrompts;
    // Use prompts with AI video generator
}
```

## 🔄 Workflow Integration

1. **Content Creation** → Generate slides
2. **Script Generation** → Call `generateVideoScript()`
3. **Get Video Prompts** → Extract `videoPrompts` from response
4. **AI Video Generation** → Feed prompts ke Veo 3/Sora/Runway
5. **Video Assembly** → Combine generated clips dengan narration
6. **Final Output** → Short-form video siap posting

## 📌 Notes

-   Video prompts disesuaikan dengan kategori content (riddles/sites/topics)
-   Style konsisten untuk maintain brand identity
-   Duration management untuk optimal retention
-   Seamless transitions untuk cohesive storytelling
-   AI-friendly language untuk best generation results

## ✅ Validation

Function sudah include validation untuk memastikan `videoPrompts` selalu ada:

```typescript
if (scriptData.parts === 1) {
    if (!scriptData.videoPrompts) {
        throw new Error("Missing videoPrompts");
    }
} else if (scriptData.parts === 2) {
    if (!scriptData.part1.videoPrompts || !scriptData.part2.videoPrompts) {
        throw new Error("Missing videoPrompts in parts");
    }
}
```

## 🎉 Result

Sekarang `generateVideoScript` tidak hanya menghasilkan script narration, tapi juga **video prompts yang siap digunakan dengan AI video generators** untuk membuat video yang sesuai konteks, terstruktur per slide, dan membentuk satu kesatuan cerita yang koheren! 🚀
