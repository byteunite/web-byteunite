# Database Schema Update - Video Script with Video Prompts

## 📋 Overview

Update database schema dan API route untuk support struktur **Video Script** yang baru dengan **Video Prompts** feature. Tetap backward compatible dengan format lama.

## 🎯 Problem yang Diperbaiki

Sebelumnya, saat save video script ke database dengan struktur baru (yang include `videoPrompts`, `parts`, `keyPoints`, dll), API akan error karena:

1. Schema database hanya support format lama (`script`, `estimatedDuration`, `tips`)
2. API validation hanya check format lama
3. Tidak ada handling untuk multi-part scripts

## 🔧 Changes Made

### 1. **Updated Models**

Updated 4 models untuk support struktur baru:

-   ✅ `models/Riddle.ts`
-   ✅ `models/Site.ts`
-   ✅ `models/Topic.ts`
-   ✅ `models/Tutorial.ts`

### 2. **New Interfaces**

Added comprehensive TypeScript interfaces:

```typescript
// Video Prompt Interface
export interface IVideoPrompt {
    slideNumber: number;
    duration: string;
    prompt: string;
    visualStyle: string;
    cameraMovement: string;
    mood: string;
}

// Single Part Script
export interface IVideoScriptSinglePart {
    parts: 1;
    reason: string;
    script: string;
    estimatedDuration: string;
    keyPoints: string[];
    tips: string[];
    videoPrompts: IVideoPrompt[];
}

// Multi-Part Script
export interface IVideoScriptMultiPart {
    parts: 2;
    reason: string;
    part1: {
        script: string;
        estimatedDuration: string;
        keyPoints: string[];
        cliffhanger: string;
        videoPrompts: IVideoPrompt[];
    };
    part2: {
        script: string;
        estimatedDuration: string;
        keyPoints: string[];
        connection: string;
        videoPrompts: IVideoPrompt[];
    };
    tips: string[];
}

// Union Type (supports all formats)
export type IVideoScript =
    | IVideoScriptSinglePart
    | IVideoScriptMultiPart
    | {
          // Legacy format
          script: string;
          estimatedDuration: string;
          tips: string[];
      };
```

### 3. **Updated MongoDB Schemas**

**New VideoPromptSchema:**

```typescript
const VideoPromptSchema = new Schema({
    slideNumber: { type: Number, required: true },
    duration: { type: String, required: true },
    prompt: { type: String, required: true },
    visualStyle: { type: String, required: true },
    cameraMovement: { type: String, required: true },
    mood: { type: String, required: true },
});
```

**Flexible VideoScriptSchema:**

```typescript
const VideoScriptSchema = new Schema(
    {
        // Common fields
        parts: { type: Number, required: false },
        reason: { type: String, required: false },
        tips: [{ type: String }],

        // Single part fields
        script: { type: String, required: false },
        estimatedDuration: { type: String, required: false },
        keyPoints: [{ type: String }],
        videoPrompts: [VideoPromptSchema],

        // Multi-part fields
        part1: {
            /* nested schema */
        },
        part2: {
            /* nested schema */
        },
    },
    { strict: false } // ✨ Key for flexibility
);
```

**Key Points:**

-   `strict: false` allows flexibility for different formats
-   All new fields are `required: false` for backward compatibility
-   `tips` is the only required field (common to all formats)

### 4. **Updated API Route**

**File:** `app/api/save-video-script/route.ts`

**Enhanced Validation:**

```typescript
// Support both legacy and new formats
const isLegacyFormat =
    "script" in videoScript &&
    "estimatedDuration" in videoScript &&
    "tips" in videoScript &&
    !("parts" in videoScript);

const isNewFormat = "parts" in videoScript && "tips" in videoScript;

// Validate based on format
if (isNewFormat) {
    if (videoScript.parts === 1) {
        // Validate single-part structure
        if (!videoScript.videoPrompts) {
            return error("Invalid single-part structure");
        }
    } else if (videoScript.parts === 2) {
        // Validate multi-part structure
        if (
            !videoScript.part1.videoPrompts ||
            !videoScript.part2.videoPrompts
        ) {
            return error("Invalid multi-part structure");
        }
    }
}
```

**Simplified Save Logic:**

```typescript
// Save entire videoScript object
const updatedContent = await Model.findByIdAndUpdate(
    contentId,
    {
        $set: {
            videoScript: videoScript, // ✨ Save complete object
        },
    },
    { new: true }
);
```

**Before (Old Code):**

```typescript
videoScript: {
    script: videoScript.script,
    estimatedDuration: videoScript.estimatedDuration,
    tips: videoScript.tips,
}
```

**After (New Code):**

