# Markdown Formatting Support untuk Slides

## Overview

Sistem carousel slides sekarang mendukung markdown formatting untuk **bold** dan _italic_ pada konten slide.

## Perubahan yang Dilakukan

### 1. Utility Function Baru

**File:** `/lib/format-text.ts`

Fungsi `parseMarkdownToHtml()` yang mengkonversi markdown syntax menjadi HTML:

-   `**text**` atau `__text__` → `<strong>text</strong>` (Bold)
-   `*text*` atau `_text_` → `<em>text</em>` (Italic)
-   `\n` → `<br/>` (Line breaks)

### 2. Update Prompt Generator

**File:** `/lib/gemini-topic-generator.ts`

Prompt diupdate untuk menginstruksikan AI menggunakan markdown formatting:

```
GUNAKAN MARKDOWN untuk emphasis: **teks tebal**, *teks miring*
Contoh: "**Poin penting** untuk diingat" atau "*Tips:* Lakukan ini setiap hari"
Gunakan bold (**) untuk kata kunci atau poin penting yang perlu ditonjolkan
Gunakan italic (*) untuk catatan tambahan atau penekanan ringan
```

### 3. Update Slide Components

Semua slide components diupdate untuk menggunakan `parseMarkdownToHtml()`:

#### Components yang Diupdate:

-   ✅ `IntroSlide.tsx`
-   ✅ `FeaturesSlide.tsx`
-   ✅ `BenefitsSlide.tsx`
-   ✅ `UseCaseSlide.tsx`
-   ✅ `CTASlide.tsx`
-   ✅ `DetailSlide.tsx`
-   ✅ `KesimpulanSlide.tsx`
-   ✅ `ListSlide.tsx`
-   ✅ `PoinUtamaSlide.tsx`
-   ✅ `FaktaSlide.tsx`

Setiap component sekarang:

1. Import `parseMarkdownToHtml` dari `@/lib/format-text`
2. Menggunakan fungsi ini untuk parsing `post.konten_slide`

**Contoh perubahan:**

```tsx
// Before
dangerouslySetInnerHTML={{
    __html: post.konten_slide.replace(/\n/g, "<br/>"),
}}

// After
dangerouslySetInnerHTML={{
    __html: parseMarkdownToHtml(post.konten_slide),
}}
```

### 4. CSS Styling

**File:** `/app/globals.css`

Menambahkan styling untuk `<strong>` dan `<em>` tags:

```css
/* Markdown formatting styles for slides */
strong {
    @apply font-extrabold;
    font-weight: 800;
}

em {
    @apply italic;
    font-style: italic;
}

/* Specific styling for slide content markdown */
.slide-content strong {
    @apply font-extrabold;
    font-weight: 900;
}

.slide-content em {
    @apply italic;
    font-style: italic;
    opacity: 0.95;
}
```

## Cara Penggunaan

### 1. Untuk AI Generator

AI akan otomatis menggunakan markdown formatting berdasarkan prompt yang sudah diupdate:

```
"**Hemat waktu** hingga 50% dengan tools ini"
"*Catatan:* Gunakan dengan bijak"
"**PENTING:** Jangan lupa backup data Anda"
```

### 2. Manual Input

Jika membuat konten manual, gunakan syntax markdown:

```
• **Fitur utama** yang wajib dicoba
• *Tips:* Mulai dari yang sederhana
• **100%** gratis dan open source
```

### 3. Kombinasi

Bold dan italic bisa dikombinasikan:

```
"**SUPER PENTING:** *Baca sampai selesai ya!*"
```

## Contoh Output

### Input:

```
"• **Hemat waktu** hingga 50%\n• *Catatan:* Mudah dipelajari\n• **Gratis** selamanya"
```

### HTML Output:

```html
• <strong>Hemat waktu</strong> hingga 50%<br />
• <em>Catatan:</em> Mudah dipelajari<br />
• <strong>Gratis</strong> selamanya
```

### Visual Result:

• **Hemat waktu** hingga 50%  
• _Catatan:_ Mudah dipelajari  
• **Gratis** selamanya

## Best Practices

1. **Bold (`**text**`)**: Gunakan untuk:

    - Kata kunci penting
    - Angka atau statistik
    - Poin utama yang harus diingat
    - Call-to-action

2. **Italic (`*text*`)**: Gunakan untuk:

    - Catatan tambahan
    - Tips atau saran
    - Penekanan ringan
    - Keterangan singkat

3. **Kombinasi**: Jangan overuse - pilih kata-kata yang benar-benar penting saja

## Testing

Untuk test markdown formatting:

1. Generate carousel baru dengan topic generator
2. Periksa konten slide - seharusnya ada bold/italic
3. Preview slide untuk memastikan formatting terlihat dengan baik

## Notes

-   Regex pattern menggunakan negative lookbehind/lookahead untuk menghindari konflik antara `*` dan `**`
-   Fungsi `parseMarkdownToHtml()` sudah handle line breaks secara otomatis
-   Semua slide component menggunakan `dangerouslySetInnerHTML` yang sudah aman karena konten dari AI/database terpercaya
