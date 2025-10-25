# Update: Instagram-Style Modal for DownloadSlidesButton

## 📝 Overview

Updated `DownloadSlidesButton` component untuk menampilkan modal dengan layout Instagram-style, mirip dengan tampilan detail post Instagram di web. Layout ini menampilkan:

-   **Slider/Carousel di sebelah kiri** - Menampilkan 1 gambar dengan navigasi kiri/kanan
-   **Profile, Caption, dan Hashtags di sebelah kanan** - Mirip dengan Instagram detail view

## 🎯 Changes Made

### 1. Updated Component Props

#### Before:

```typescript
interface DownloadSlidesButtonProps {
    slides: Slide[];
    riddleId: string;
}
```

#### After:

```typescript
interface DownloadSlidesButtonProps {
    slides: Slide[];
    riddleId: string;
    caption: string; // ✨ NEW
    hashtags: string[]; // ✨ NEW
}
```

### 2. Added New Features

#### Carousel Navigation

-   Arrow buttons untuk navigasi slide (kiri/kanan)
-   Keyboard support (Arrow Left/Right)
-   Slide indicators (dots) yang bisa diklik
-   Slide counter di corner kanan atas

#### Instagram-Style Profile Header

-   Mock profile avatar dengan gradient
-   Username "ByteUnite.dev"
-   Subtitle "ByteRiddle"

#### Caption Display

-   Menampilkan caption lengkap dengan format Instagram
-   Profile avatar di sebelah kiri
-   Username bold + caption text
-   Button "Copy Caption" untuk copy ke clipboard
-   Feedback "Copied!" selama 2 detik

#### Hashtags Display

-   Menampilkan hashtags sebagai text links (warna biru)
-   Button "Copy Hashtags" untuk copy semua hashtags
-   Auto-format dengan prefix "#"
-   Feedback "Copied!" selama 2 detik

#### Current Slide Info

-   Display informasi slide yang sedang ditampilkan
-   Shows: Slide type, title, subtitle

### 3. Added New State Management

```typescript
const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Track current slide
const [copiedCaption, setCopiedCaption] = useState(false); // Copy caption feedback
const [copiedHashtags, setCopiedHashtags] = useState(false); // Copy hashtags feedback
```

### 4. Added New Functions

```typescript
handlePrevSlide(); // Navigate to previous slide
handleNextSlide(); // Navigate to next slide
handleKeyDown(e); // Keyboard navigation
copyCaption(); // Copy caption to clipboard
copyHashtags(); // Copy hashtags to clipboard (with # prefix)
```

## 🎨 Visual Layout

### Desktop Layout (Large Screen)

```
┌─────────────────────────────────────────────────────────────┐
│  Saved Slides                                         [X]   │
│  View and download your saved slides                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │                      │  │  [B] ByteUnite.dev       │   │
│  │   [<]  SLIDE  [>]    │  │      ByteRiddle          │   │
│  │                      │  │  ─────────────────────── │   │
│  │                      │  │                          │   │
│  │      1 / 5           │  │  [B] ByteUnite.dev       │   │
│  │                      │  │      Caption text here... │   │
│  │                      │  │      [Copy Caption]       │   │
│  └──────────────────────┘  │                          │   │
│  [●][○][○][○][○]          │  #hashtag1 #hashtag2    │   │
│                            │  [Copy Hashtags]         │   │
│                            │                          │   │
│                            │  ─────────────────────── │   │
│                            │  SLIDE 1 INFO            │   │
│                            │  COVER                   │   │
│                            │  Title here...           │   │
│                            │                          │   │
│                            │  [Download All (5)]      │   │
│                            └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Small Screen)

```
┌────────────────────────┐
│  Saved Slides    [X]   │
├────────────────────────┤
│  ┌──────────────────┐  │
│  │  [<] SLIDE [>]   │  │
│  │                  │  │
│  │     1 / 5        │  │
│  └──────────────────┘  │
│  [●][○][○][○][○]      │
│                        │
│  [B] ByteUnite.dev     │
│      ByteRiddle        │
│  ──────────────────    │
│  [B] ByteUnite.dev     │
│      Caption text...   │
│      [Copy Caption]    │
│                        │
│  #hashtag1 #hashtag2   │
│  [Copy Hashtags]       │
│                        │
│  SLIDE 1 INFO          │
│  COVER                 │
│                        │
│  [Download All (5)]    │
└────────────────────────┘
```

## 📊 Layout Breakdown

### Grid Structure

```css
Desktop (lg+): grid-cols-[1fr,400px]  // Left: Flexible, Right: 400px
Mobile:        grid-cols-1            // Stacked
gap:           1.5rem (24px)
```

### Left Side - Carousel

-   **Aspect Ratio**: 4:5 (Instagram portrait ratio)
-   **Background**: Black (Instagram-style)
-   **Image**: object-contain (preserve aspect ratio)
-   **Navigation**: Absolute positioned arrow buttons
-   **Counter**: Top-right corner with semi-transparent background
-   **Indicators**: Bottom center, clickable dots

### Right Side - Content

-   **Profile Header**: Avatar + Username + Subtitle
-   **Caption**: Avatar + Username (bold) + Caption text
-   **Hashtags**: Blue text links with # prefix
-   **Slide Info**: Current slide details
-   **Download Button**: Bottom, full-width

## 🎯 Component Usage

### In Template Page

#### Before:

```tsx
<DownloadSlidesButton slides={processedData} riddleId={id} />
```

#### After:

```tsx
<DownloadSlidesButton
    slides={processedData}
    riddleId={id}
    caption={riddleData.carouselData.caption}
    hashtags={riddleData.carouselData.hashtags}
