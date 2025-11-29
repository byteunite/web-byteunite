# AI Video Slides Conversion System

Sistem otomatis untuk mengkonversi carousel slides menjadi video slides yang dioptimalkan untuk format vertical video (TikTok/Reels/Shorts) dengan narrator.

## 🎯 Overview

### Flow Diagram

```
Carousel Slides (Instagram Format)
         ↓
   AI Conversion
         ↓
Video Slides (TikTok/Reels Format)
         ↓
   Save to Database
         ↓
Display in /template-video/[id]
```

## 🚀 Usage

### 1. Default Mode (Mock Data)

```
/template-video/[id]
```

Menggunakan mock data untuk preview cepat.

### 2. AI Conversion Mode

```
/template-video/[id]?useAI=true
```

Mengaktifkan AI untuk mengkonversi carousel slides → video slides.

### 3. With Category

```
/template-video/[id]?data=riddles&useAI=true
/template-video/[id]?data=sites&useAI=true
/template-video/[id]?data=topics&useAI=true
/template-video/[id]?data=tutorials&useAI=true
```

## 🔄 Conversion Process

### Step 1: Fetch Carousel Data

System mengambil data dari API yang sama dengan `/template/[id]`:

-   `/api/riddles/[id]`
-   `/api/sites/[id]`
-   `/api/topics/[id]`
-   `/api/tutorials/[id]`

### Step 2: Check Existing Video Slides

```typescript
if (fetchedData.videoSlides && fetchedData.videoSlides.length > 0) {
    // Use existing video slides from database
    return fetchedData.videoSlides;
}
```

### Step 3: AI Conversion (if useAI=true)

```typescript
const conversionResult = await convertCarouselToVideoSlides(
    carouselSlides,
    category,
    contentId
);
```

AI akan:

1. Analyze carousel slides content
2. Identify content type (riddle, tutorial, facts, etc)
3. Simplify text untuk video format
4. Map ke appropriate video slide types
5. Ensure proper structure (COVER → content → CLOSING)

### Step 4: Save to Database

```typescript
// Automatically saves if conversion successful
POST /api/[category]/[id]/video-slides
{
    "videoSlides": [...]
}
```

## 📊 Data Flow

### Input: Carousel Slides

```json
{
    "carouselData": {
        "slides": [
            {
                "tipe_slide": "COVER",
                "judul_slide": "Teka-Teki Logika #123",
                "sub_judul_slide": "Bisakah kamu menjawabnya?",
                "konten_slide": "Swipe untuk mulai →",
                "prompt_untuk_image": "puzzle illustration"
            },
            {
                "tipe_slide": "MISTERI",
                "judul_slide": "Pertanyaan",
                "sub_judul_slide": "Aku punya kunci tapi tidak bisa membuka pintu. Apa aku?",
                "konten_slide": "Pikirkan baik-baik..."
            }
            // ... more slides
        ]
    }
}
```

### Output: Video Slides

```json
{
    "videoSlides": [
        {
            "tipe_slide": "VIDEO_COVER",
            "judul_slide": "Teka-Teki Logika",
            "sub_judul_slide": "Bisakah kamu menjawab?"
        },
        {
            "tipe_slide": "VIDEO_QUESTION",
            "judul_slide": "Aku punya kunci tapi tidak bisa membuka pintu",
            "konten_slide": "Apa aku?"
        },
        {
            "tipe_slide": "VIDEO_TRANSITION",
            "judul_slide": "Pikirkan dulu...",
            "sub_judul_slide": "🤔"
        },
        {
            "tipe_slide": "VIDEO_ANSWER",
            "judul_slide": "Piano!",
            "sub_judul_slide": "JAWABAN",
            "konten_slide": "Piano punya kunci (keys) tapi tidak membuka pintu"
        },
        {
            "tipe_slide": "VIDEO_CLOSING",
            "judul_slide": "Mudah kan?",
            "sub_judul_slide": "Follow untuk teka-teki lainnya",
            "konten_slide": "Comment jawabanmu!"
        }
    ]
}
```

## 🤖 AI Conversion Rules

### Text Simplification

-   **Before**: "Teka-Teki Logika #123 - Episode Spesial Minggu Ini"
-   **After**: "Teka-Teki Logika"

-   **Before**: "Aku punya kunci tapi tidak bisa membuka pintu manapun. Aku juga punya ruang tapi tidak ada dinding. Apa aku?"
-   **After**: "Aku punya kunci tapi tidak bisa membuka pintu. Apa aku?"

### Slide Type Mapping

| Carousel Type | Video Type     | Logic              |
| ------------- | -------------- | ------------------ |
| COVER         | VIDEO_COVER    | Always first slide |
| MISTERI       | VIDEO_QUESTION | Question format    |
| SOLUSI        | VIDEO_ANSWER   | Answer reveal      |
| CLOSING       | VIDEO_CLOSING  | Always last slide  |
| INTRO         | VIDEO_COVER    | Opening content    |
| POIN_UTAMA    | VIDEO_POINT    | Key points         |
| LIST          | VIDEO_LIST     | Multiple items     |
| FAKTA         | VIDEO_POINT    | Facts/stats        |
| TIPS          | VIDEO_LIST     | Tips collection    |
| KESIMPULAN    | VIDEO_CLOSING  | Summary/CTA        |

### Content Optimization

1. **Remove verbose text** - Keep only essential message
2. **Split long content** - Create multiple slides if needed
3. **Add transitions** - Insert pause slides between sections
4. **Ensure pacing** - Balance content density
5. **Strong CTA** - Always end with engaging closing

## 📁 Database Schema Update

Add to your Mongoose models:

