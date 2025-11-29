# Update Screenshot APIs - slideType Support

## Overview

Updated all screenshot APIs (`screenshot-full` and `save-slide-single`) across all 4 categories (topics, riddles, sites, tutorials) to support both **carousel slides** and **video slides**.

## What Changed

### 1. API Parameters

Both APIs now accept an optional `slideType` parameter:

```typescript
{
  slideType?: "carousel" | "video" // Default: "carousel"
}
```

### 2. Screenshot Full API (`/api/[category]/screenshot-full`)

#### Updated Features:

-   **Template Path**: Automatically routes to `/template/` or `/template-video/` based on `slideType`
-   **Viewport Dimensions**:
    -   Carousel: 432x540px (4:5 ratio) → 1080x1350px final
    -   Video: 432x768px (9:16 ratio) → 1080x1920px final
-   **Target Resize**:
    -   Carousel: 1080x1350 (Instagram Story)
    -   Video: 1080x1920 (TikTok/Reels/Shorts)
-   **Response**: Includes `slideType` and dynamic `dimensions` in response

#### Request Example:

```typescript
POST /api/topics/screenshot-full
{
  "topicId": "123",
  "totalSlides": 5,
  "slideType": "video" // "carousel" or "video"
}
```

#### Response Example:

```json
{
  "success": true,
  "totalSlides": 5,
  "slideType": "video",
  "slides": [...],
  "dimensions": {
    "width": 1080,
    "height": 1920
  },
  "metadata": {...}
}
```

### 3. Save Slide Single API (`/api/[category]/save-slide-single`)

#### Updated Features:

-   **Database Save**: Saves to `carouselData.slides` or `videoSlides` based on `slideType`
-   **Folder Structure**: Uploads to `/[category]/[id]/carousel-slides/` or `/[category]/[id]/video-slides/`
-   **Field Update**: Updates `saved_slide_url` in the correct slides array

#### Request Example:

```typescript
POST /api/topics/save-slide-single
{
  "topicId": "123",
  "slideIndex": 0,
  "dataUrl": "data:image/jpeg;base64,...",
  "slideType": "video" // "carousel" or "video"
}
```

#### Response Example:

```json
{
    "success": true,
    "message": "Slide 1/5 saved successfully",
    "imageUrl": "https://imagekit.io/.../video-slides/topic-123-slide-0.jpg"
}
```

## Technical Details

### Viewport & Dimensions

#### Carousel Slides (4:5 ratio):

-   Base: 432x540px
-   Scale: 2.5x
-   Actual render: 864x1080 (Vercel 2x) or 1080x1350 (Local 2.5x)
-   Final resize: 1080x1350px

#### Video Slides (9:16 ratio):

-   Base: 432x768px
-   Scale: 2.5x
-   Actual render: 864x1536 (Vercel 2x) or 1080x1920 (Local 2.5x)
-   Final resize: 1080x1920px

### Quality Settings

-   **Puppeteer deviceScaleFactor**: 2 (Vercel) / 2.5 (Local)
-   **Sharp Resize**: Lanczos3 algorithm
-   **JPEG Quality**: 98 with mozjpeg compression
-   **Sharpening**: Adaptive based on resize ratio

## Files Modified

### Screenshot Full APIs (4 files):

1. `/app/api/topics/screenshot-full/route.ts`
2. `/app/api/riddles/screenshot-full/route.ts`
3. `/app/api/sites/screenshot-full/route.ts`
4. `/app/api/tutorials/screenshot-full/route.ts`

### Save Slide Single APIs (4 files):

1. `/app/api/topics/save-slide-single/route.ts`
2. `/app/api/riddles/save-slide-single/route.ts`
3. `/app/api/sites/save-slide-single/route.ts`
4. `/app/api/tutorials/save-slide-single/route.ts`

## Usage in Components

### SaveSlidesButton Component

To use with video slides, pass `slideType` parameter:

```typescript
const handleSaveAllSlides = async () => {
    // Determine slideType based on current page
    const slideType = window.location.pathname.includes("template-video")
        ? "video"
        : "carousel";

    // 1. Capture full screenshot
    const screenshotResponse = await fetch(`/api/${category}/screenshot-full`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            [`${category}Id`]: id,
            totalSlides: slides.length,
            slideType, // Pass slideType here
        }),
    });

    // 2. Save individual slides
    for (const slide of screenshotData.slides) {
        await fetch(`/api/${category}/save-slide-single`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                [`${category}Id`]: id,
                slideIndex: slide.slideIndex,
                dataUrl: slide.dataUrl,
                slideType, // Pass slideType here
            }),
        });
    }
};
```

## Backward Compatibility

✅ **Fully backward compatible!**

-   Default `slideType` is `"carousel"`
-   Existing code without `slideType` parameter will continue to work for carousel slides
-   No breaking changes to existing functionality

## Next Steps

-   [ ] Update `SaveSlidesButton` component to auto-detect slideType
-   [ ] Test screenshot quality for video slides
-   [ ] Verify ImageKit folder structure
-   [ ] Test on Vercel deployment

## Related Files

-   See `SAVE_SLIDES_FEATURE.md` for SaveSlidesButton implementation
-   See `IMPLEMENTATION_DYNAMIC_TEMPLATE.md` for video template structure
-   See `PUPPETEER_SCREENSHOT_SOLUTION.md` for screenshot technical details