/>
```

## 🔧 Technical Details

### Imports

```typescript
import {
    Download,
    Image as ImageIcon,
    Loader2,
    ChevronLeft, // ✨ NEW
    ChevronRight, // ✨ NEW
    Copy, // ✨ NEW
    Check, // ✨ NEW
} from "lucide-react";
import Image from "next/image"; // ✨ NEW
```

### Modal Size

```css
max-width: 6xl (1152px)
max-height: 90vh
overflow: hidden (wrapper), auto (content)
z-index: 10000
```

### Responsive Behavior

-   **Desktop (lg+)**: 2 columns - Carousel | Content
-   **Mobile**: 1 column - Stacked layout
-   **Carousel**: Maintains 4:5 aspect ratio on all screens

## ✨ User Interactions

### Navigation

1. **Arrow Buttons**: Click < or > to navigate
2. **Keyboard**: Press ← or → arrow keys
3. **Indicators**: Click any dot to jump to that slide

### Copy Actions

1. **Copy Caption**: Click button → Caption copied → "Copied!" for 2s
2. **Copy Hashtags**: Click button → All hashtags copied (with #) → "Copied!" for 2s

### Download

1. **Download All**: Downloads all slides sequentially with 500ms delay
2. **Progress**: Button shows "Downloading..." during process

## 📋 Data Flow

### Props Data Source

```typescript
riddleData.carouselData = {
    slides: Slide[],
    caption: string,      // From API
    hashtags: string[]    // From API
}
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
// Displayed as: #coding #programming #riddles #webdev #javascript
```

## 🎨 Styling Details

### Profile Avatar

```css
width: 2.5rem (40px)
height: 2.5rem (40px)
background: linear-gradient(to bottom right, purple-600, pink-500)
rounded: full
text: white, bold
```

### Carousel Navigation Buttons

```css
position: absolute
background: white/90
hover:bg: white
rounded: full
padding: 0.5rem
shadow: large
icon-color: gray-800
```

### Slide Counter

```css
position: absolute (top-right)
background: black/70
text: white
padding: 0.375rem 0.75rem
rounded: full
font: medium
```

### Slide Indicators

```css
Active:   width 1.75rem, bg-blue-600
Inactive: width 0.375rem, bg-gray-300
hover:    bg-gray-400
height:   0.375rem
```

### Caption & Hashtags

```css
Caption:
  - text-sm, gray-700
  - whitespace-pre-wrap
  - wrap-break-word

Hashtags:
  - text-sm, blue-600
  - font-normal
  - gap: 0.375rem
```

## ✅ Testing Checklist

-   [x] Button appears when all slides saved
-   [x] Modal opens in Instagram-style layout
-   [x] Carousel navigation works (arrows)
-   [x] Keyboard navigation works (← →)
-   [x] Slide indicators work
-   [x] Profile section displays correctly
-   [x] Caption displays with copy button
-   [x] Hashtags display with copy button
-   [x] Copy caption works with feedback
-   [x] Copy hashtags works with # prefix
-   [x] Current slide info updates on navigation
-   [x] Download all button works
-   [x] Responsive on mobile (stacked)
-   [x] Responsive on desktop (2 columns)
-   [x] Modal closes properly

## 🚀 Success Indicators

✅ Modal displays Instagram-style layout
✅ Carousel on left, content on right (desktop)
✅ Stacked layout on mobile
✅ Profile header shows mock Instagram profile
✅ Caption displays with username bold
✅ Hashtags display as blue text
✅ Copy buttons work with 2s feedback
✅ Navigation works (arrows + keyboard + dots)
✅ Current slide info updates correctly
✅ Aspect ratio 4:5 maintained (Instagram-style)
✅ Black background for carousel (Instagram-style)
✅ No console errors

## 📝 Notes

### Design Decisions

-   **Aspect Ratio**: Changed from 3:4 to 4:5 to match Instagram portrait posts
-   **Background**: Black for carousel area (Instagram-style)
-   **Layout**: 2 columns on desktop, similar to Instagram web interface
-   **Profile**: Mock Instagram profile header for authenticity
-   **Spacing**: 400px fixed width for right column on desktop

### User Experience

-   Keyboard support enhances navigation speed
-   Copy feedback provides clear confirmation
-   Slide indicators allow quick jumping between slides
-   Instagram-familiar interface reduces learning curve

### Performance

-   Image lazy loading with Next.js Image component
-   500ms delay between downloads (browser-friendly)
-   Efficient state updates for smooth navigation

---

**Status**: ✅ Completed and Ready to Use
**Date**: October 25, 2025
**Related Components**: ShowContentButton, SaveSlidesButton
**Design Inspiration**: Instagram Web Post Detail View
