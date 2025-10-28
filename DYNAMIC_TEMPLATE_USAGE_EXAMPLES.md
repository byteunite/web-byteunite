# Dynamic Template Page - Usage Examples

## Contoh Penggunaan Lengkap

### 1. Tampilkan Riddle (Default)

#### Tanpa parameter

```
URL: /template/67890abcdef
```

**Hasil:**

-   Mengambil data dari `/api/riddles/67890abcdef`
-   Menampilkan slide riddle/teka-teki
-   Tombol save dan download tersedia

#### Dengan parameter data=riddles (explicit)

```
URL: /template/67890abcdef?data=riddles
```

**Hasil:** Sama seperti di atas (explicit riddles)

---

### 2. Tampilkan Site

```
URL: /template/12345xyz?data=sites
```

**Hasil:**

-   Mengambil data dari `/api/sites/12345xyz`
-   Menampilkan slide tentang website/site
-   Struktur slide sama dengan riddles (OPENING, KONTEN, CLOSING, etc.)
-   Tombol save dan download tersedia

---

### 3. Mode Save Slides

#### Riddles

```
URL: /template/67890abcdef?format=save
URL: /template/67890abcdef?data=riddles&format=save
```

**Hasil:**

-   Mengambil data riddle
-   Menampilkan tombol "Save All Slides"
-   Screenshot slides secara otomatis saat save

#### Sites

```
URL: /template/12345xyz?data=sites&format=save
```

**Hasil:**

-   Mengambil data site
-   Menampilkan tombol "Save All Slides"
-   Screenshot slides secara otomatis saat save

---

### 4. Mode Screenshot (Internal)

Digunakan oleh sistem untuk mengambil screenshot individual slide.

#### Riddles

```
URL: /template/67890abcdef?screenshot=true&slideIndex=0
URL: /template/67890abcdef?data=riddles&screenshot=true&slideIndex=2
```

#### Sites

```
URL: /template/12345xyz?data=sites&screenshot=true&slideIndex=1
```

**Catatan:** Mode screenshot biasanya dipanggil dari `SaveSlidesButton` component.

---

### 5. Kombinasi Multiple Parameters

#### Save sites dengan screenshot

```
URL: /template/12345xyz?data=sites&format=save&screenshot=true&slideIndex=3
```

#### Riddles dengan format save

```
URL: /template/67890abcdef?data=riddles&format=save
```

---

## Use Cases

### Use Case 1: Showcase Website Portfolio

**Scenario:** Ingin membuat carousel Instagram untuk promosi website portfolio

```typescript
// Step 1: Generate site data dengan AI
POST /api/generate-site
{
  "title": "ByteUnite Portfolio",
  "link": "https://byteunite.dev",
  "description": "Platform belajar coding..."
}

// Response: { _id: "abc123..." }

// Step 2: View template
GET /template/abc123?data=sites

// Step 3: Save slides
GET /template/abc123?data=sites&format=save
```

---

### Use Case 2: Programming Riddles/Teka-Teki

**Scenario:** Buat teka-teki programming untuk edukasi

```typescript
// Step 1: Generate riddle dengan AI
POST /api/generate-riddle
{
  "topic": "JavaScript Closures",
  "difficulty": "medium"
}

// Response: { _id: "xyz789..." }

// Step 2: View template (default riddles)
GET /template/xyz789

// Step 3: Save slides
GET /template/xyz789?format=save
```

---

### Use Case 3: Content Creator Workflow

**Scenario:** Creator ingin download slides untuk Instagram

```
1. Buka: /template/[id]?data=sites&format=save
2. Klik "Save All Slides"
3. Tunggu proses screenshot selesai
4. Klik "Download Slides"
5. Get ZIP file dengan semua slides + caption.txt
```

---

## Data Structure Requirements

### Untuk Category Baru

Jika ingin menambahkan category baru (misalnya `tutorials`), pastikan struktur data mengikuti format:

```typescript
{
  "data": {
    "carouselData": {
      "slides": [
        {
          "tipe_slide": "OPENING",
          "judul_slide": "Main Title",
          "sub_judul_slide": "Subtitle",
          "konten_slide": "Content here...",
          "prompt_untuk_image": "AI image prompt",
          "saved_image_url": "https://...",  // Optional
          "saved_slide_url": "https://..."   // Optional
        },
        // ... more slides
      ],
      "caption": "Instagram caption with emojis 🚀",
      "hashtags": ["#coding", "#tutorial", "#javascript"]
    }
  }
}
```

---

## Tipe Slide yang Didukung

### 1. OPENING

Slide pembuka dengan judul besar

-   **Komponen:** Judul, subtitle, background gradient
-   **Posisi:** Slide pertama

### 2. MISTERI / QUESTION

Slide pertanyaan/teka-teki

-   **Komponen:** Pertanyaan, gambar ilustrasi, hints
-   **Styling:** Fokus pada pertanyaan

### 3. WARNING_ANSWER

Slide peringatan sebelum jawaban

