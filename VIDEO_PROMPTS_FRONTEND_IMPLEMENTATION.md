# Video Prompts Frontend Implementation

## 📋 Overview

Frontend implementation untuk menampilkan **AI Video Generation Prompts** di modal "Saved Slides" (`DownloadSlidesButton.tsx`). User dapat melihat, copy, dan menggunakan video prompts yang telah di-generate untuk AI video generators seperti Veo 3, Sora, Runway, dll.

## 🎯 Fitur yang Ditambahkan

### 1. **Video Prompts Display Section**

-   Tampilan terstruktur untuk video prompts per clip/slide
-   Support untuk single-part dan multi-part scripts
-   Collapsible section untuk menghemat space
-   Visual badges untuk style, camera movement, dan mood

### 2. **Copy Functionality**

-   **Individual Copy**: Copy setiap video prompt satu per satu
-   **Copy All**: Copy semua video prompts sekaligus dalam format terstruktur
-   Visual feedback dengan checkmark saat berhasil copy

### 3. **Visual Design**

-   Gradient background untuk section video prompts
-   Color-coded badges untuk metadata (style, camera, mood)
-   Distinct styling untuk Part 1 (purple) dan Part 2 (pink)
-   Responsive dan mobile-friendly

## 🔧 Technical Implementation

### New Imports

```typescript
import type {
    VideoScriptData,
    LegacyVideoScriptData,
    VideoPrompt, // ✨ NEW
} from "@/lib/gemini-video-script-generator";
```

### New State Variables

```typescript
const [copiedVideoPrompt, setCopiedVideoPrompt] = useState<number | null>(null);
const [showVideoPrompts, setShowVideoPrompts] = useState(false);
const [copiedFullScript, setCopiedFullScript] = useState(false);
```

### New Functions

#### 1. `copyVideoPrompt(prompt: VideoPrompt, index: number)`

Copy individual video prompt dengan format terstruktur:

```
VIDEO PROMPT - Slide X
Duration: X detik
Visual Style: ...
Camera Movement: ...
Mood: ...

PROMPT:
[detailed prompt text]
```

#### 2. `copyAllVideoPrompts()`

Copy semua video prompts:

-   **Single Part**: List semua clips dengan detail lengkap
-   **Multi-Part**: Grouped by Part 1 dan Part 2

### Backward Compatibility

Updated untuk support legacy format tanpa `videoPrompts`:

```typescript
videoPrompts: [], // Empty array untuk legacy format
```

## 🎨 UI Components

### Video Prompts Section Structure

```
┌─────────────────────────────────────────────────┐
│ 🎥 AI Video Generation Prompts [Show/Hide]      │
│ Badge: Veo 3 / Sora / Runway                    │
│ Description: Prompt terstruktur per slide...    │
├─────────────────────────────────────────────────┤
│ [Collapsible Content]                           │
│                                                 │
│ ┌─ Clip 1 - Slide X • Duration ───────[Copy]┐  │
│ │ 📸 Style  🎥 Camera  ✨ Mood              │  │
│ │ [Detailed prompt text in gray box]         │  │
│ └────────────────────────────────────────────┘  │
│                                                 │
│ ┌─ Clip 2 - Slide Y • Duration ───────[Copy]┐  │
│ │ 📸 Style  🎥 Camera  ✨ Mood              │  │
│ │ [Detailed prompt text in gray box]         │  │
│ └────────────────────────────────────────────┘  │
│                                                 │
│ [Copy All Video Prompts Button]                │
└─────────────────────────────────────────────────┘
```

### For Multi-Part Scripts

```
Part 1 Section (Purple themed):
┌─ PART 1 PROMPTS (X clips) ──────────────┐
│ Clip 1, Clip 2, Clip 3...              │
└─────────────────────────────────────────┘

Part 2 Section (Pink themed):
┌─ PART 2 PROMPTS (X clips) ──────────────┐
│ Clip 1, Clip 2, Clip 3...              │
└─────────────────────────────────────────┘
```

## 📝 UI Elements Detail

### Header Badge

```tsx
<span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
    Veo 3 / Sora / Runway
</span>
```

### Metadata Badges

```tsx
📸 Visual Style    (Purple badge)
🎥 Camera Movement (Orange badge)
✨ Mood            (Pink badge)
```

### Clip Counter

```tsx
<span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded">
    Clip X
</span>
```

### Conditional Rendering

Video prompts section hanya muncul jika:

-   Single Part: `videoScript.videoPrompts.length > 0`
-   Multi-Part: `part1.videoPrompts.length > 0` OR `part2.videoPrompts.length > 0`

