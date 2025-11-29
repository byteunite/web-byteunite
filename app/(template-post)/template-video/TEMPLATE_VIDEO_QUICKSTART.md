# Template Video - Quick Start Guide

Halaman video template yang dioptimalkan untuk format vertical video (TikTok/Reels/Shorts) dengan area narrator di bagian bawah.

## 🚀 Quick Access

### Development (Mock Data)

```
http://localhost:3000/template-video/0
http://localhost:3000/template-video/1
http://localhost:3000/template-video/2
http://localhost:3000/template-video/3
```

### With Category Parameter

```
http://localhost:3000/template-video/0?data=tutorials
http://localhost:3000/template-video/1?data=riddles
http://localhost:3000/template-video/2?data=topics
http://localhost:3000/template-video/3?data=sites
```

### With Format Parameter

```
http://localhost:3000/template-video/0?format=save
http://localhost:3000/template-video/0?screenshot=true&slideIndex=0
```

## 📋 Mock Data Examples

### ID 0 - Tutorial Series (5 Tips Coding)

-   VIDEO_COVER: "5 Tips Coding yang Wajib Kamu Tahu"
-   VIDEO_POINT: Tips 1-3
-   VIDEO_QUOTE: Programming quote
-   VIDEO_CLOSING: Call to action

### ID 1 - Riddle/Quiz (Teka-Teki Logika)

-   VIDEO_COVER: Introduction
-   VIDEO_QUESTION: Riddle question
-   VIDEO_TRANSITION: Thinking pause
-   VIDEO_ANSWER: Reveal
-   VIDEO_CLOSING: Engagement

### ID 2 - Tips List (Cara Belajar Programming)

-   VIDEO_COVER: Topic introduction
-   VIDEO_LIST: 4 learning steps
-   VIDEO_POINT: Additional tip
-   VIDEO_QUOTE: Expert quote
-   VIDEO_CLOSING: Motivation

### ID 3 - Quick Facts (3 Website Developer)

-   VIDEO_COVER: Topic intro
-   VIDEO_POINT: Stack Overflow
-   VIDEO_POINT: GitHub
-   VIDEO_POINT: MDN Web Docs
-   VIDEO_CLOSING: CTA

## 🎨 Slide Types Available

1. **VIDEO_COVER** - Opening slide dengan gradient
2. **VIDEO_POINT** - Single point dengan numbered badge
3. **VIDEO_QUESTION** - Question dengan large icon
4. **VIDEO_ANSWER** - Answer reveal dengan checkmark
5. **VIDEO_LIST** - Numbered list items
6. **VIDEO_QUOTE** - Quote dengan elegant design
7. **VIDEO_TRANSITION** - Transition/pause slide
8. **VIDEO_CLOSING** - Closing dengan CTA

## 📐 Layout

```
┌─────────────────────┐
│                     │
│   60% SLIDE AREA    │  ← Video Slide Content
│   (460px height)    │
│                     │
├─────────────────────┤
│                     │
│  40% NARRATOR AREA  │  ← Space untuk video narrator
│   (307px height)    │
│                     │
└─────────────────────┘
```

-   **Total Height**: 768px (1920px / 2.5)
-   **Width**: 432px (1080px / 2.5)
-   **Format**: 9:16 (Vertical Video)

## 🔧 Integration with API

Ketika API sudah ready, uncomment bagian ini di `page.tsx`:

```typescript
// Di function getDataByCategory
const endpoint = `${baseUrl}/api/${validatedCategory}/${id}/video`;

const response = await fetch(endpoint, {
    cache: "no-store",
});

const result = await response.json();
return result.data;
```

### Expected API Response Format:

```json
{
    "data": {
        "videoSlides": [
            {
                "tipe_slide": "VIDEO_COVER",
                "judul_slide": "Title Here",
                "sub_judul_slide": "Subtitle",
                "konten_slide": "Content",
                "list_items": ["item1", "item2"],
                "background_color": "#ffffff",
                "text_color": "#000000"
            }
        ],
        "category": "tutorials"
    }
}
```

## 🎯 Features

### ✅ Current Features:

-   8 different slide types optimized for video
-   Mock data for 4 different categories
-   Seamless background transition
-   Responsive to narrator area
-   Clean and minimal design
-   No distracting elements in narrator space

### 🔮 Future Enhancements:

-   [ ] API integration for dynamic content
-   [ ] Screenshot generation for each slide
-   [ ] Video script generation
-   [ ] Automated video rendering
-   [ ] Background music integration
-   [ ] Transition animations

## 💡 Tips for Content Creation

### Do's:

✅ Keep text short and concise  
✅ Use one main message per slide  
✅ Leverage visual hierarchy  
✅ Use transition slides for pacing  
✅ Strong opening and closing

### Don'ts:

❌ Don't overload with text  
❌ Don't use small fonts  
❌ Don't add elements in bottom 40%  
❌ Don't skip the opening slide  
❌ Don't forget the CTA

## 📱 Preview in Browser

1. Start development server:

    ```bash
    npm run dev
    ```

2. Open browser:

    ```
    http://localhost:3000/template-video/0
    ```

3. Scroll horizontal to see all slides

4. Each slide is separated by a gray divider

## 🎬 Next Steps

1. **Create AI Prompt** for generating video slide content
2. **Setup API endpoint** `/api/[category]/[id]/video`
3. **Integrate with video script** generator
4. **Add screenshot** generation
5. **Build video rendering** pipeline

## 🤝 Contributing

Ketika membuat slide type baru:

1. Buat component di `video-slide-components/`
2. Export di `VideoSlideRenderer.tsx`
3. Tambahkan type di `types.ts`
4. Update mock data di `mockData.ts`
5. Update documentation di `VIDEO_SLIDES_GUIDE.md`

## 📞 Support

Jika ada pertanyaan atau issue, refer to:

-   `VIDEO_SLIDES_GUIDE.md` - Detailed slide documentation
-   `video-slide-components/` - Component implementations
-   `mockData.ts` - Example data structures