-   **Auto-generated:** Disisipkan otomatis sebelum SOLUSI
-   **Pesan:** "🔍 Siap Lihat Jawaban?"

### 4. SOLUSI / ANSWER

Slide jawaban/solusi

-   **Komponen:** Penjelasan detail, code snippets
-   **Posisi:** Setelah WARNING_ANSWER

### 5. KONTEN / CONTENT

Slide konten umum

-   **Komponen:** Text, images, list items
-   **Fleksibel:** Bisa untuk berbagai keperluan

### 6. CLOSING

Slide penutup

-   **Komponen:** CTA, social media, branding
-   **Posisi:** Slide terakhir

---

## Tips & Best Practices

### 1. SEO-Friendly URLs

```
✅ Good: /template/learn-javascript-closures?data=riddles
❌ Bad:  /template/123?data=riddles
```

### 2. Naming Convention

```typescript
// Riddles: topik programming/algoritma
/template/fibonacci-sequence?data=riddles

// Sites: nama produk/platform
/template/byteunite-platform?data=sites
```

### 3. Error Handling

```typescript
// Jika ID tidak valid
GET /template/invalid-id?data=sites
→ Returns: 404 Not Found

// Jika category tidak valid
GET /template/abc123?data=invalid-category
→ Fallback: Fetch from /api/riddles/abc123
```

### 4. Performance

```typescript
// Cache optimization
// Current: cache: "no-store"
// Consider: Implementasi ISR (Incremental Static Regeneration)

export const revalidate = 3600; // Revalidate every 1 hour
```

---

## Integration dengan Components

### SaveSlidesButton

```tsx
// Otomatis handle category dari URL
<SaveSlidesButton riddleId={id} totalSlides={postCount} />

// Component akan call screenshot API dengan category yang tepat
```

### DownloadSlidesButton

```tsx
// Terima slides, caption, hashtags dari fetchedData
<DownloadSlidesButton
    slides={processedData}
    riddleId={id}
    caption={fetchedData.carouselData.caption}
    hashtags={fetchedData.carouselData.hashtags}
/>
```

---

## Testing Checklist

### Manual Testing

-   [ ] Test default riddles: `/template/[id]`
-   [ ] Test explicit riddles: `/template/[id]?data=riddles`
-   [ ] Test sites: `/template/[id]?data=sites`
-   [ ] Test invalid category: `/template/[id]?data=xyz` → should fallback
-   [ ] Test save format: `/template/[id]?data=sites&format=save`
-   [ ] Test screenshot mode: `/template/[id]?screenshot=true&slideIndex=0`
-   [ ] Test 404: `/template/nonexistent?data=riddles`
-   [ ] Test combined params: All parameter combinations

### API Testing

```bash
# Test riddles endpoint
curl http://localhost:3000/api/riddles/[id]

# Test sites endpoint
curl http://localhost:3000/api/sites/[id]

# Check response structure
{
  "success": true,
  "data": {
    "carouselData": {
      "slides": [...],
      "caption": "...",
      "hashtags": [...]
    }
  }
}
```

---

## Troubleshooting

### Issue 1: 404 Not Found

**Penyebab:**

-   ID tidak valid
-   Data tidak ada di database
-   carouselData kosong

**Solusi:**

```typescript
// Cek data di database
GET / api / riddles / [id];
GET / api / sites / [id];

// Pastikan carouselData exists
```

### Issue 2: Screenshot Gagal

**Penyebab:**

-   slideIndex out of range
-   Slide belum ter-render

**Solusi:**

```typescript
// Validasi slideIndex
if (targetSlideIndex >= 0 && targetSlideIndex < processedData.length) {
    // Safe to screenshot
}
```

### Issue 3: Data Structure Mismatch

**Penyebab:**

-   API response berbeda struktur

**Solusi:**

```typescript
// Standardize response di API route
return NextResponse.json({
  success: true,
  data: {
    carouselData: {
      slides: [...],
      caption: "...",
      hashtags: [...]
    }
  }
});
```

---

## Related Documentation

-   [DYNAMIC_TEMPLATE_PAGE.md](./DYNAMIC_TEMPLATE_PAGE.md) - Technical implementation
-   [SAVE_SLIDES_FEATURE.md](./SAVE_SLIDES_FEATURE.md) - Save slides workflow
-   [FEATURE_DOWNLOAD_SLIDES.md](./FEATURE_DOWNLOAD_SLIDES.md) - Download functionality

---

## Changelog

### v1.0.0 (Current)

-   ✅ Dynamic data fetching based on `?data=[category]`
-   ✅ Support for `riddles` and `sites` categories
-   ✅ Auto fallback to riddles for invalid categories
-   ✅ Full integration with SaveSlidesButton and DownloadSlidesButton
-   ✅ WARNING_ANSWER slide auto-insertion

### Future Enhancements

-   [ ] Add more categories (tutorials, courses, etc.)
-   [ ] Custom data transformers per category
-   [ ] Admin dashboard to manage categories
-   [ ] Analytics tracking per category
-   [ ] A/B testing support