## 🎯 User Flow

1. **Generate Video Script** → Click "Generate Script" button
2. **View Script** → Script narration ditampilkan
3. **Expand Video Prompts** → Click "Show Prompts" button
4. **Browse Prompts** → Scroll through all video clips
5. **Copy Individual** → Click copy button pada clip tertentu
6. **Or Copy All** → Click "Copy All Video Prompts" button
7. **Use in AI Generator** → Paste prompt ke Veo 3/Sora/Runway

## 💡 Key Features

### 1. **Collapsible Section**

Default collapsed untuk save space, expandable on demand:

```tsx
<Button onClick={() => setShowVideoPrompts(!showVideoPrompts)}>
    {showVideoPrompts ? "Hide" : "Show"} Prompts
</Button>
```

### 2. **Visual Feedback**

Checkmark animation saat copy berhasil:

```tsx
{
    copiedVideoPrompt === index ? (
        <Check className="h-3 w-3 text-green-600" />
    ) : (
        <Copy className="h-3 w-3" />
    );
}
```

### 3. **Color-Coded Parts**

-   **Part 1**: Purple theme (`border-purple-300`, `bg-purple-600`)
-   **Part 2**: Pink theme (`border-pink-300`, `bg-pink-600`)

### 4. **Responsive Design**

-   Flex layout untuk metadata badges
-   Scrollable prompt text area
-   Mobile-friendly sizing

## 🔄 Integration with Backend

Video prompts automatically generated dan included dalam response dari:

```
POST /api/generate-video-script
```

Response structure:

```json
{
    "data": {
        "parts": 1,
        "videoPrompts": [
            {
                "slideNumber": 1,
                "duration": "3 detik",
                "prompt": "...",
                "visualStyle": "cinematic",
                "cameraMovement": "zoom in",
                "mood": "exciting"
            }
        ]
    }
}
```

## 📊 State Management

```typescript
// Show/hide video prompts section
const [showVideoPrompts, setShowVideoPrompts] = useState(false);

// Track which prompt is copied (for individual copy feedback)
const [copiedVideoPrompt, setCopiedVideoPrompt] = useState<number | null>(null);

// Track copy all prompts action
const [copiedScript, setCopiedScript] = useState(false);
```

## 🎨 Styling Highlights

### Gradient Background

```tsx
className =
    "bg-linear-to-r from-blue-50 to-purple-50 p-3 rounded border-2 border-blue-200";
```

### Badge Styles

```tsx
// Visual Style
className = "text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded";

// Camera Movement
className = "text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded";

// Mood
className = "text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded";
```

### Prompt Text Area

```tsx
className =
    "text-xs text-gray-700 leading-relaxed bg-gray-50 p-2 rounded border border-gray-200";
```

## ✅ Validation & Error Handling

-   **Empty Check**: Section tidak muncul jika `videoPrompts` array kosong
-   **Legacy Support**: Backward compatible dengan format lama (empty array)
-   **Copy Error**: Try-catch untuk handle clipboard API errors
-   **TypeScript**: Strict typing untuk `VideoPrompt` interface

## 🚀 Usage Example

### Developer Workflow:

1. User generate slides
2. Click "Generate Script"
3. AI creates script + video prompts
4. Frontend displays both in modal
5. User can:
    - Read script for narration
    - Copy clean narration for prompter
    - View video prompts for AI generation
    - Copy individual prompts untuk specific clips
    - Copy all prompts untuk batch generation

### Content Creator Workflow:

1. Generate content slides
2. Get video script untuk narration
3. Get video prompts untuk visual generation
4. Input prompts ke Veo 3 / Sora / Runway
5. Combine generated videos dengan narration
6. Export final short-form content

## 📌 Notes

-   Video prompts disesuaikan dengan kategori (riddles/sites/topics)
-   Duration per clip: 3-5 detik (optimal untuk retention)
-   Visual style konsisten untuk brand cohesion
-   Seamless transitions antar clips
-   AI-optimized language untuk best generation results

## 🎉 Result

Frontend sekarang fully support AI Video Generation Prompts dengan:

-   ✅ Beautiful, intuitive UI
-   ✅ Easy copy functionality (individual & bulk)
-   ✅ Clear visual hierarchy
-   ✅ Support single & multi-part scripts
-   ✅ Color-coded metadata badges
-   ✅ Responsive design
-   ✅ Smooth user experience
-   ✅ TypeScript type-safe
-   ✅ Backward compatible

User dapat langsung copy prompts dan menggunakannya dengan AI video generators untuk create engaging short-form content! 🎬✨
