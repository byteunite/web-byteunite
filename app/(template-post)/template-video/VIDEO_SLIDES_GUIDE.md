# Video Slide Components

Slide components yang dioptimalkan untuk background video dengan narrator di bagian bawah.

## 🎯 Design Philosophy

-   **Minimal & Clean**: Tidak distract dari narrator
-   **Easy to Read**: Text yang mudah dibaca dalam format video vertikal
-   **Visual Hierarchy**: Fokus pada struktur content yang jelas
-   **Smooth Backgrounds**: Background yang seamless dengan narrator area

## 📋 Available Slide Types

### 1. VIDEO_COVER

**Purpose**: Opening slide untuk memulai video
**Best for**: Introduction, video title, topic announcement
**Elements**:

-   Large bold title
-   Optional subtitle
-   Gradient background dengan accent color
-   Decorative dots

**Example Data**:

```json
{
    "tipe_slide": "VIDEO_COVER",
    "judul_slide": "5 Tips Coding Efektif",
    "sub_judul_slide": "Tingkatkan Produktivitas Anda"
}
```

### 2. VIDEO_POINT

**Purpose**: Menampilkan satu poin penting
**Best for**: Key facts, main points, individual tips
**Elements**:

-   Numbered badge
-   Main point text
-   Supporting description
-   Alternating background (white/light gray)

**Example Data**:

```json
{
    "tipe_slide": "VIDEO_POINT",
    "judul_slide": "Gunakan Keyboard Shortcuts",
    "konten_slide": "Hemat waktu hingga 30% dengan menguasai shortcuts"
}
```

### 3. VIDEO_QUESTION

**Purpose**: Menampilkan pertanyaan atau riddle
**Best for**: Quizzes, engagement, riddles
**Elements**:

-   Large question mark icon
-   Question text
-   Optional details box
-   Dotted pattern background

**Example Data**:

```json
{
    "tipe_slide": "VIDEO_QUESTION",
    "judul_slide": "Apa itu Clean Code?",
    "konten_slide": "Pikirkan dulu sebelum scroll!"
}
```

### 4. VIDEO_ANSWER

**Purpose**: Reveal jawaban atau solusi
**Best for**: Solutions, explanations, reveals
**Elements**:

-   Checkmark icon
-   Label badge (optional)
-   Answer text
-   Explanation text
-   Gradient background

**Example Data**:

```json
{
    "tipe_slide": "VIDEO_ANSWER",
    "judul_slide": "Code yang mudah dibaca dan dipahami",
    "sub_judul_slide": "JAWABAN",
    "konten_slide": "Clean code = happy team"
}
```

### 5. VIDEO_LIST

**Purpose**: Menampilkan daftar items
**Best for**: Steps, multiple tips, checklists
**Elements**:

-   Numbered bullets
-   List items
-   Header text
-   Clean spacing

**Example Data**:

```json
{
    "tipe_slide": "VIDEO_LIST",
    "judul_slide": "Langkah-langkah Setup",
    "sub_judul_slide": "Ikuti urutan ini",
    "list_items": [
        "Install dependencies dengan npm",
        "Setup environment variables",
        "Run development server",
        "Test aplikasi di browser"
    ]
}
```

### 6. VIDEO_QUOTE

**Purpose**: Highlight quote atau statement penting
**Best for**: Key takeaways, memorable quotes
**Elements**:

-   Large quotation marks
-   Quote text (italic)
-   Source/author badge
-   Elegant minimal design

**Example Data**:

```json
{
    "tipe_slide": "VIDEO_QUOTE",
    "judul_slide": "Code never lies, comments sometimes do",
    "sub_judul_slide": "Ron Jeffries"
}
```

### 7. VIDEO_TRANSITION

**Purpose**: Slide transisi antar section
**Best for**: Section breaks, thinking pauses, "wait for it"
**Elements**:

-   Icon/emoji
-   Transition text
-   Loading dots visual
-   Soft gradient

**Example Data**:

```json
{
    "tipe_slide": "VIDEO_TRANSITION",
    "judul_slide": "Tunggu dulu...",
    "sub_judul_slide": "🤔"
}
```

### 8. VIDEO_CLOSING

**Purpose**: Closing slide dengan CTA
**Best for**: Video endings, call to action
**Elements**:

-   Bold closing message
-   Social media handle
-   CTA text
-   Full color background

**Example Data**:

```json
{
    "tipe_slide": "VIDEO_CLOSING",
    "judul_slide": "Terima Kasih!",
    "sub_judul_slide": "Jangan lupa like & follow",
    "konten_slide": "Ada pertanyaan? Comment di bawah!"
}
```

## 🎨 Color Scheme

Semua slides menggunakan `primaryColor` yang konsisten:

-   Primary colors: `#b94750` (red), `#ccaa3a` (yellow), `#f37047` (orange)
-   Backgrounds: White (#FFFFFF) dan Light Gray (#F9FAFB) alternate
-   Text: Gray-800 untuk heading, Gray-600 untuk body

## 📐 Layout Considerations

### Video Format

-   Width: 432px (1080px / 2.5)
-   Height: ~460px (60% dari 768px total height)
-   Aspect ratio: Optimized untuk vertical video

### Typography

-   Headings: 2xl - 4xl (bold)
-   Body: sm - base (medium/regular)
-   Supporting: xs (regular)

### Spacing

-   Generous padding untuk readability
-   Clear visual hierarchy
-   Centered layouts untuk balance

## 🚀 Usage Example

```tsx
import VideoSlideRenderer from "./video-slide-components/VideoSlideRenderer";

const slideData = {
    tipe_slide: "VIDEO_COVER",
    judul_slide: "Amazing Topic",
    sub_judul_slide: "Let's dive in",
};

<VideoSlideRenderer
    post={slideData}
    index={0}
    width={432}
    height={460}
    contentId="123"
    primaryColor="#b94750"
    category="tutorials"
/>;
```

## 💡 Tips for Content Creation

1. **Keep it Short**: Video slides harus simple, narrator akan menjelaskan detail
2. **One Message per Slide**: Fokus pada satu poin per slide
3. **Use Visual Hierarchy**: Bold untuk poin utama, supporting text untuk detail
4. **Consider Pacing**: Gunakan transition slides untuk memberi jeda
5. **Strong Opening & Closing**: First impression dan CTA yang jelas

## 🔄 Integration with Page

Slides ini dirancang untuk digunakan di `/template-video/[id]` dengan:

-   60% area atas untuk slides
-   40% area bawah untuk video narrator
-   Seamless background transition
-   No distracting elements di bagian bawah slide