```typescript
// models/Riddle.ts, Site.ts, Topic.ts, Tutorial.ts
{
  videoSlides: [{
    tipe_slide: {
      type: String,
      enum: [
        'VIDEO_COVER',
        'VIDEO_POINT',
        'VIDEO_QUESTION',
        'VIDEO_ANSWER',
        'VIDEO_LIST',
        'VIDEO_QUOTE',
        'VIDEO_TRANSITION',
        'VIDEO_CLOSING'
      ]
    },
    judul_slide: String,
    sub_judul_slide: String,
    konten_slide: String,
    list_items: [String],
    background_color: String,
    text_color: String
  }],
  videoSlidesUpdatedAt: Date
}
```

## 🔧 Configuration

### Environment Variables

```env
# Gemini API Key (for AI conversion)
GEMINI_API_KEY=your-gemini-api-key-here
```

### AI Model Selection

Edit `lib/gemini-video-slides-converter.ts`:

```typescript
// Gemini 2.0 Flash (recommended - fast and good quality)
model: "gemini-2.0-flash-exp";

// Gemini 2.5 Flash (alternative)
model: "gemini-2.5-flash";

// Gemini Pro (best quality, slower)
model: "gemini-pro";
```

## 📊 API Endpoints

### Save Video Slides

```
POST /api/riddles/[id]/video-slides
POST /api/sites/[id]/video-slides
POST /api/topics/[id]/video-slides
POST /api/tutorials/[id]/video-slides

Body:
{
  "videoSlides": [...]
}

Response:
{
  "success": true,
  "message": "Video slides saved successfully",
  "data": {
    "id": "...",
    "videoSlidesCount": 5
  }
}
```

### Get Video Slides

```
GET /api/riddles/[id]/video-slides
GET /api/sites/[id]/video-slides
GET /api/topics/[id]/video-slides
GET /api/tutorials/[id]/video-slides

Response:
{
  "success": true,
  "data": {
    "videoSlides": [...],
    "updatedAt": "2025-11-29T..."
  }
}
```

## 🎬 Complete Workflow Example

### Step-by-Step Usage:

1. **Create Carousel Content** (existing process)

    ```
    POST /api/riddles
    → Creates riddle with carouselData
    ```

2. **Generate Video Slides** (new feature)

    ```
    Visit: /template-video/[riddleId]?useAI=true
    → AI converts carousel → video slides
    → Auto-saves to database
    ```

3. **View Result**

    ```
    Visit: /template-video/[riddleId]
    → Shows video slides from database
    → Ready for video production
    ```

4. **Update if Needed**
    ```
    Visit: /template-video/[riddleId]?useAI=true
    → Regenerates video slides
    → Updates database
    ```

## 🔍 Debugging

### Check Data Source

Look for console logs:

```
📊 Data source: database, Slides count: 5
📊 Data source: ai-generated, Slides count: 6
📊 Data source: mock, Slides count: 5
```

### Check AI Conversion

```
Converting carousel slides to video slides using AI...
✅ AI Conversion successful: 5 slides generated
✅ Video slides saved to database
```

### Error Handling

```
AI conversion failed, falling back to mock data: [error]
Using mock data as fallback
```

## 💡 Tips for Best Results

### For AI Conversion:

1. **Quality carousel content** = Quality video slides
2. **Clear structure** in carousel helps AI understand
3. **Consistent naming** in slide types
4. **Review AI output** before production use

### For Manual Editing:

After AI generation, you can manually edit via database if needed:

```typescript
// Update specific slide
db.riddles.updateOne(
    { _id: ObjectId("...") },
    { $set: { "videoSlides.0.judul_slide": "New Title" } }
);
```

## 🚀 Future Enhancements

-   [ ] Batch conversion for multiple content
-   [ ] A/B testing different video slides versions
-   [ ] Analytics on video slide performance
-   [ ] Auto-generate video with slides + narrator audio
-   [ ] Custom AI prompts per category
-   [ ] Preview before save option
-   [ ] Version history for video slides

## 📞 Troubleshooting

### Issue: AI conversion not working

**Solution**: Check GEMINI_API_KEY in environment variables

### Issue: Video slides not saving

**Solution**: Check database connection and model schema

### Issue: Using mock data instead of real data

**Solution**: Add `?useAI=true` parameter to URL

### Issue: Conversion result not optimal

**Solution**: Review carousel content structure, may need manual refinement

---

## 💰 Cost Estimation (Gemini API)

### Gemini 2.0 Flash (Recommended)

-   **FREE TIER**: 1,500 requests per day
-   **Paid Tier**: ~$0.001 per conversion
-   **Best value for this feature**

### Why Gemini over OpenAI?

1. **Free tier available** - Perfect for development and moderate production use
2. **Lower cost** - ~40x cheaper than GPT-4 on paid tier
3. **Fast response** - Comparable speed to GPT-3.5 Turbo
4. **Good quality** - Excellent for structured JSON output
5. **Consistent with codebase** - Already using Gemini elsewhere

### Cost Comparison:

| Provider         | Free Tier    | Paid Cost/Conversion |
| ---------------- | ------------ | -------------------- |
| Gemini 2.0 Flash | ✅ 1,500/day | $0.001               |
| Gemini 2.5 Flash | ✅ 1,500/day | $0.0015              |
| Gemini Pro       | ✅ 50/day    | $0.005               |
| GPT-3.5 Turbo    | ❌           | $0.003               |
| GPT-4 Turbo      | ❌           | $0.04                |

### Optimization Tips:

-   Cache results in database (✅ already implemented)
-   Use free tier for development and light production
-   Batch process during off-peak if hitting rate limits
-   Monitor usage in Google AI Studio

---