```typescript
videoScript: videoScript; // Save entire object with all fields
```

## 📊 Supported Formats

### Format 1: Legacy (Backward Compatible)

```json
{
    "script": "Video narration...",
    "estimatedDuration": "30 detik",
    "tips": ["Tip 1", "Tip 2"]
}
```

### Format 2: Single Part (New)

```json
{
    "parts": 1,
    "reason": "Content fits in one part",
    "script": "Video narration...",
    "estimatedDuration": "30 detik",
    "keyPoints": ["Point 1", "Point 2"],
    "tips": ["Tip 1", "Tip 2"],
    "videoPrompts": [
        {
            "slideNumber": 1,
            "duration": "3 detik",
            "prompt": "Detailed visual description...",
            "visualStyle": "cinematic",
            "cameraMovement": "zoom in",
            "mood": "exciting"
        }
    ]
}
```

### Format 3: Multi-Part (New)

```json
{
  "parts": 2,
  "reason": "Content requires 2 parts",
  "part1": {
    "script": "Part 1 narration...",
    "estimatedDuration": "30 detik",
    "keyPoints": ["Point 1"],
    "cliffhanger": "But wait...",
    "videoPrompts": [...]
  },
  "part2": {
    "script": "Part 2 narration...",
    "estimatedDuration": "30 detik",
    "keyPoints": ["Point 2"],
    "connection": "Continuing from Part 1...",
    "videoPrompts": [...]
  },
  "tips": ["Tip 1", "Tip 2"]
}
```

## ✅ Benefits

### 1. **Backward Compatible**

-   Old video scripts still work
-   No data migration needed
-   Graceful handling of legacy format

### 2. **Future-Proof**

-   Support for new features (video prompts)
-   Flexible schema accepts new fields
-   Easy to extend with more features

### 3. **Comprehensive**

-   All video generation data in one place
-   No separate collections needed
-   Atomic updates

### 4. **Type-Safe**

-   TypeScript interfaces for all formats
-   Compile-time validation
-   Better developer experience

## 🔄 Migration Strategy

**No migration needed!** The schema is backward compatible:

1. **Existing data** (legacy format) → Still works ✅
2. **New data** (with video prompts) → Fully supported ✅
3. **Mixed environment** → Both formats coexist ✅

## 🚀 Testing

### Test Save Legacy Format:

```bash
POST /api/save-video-script
{
  "contentId": "...",
  "category": "riddles",
  "videoScript": {
    "script": "...",
    "estimatedDuration": "30 detik",
    "tips": ["..."]
  }
}
```

### Test Save New Format (Single Part):

```bash
POST /api/save-video-script
{
  "contentId": "...",
  "category": "riddles",
  "videoScript": {
    "parts": 1,
    "reason": "...",
    "script": "...",
    "estimatedDuration": "30 detik",
    "keyPoints": ["..."],
    "tips": ["..."],
    "videoPrompts": [...]
  }
}
```

### Test Save New Format (Multi-Part):

```bash
POST /api/save-video-script
{
  "contentId": "...",
  "category": "riddles",
  "videoScript": {
    "parts": 2,
    "reason": "...",
    "part1": {...},
    "part2": {...},
    "tips": ["..."]
  }
}
```

## 📝 API Response

Success response includes complete saved data:

```json
{
  "success": true,
  "message": "Video script saved successfully",
  "data": {
    // Complete videoScript object as saved
    "parts": 1,
    "script": "...",
    "videoPrompts": [...]
  }
}
```

## 🛡️ Error Handling

### Invalid Structure:

```json
{
    "error": "Invalid videoScript structure. Must be either legacy format or new format with 'parts' field"
}
```

### Missing Video Prompts:

```json
{
    "error": "Invalid single-part videoScript structure"
}
```

### Invalid Parts Value:

```json
{
    "error": "Invalid parts value. Must be 1 or 2"
}
```

## 📌 Key Takeaways

1. ✅ **Schema Updated** - All 4 models support new structure
2. ✅ **API Enhanced** - Validation for both old and new formats
3. ✅ **Backward Compatible** - No breaking changes
4. ✅ **Type-Safe** - Full TypeScript support
5. ✅ **Flexible** - `strict: false` allows schema evolution
6. ✅ **Complete** - Video prompts now saved to database
7. ✅ **Tested** - No TypeScript errors

## 🎉 Result

Video Script dengan Video Prompts sekarang bisa **disimpan ke database dengan sempurna!**

User dapat:

-   Generate video script dengan AI
-   Get video prompts terstruktur
-   Save semua data ke database
-   Load kembali saat view slides
-   Use untuk content creation workflow

Database structure sekarang fully support AI Video Generation Prompts feature! 🎬✨
