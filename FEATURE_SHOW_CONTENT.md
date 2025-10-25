# Feature: Show Content Button - Instagram-Style Modal

## 📝 Overview

Fitur baru yang menampilkan button "Show Content" untuk membuka modal yang menampilkan:

-   **Carousel/Slider** dari semua slide yang tersimpan
-   **Caption** Instagram dengan tombol copy
-   **Hashtags** dengan tombol copy
-   **Download All Slides** button

Modal ini mirip dengan Instagram Post Detail view, memberikan pengalaman yang familiar dan intuitif.

## 🎯 Requirements

✅ **Button Display Logic:**

-   Button hanya muncul jika SEMUA slide memiliki `saved_slide_url`
-   Button ditempatkan di fixed position (mirip SaveSlidesButton dan DownloadSlidesButton)

✅ **Modal Features:**

-   Instagram-style layout dengan 2 kolom (mobile: 1 kolom)
-   Carousel/slider untuk navigasi antar slide
-   Display caption dan hashtags
-   Copy buttons untuk caption dan hashtags
-   Download all slides button

## 📦 Components Created

### `components/ShowContentButton.tsx`

Component baru yang menampilkan:

#### Props Interface:

```typescript
interface ShowContentButtonProps {
    slides: Slide[];
    caption: string;
    hashtags: string[];
    riddleId: string;
}
```

#### Features:

1. **Smart Display Logic**

    - Button hanya muncul jika `allSlidesSaved = true`
    - Check dilakukan dengan: `slides.every(slide => slide.saved_slide_url)`

2. **Carousel/Slider**

    - Navigation dengan arrow buttons (ChevronLeft/ChevronRight)
    - Keyboard navigation (Arrow Left/Right keys)
    - Slide indicators (dots) di bawah carousel
    - Slide counter (e.g., "1 / 5")
    - Aspect ratio 3:4 (portrait) untuk slides

3. **Caption Section**

    - Menampilkan caption lengkap dalam text box
    - Max height dengan scroll jika terlalu panjang
    - Copy button dengan feedback "Copied!" (2 detik)

4. **Hashtags Section**

    - Menampilkan hashtags sebagai badges
    - Auto-format dengan prefix "#"
    - Copy button yang meng-copy semua hashtags sekaligus
    - Format: `#tag1 #tag2 #tag3`

5. **Download All Slides**

    - Button untuk download semua slide sekaligus
    - Progress indication saat download
    - Delay 500ms antar download (browser-friendly)
    - Filename format: `riddle-{riddleId}-slide-{number}.png`

6. **Current Slide Info**
    - Display info slide yang sedang ditampilkan
    - Menampilkan: Type, Title, Subtitle

## 🎨 Visual Layout

### Button Position

```
┌──────────────────────────────────────┐
│                                      │
│         Template Content             │
│                                      │
│                                      │
│                          [Show       │
│                           Content]   │  <- Fixed bottom-right
└──────────────────────────────────────┘
```

### Modal Layout (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│  Instagram Post Content                           [X]   │
│  View slides, caption, and hashtags                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │                     │  │  Caption            [Copy]│ │
│  │   [<] SLIDE 1 [>]   │  │  ┌───────────────────┐  │ │
│  │                     │  │  │ Lorem ipsum...    │  │ │
│  │                     │  │  │                   │  │ │
│  │    1 / 5            │  │  └───────────────────┘  │ │
│  │                     │  │                          │ │
│  └─────────────────────┘  │  Hashtags          [Copy]│ │
│  [○][○][●][○][○]         │  #tag1 #tag2 #tag3      │ │
│                           │                          │ │
│  [Download All (5)]       │  Current Slide Info      │ │
│                           │  Type: COVER             │ │
│                           │  Title: ...              │ │
│  └─────────────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Modal Layout (Mobile)

```
┌─────────────────────────┐
│  Post Content     [X]   │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │  [<] SLIDE [>]    │  │
│  │                   │  │
│  │     1 / 5         │  │
│  └───────────────────┘  │
│  [○][●][○][○][○]       │
│  [Download All (5)]     │
│                         │
│  Caption          [Copy]│
│  ┌───────────────────┐  │
│  │ Lorem ipsum...    │  │
│  └───────────────────┘  │
│                         │
│  Hashtags         [Copy]│
│  #tag1 #tag2 #tag3      │
└─────────────────────────┘
```

## 🔧 Implementation Details

### File Changes

#### 1. New Component: `components/ShowContentButton.tsx`

-   Client-side component (use client)
-   Uses shadcn/ui components (Button, Dialog)
-   State management for carousel, downloads, copy feedback
-   Keyboard navigation support

#### 2. Updated: `app/(template-post)/template/[id]/page.tsx`

-   Import ShowContentButton
-   Add component below DownloadSlidesButton
-   Pass props: slides, caption, hashtags, riddleId
-   Conditional rendering: `!isScreenshotMode`

### Component States

