# HD Screenshot - Quick Reference Guide

## 🎯 Problems → Solutions

### ❌ Problem 1: deviceScaleFactor causes overlap bug

```typescript
deviceScaleFactor: 3; // HD quality tapi slide terakhir overlap dengan pertama
```

### ❌ Problem 2: defaultViewport locks browser size

```typescript
defaultViewport: { width: 1920, height: 1080 }
// Container width mismatch, crop fails dengan "bad extract area"
```

### ✅ Solution: Viewport 2x + Sharp upscaling + null defaultViewport

```typescript
// 1. Viewport 2x lebih besar
const captureMultiplier = 2;
const captureSlideWidth = slideWidth * 2; // 864px

// 2. defaultViewport null (allow custom size)
defaultViewport: null;

// 3. deviceScaleFactor tetap 1 (no bugs!)
deviceScaleFactor: (1)

    // 4. Upscale dengan Sharp Lanczos3
    .resize(1080, 1350, {
        kernel: sharp.kernel.lanczos3, // Best quality
    })
    .sharpen({ sigma: 0.5 }); // Enhance details
```

## 📊 Comparison

| Method                 | Quality   | Bugs        | Layout         | Viewport       |
| ---------------------- | --------- | ----------- | -------------- | -------------- |
| deviceScaleFactor: 3   | HD ✅     | Overlap ❌  | Broken ❌      | Fixed ✅       |
| defaultViewport: 1920  | -         | -           | Truncated ❌   | Locked ❌      |
| **Viewport 2x + null** | **HD ✅** | **None ✅** | **Perfect ✅** | **Dynamic ✅** |

## 💡 Why It Works

1. **No browser scaling bugs** - deviceScaleFactor: 1 keeps layout predictable
2. **Dynamic viewport** - defaultViewport: null allows any size (2592px, 6048px, 8640px...)
3. **More pixel data** - 2x viewport = 864x1080 per slide
4. **Better upscaling** - Sharp's Lanczos3 > browser scaling
5. **Enhanced details** - Sharpening compensates upscaling

## 🚀 Quality Pipeline

```
defaultViewport: null → Viewport 2x (864x1080) → Screenshot
    ↓
No size limits → Capture all slides → Crop precisely
    ↓
Sharp Lanczos3 upscale → Light sharpening → JPEG quality 95
    ↓
HD Output (1080x1350) per slide ✨
```

## 📝 Key Changes

```typescript
// OLD: Bug prone & viewport locked
defaultViewport: { width: 1920, height: 1080 }  // ❌ Locks viewport
deviceScaleFactor: 3  // ❌ Causes overlap
const left = i * slideWidth * 3  // ❌ Manual calculation

// NEW: Reliable & dynamic
defaultViewport: null  // ✅ Allow any viewport size
deviceScaleFactor: 1  // ✅ No layout bugs
const captureSlideWidth = slideWidth * 2  // ✅ 2x for quality
const left = i * captureSlideWidth  // ✅ Simple & accurate
```

## 🐛 Error Explanations

### Error 1: Container width mismatch

```
⚠️ Container width mismatch: actual=3024px, expected=6048px
```

**Cause**: `defaultViewport: { width: 1920 }` locks viewport
**Fix**: `defaultViewport: null`

### Error 2: Bad extract area

```
Screenshot error: Error: extract_area: bad extract area
```

**Cause**: Trying to crop outside screenshot bounds
**Fix**: Ensure viewport is large enough (null + correct totalWidth)

### Error 3: Slide overlap

```
Last slide overlaps with first slide
```

**Cause**: `deviceScaleFactor > 1` breaks positioning
**Fix**: `deviceScaleFactor: 1` + viewport 2x

## ✨ Result

**HD quality (1080x1350) tanpa bug overlap & viewport dinamis untuk semua slide counts!**

## 📚 Full Documentation

-   `FIX_HD_SCREENSHOT_WITHOUT_DEVICESCALEFACTOR.md` - deviceScaleFactor fix details
-   `FIX_DEFAULTVIEWPORT_ISSUE.md` - defaultViewport fix details

---

**Last Updated**: October 26, 2025  
**Status**: ✅ PRODUCTION READY