| State               | Type    | Purpose                       |
| ------------------- | ------- | ----------------------------- |
| `isOpen`            | boolean | Modal visibility              |
| `currentSlideIndex` | number  | Current slide in carousel     |
| `downloadingAll`    | boolean | Track batch download progress |
| `copiedCaption`     | boolean | Copy feedback for caption     |
| `copiedHashtags`    | boolean | Copy feedback for hashtags    |

### Key Functions

#### `handlePrevSlide()`

Navigate to previous slide (wraps around to last)

#### `handleNextSlide()`

Navigate to next slide (wraps around to first)

#### `handleKeyDown(e)`

Handle keyboard navigation (Arrow Left/Right)

#### `downloadImage(url, filename)`

Download single image from URL

#### `downloadAllSlides()`

Download all slides sequentially with 500ms delay

#### `copyCaption()`

Copy caption to clipboard with 2s feedback

#### `copyHashtags()`

Copy all hashtags to clipboard (formatted with #) with 2s feedback

## 🎯 User Flow

### 1. Save Slides First

```
User → /template/[id]?format=save
     → Click "Save All Slides to Cloud"
     → All slides saved with saved_slide_url
```

### 2. View Content

```
User → /template/[id] (normal view)
     → "Show Content" button appears
     → Click button
     → Modal opens with carousel
```

### 3. Navigate Slides

```
Options:
- Click arrow buttons (< >)
- Use keyboard arrows (←→)
- Click slide indicators (dots)
```

### 4. Interact with Content

```
Options:
- Click "Copy" on caption → Copied to clipboard
- Click "Copy" on hashtags → All hashtags copied
- Click "Download All" → All slides downloaded
```

## 🎨 Styling Details

### Button

```css
position: fixed
bottom: 1rem (16px)
right: 1rem (16px)
z-index: 9998
shadow: large
```

### Modal

```css
max-width: 6xl (1152px)
max-height: 90vh
overflow: hidden (main), auto (content)
```

### Grid Layout

```css
grid-cols: 1 (mobile)
grid-cols: 2 (md+)
gap: 1.5rem
```

### Carousel

```css
aspect-ratio: 3/4 (portrait)
background: gray-100
rounded: large
overflow: hidden
```

### Navigation Buttons

```css
position: absolute
bg: white/80
hover:bg: white
rounded: full
shadow: large
```

### Slide Indicators

```css
Active: width 2rem, blue-600
Inactive: width 0.5rem, gray-300
hover: gray-400
```

## 🔍 Props Data Source

### From `riddleData.carouselData`:

-   `caption` - string
-   `hashtags` - string[]

### From processed slides:

-   `slides` - Slide[] (with saved_slide_url)
-   Each slide contains:
    -   `tipe_slide`
    -   `judul_slide`
    -   `sub_judul_slide`
    -   `konten_slide`
    -   `saved_slide_url`

## ✅ Testing Checklist

-   [x] Button appears only when all slides saved
-   [x] Button hidden when slides not saved
-   [x] Modal opens on button click
-   [x] Carousel navigation works (arrows)
-   [x] Keyboard navigation works
-   [x] Slide indicators work
-   [x] Caption displays correctly
-   [x] Hashtags display correctly
-   [x] Copy caption works
-   [x] Copy hashtags works (with # prefix)
-   [x] Download all works
-   [x] Loading states display
-   [x] Responsive on mobile
-   [x] Responsive on desktop
-   [x] Modal closes properly
-   [x] Current slide info updates

## 🚀 Usage Examples

### Basic Usage

```tsx
<ShowContentButton
    slides={processedData}
    caption={riddleData.carouselData.caption}
    hashtags={riddleData.carouselData.hashtags}
    riddleId={id}
/>
```

### Caption Example

```
"🔍 Bisakah kamu memecahkan teka-teki coding ini?
Swipe untuk melihat jawabannya!
.
.
Follow @ByteUnite.dev untuk lebih banyak riddles!"
```

### Hashtags Example

```typescript
["coding", "programming", "riddles", "webdev", "javascript"];
// Copied as: #coding #programming #riddles #webdev #javascript
```

## 🎉 Success Indicators

✅ Button appears when all slides have saved_slide_url
✅ Modal opens with carousel
✅ Navigation works (arrows + keyboard)
✅ Caption shows with copy button
✅ Hashtags show as badges with copy button
✅ Download all slides works
✅ Copy feedback shows "Copied!" for 2 seconds
✅ Current slide info updates on navigation
✅ Responsive on all screen sizes
✅ No console errors

## 📋 Notes

-   Button position: z-index 9998 (below save button 9999, same as download button)
-   Download delay: 500ms between slides (prevents browser blocking)
-   Copy feedback: 2 seconds timeout
-   Hashtags format: Auto-adds "#" prefix when copying
-   Keyboard support: Arrow Left/Right for navigation
-   Image aspect ratio: 3:4 (portrait, matching Instagram carousel)

---

**Status**: ✅ Implemented and Ready to Use
**Date**: October 25, 2025
**Related Components**: SaveSlidesButton, DownloadSlidesButton
