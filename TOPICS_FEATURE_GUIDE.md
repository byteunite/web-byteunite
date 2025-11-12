# Topics Feature - Implementation Guide

## Overview

Fitur **Topics** adalah halaman admin yang memungkinkan pengguna untuk membuat, mengelola, dan menyimpan konten carousel Instagram berdasarkan topik tertentu. Fitur ini mirip dengan halaman `/riddles` dan `/sites`, namun lebih general dan fleksibel.

## File Structure

### 1. Model Database

**File:** `models/Topic.ts`

```typescript
{
  title: String (required),
  description: String (required),
  category: String (optional),
  keywords: Array<String> (optional),
  carouselData: {
    slides: Array<{
      tipe_slide: String,
      judul_slide: String,
      sub_judul_slide: String,
      konten_slide: String,
      prompt_untuk_image: String,
      saved_image_url: String,
      saved_slide_url: String
    }>,
    caption: String,
    hashtags: Array<String>
  },
  timestamps: true
}
```

### 2. API Endpoints

#### GET `/api/topics`

Mengambil daftar semua topics dengan pagination.

**Query Parameters:**

-   `page`: nomor halaman (default: 1)
-   `limit`: jumlah item per halaman (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### POST `/api/generate-topic`

Generate carousel data dari AI berdasarkan input topic.

**Request Body:**

```json
{
    "title": "Judul topic (required)",
    "description": "Deskripsi detail (required)",
    "category": "Kategori (optional)",
    "keywords": ["keyword1", "keyword2"] // optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Topic berhasil disimpan ke database",
  "data": {
    "id": "...",
    "title": "...",
    "description": "...",
    "carouselData": {...},
    ...
  }
}
```

#### DELETE `/api/topics/[id]`

Menghapus topic berdasarkan ID.

### 3. AI Generator

**File:** `lib/gemini-topic-generator.ts`

Function `generateTopicCarousel()` menggunakan Gemini AI untuk:

-   Menghasilkan 5-8 slides konten edukatif
-   Membuat caption Instagram yang engaging
-   Menyarankan 10-15 hashtags relevan
-   Generate prompt untuk image di setiap slide

### 4. Frontend Page

**File:** `app/(protected)/topics/page.tsx`

**Features:**

-   ✅ Tabel responsif (desktop) dan card view (mobile)
-   ✅ Dialog untuk add new topic (2 mode: Form & JSON input)
-   ✅ Form fields: Title, Description, Category, Keywords
-   ✅ Pagination
-   ✅ Delete confirmation dialog
-   ✅ Status indicator (saved slides count)
-   ✅ Link ke detail page `/template/[id]`
-   ✅ Link ke save page `/template/[id]?format=save`

### 5. Navigation

**File:** `components/AppShell.tsx`

Menambahkan menu item "Topics" dengan icon BookOpen di sidebar navigation.

## Usage

### Membuat Topic Baru

**Mode Form:**

1. Klik tombol "Add New Topic"
2. Pilih tab "Form Input"
3. Isi field:
    - Title\* (required)
    - Description\* (required)
    - Category (optional)
    - Keywords (comma-separated, optional)
4. Klik "Create Topic"

**Mode JSON:**

1. Klik tombol "Add New Topic"
2. Pilih tab "JSON Input"
3. Masukkan JSON:

```json
{
    "title": "Artificial Intelligence Basics",
    "description": "Penjelasan lengkap tentang dasar-dasar AI, machine learning, dan deep learning",
    "category": "Technology",
    "keywords": ["AI", "machine learning", "tech", "innovation"]
}
```

4. Klik "Create Topic"

### Melihat Detail

Klik tombol "Detail" untuk melihat carousel slides yang sudah di-generate.

### Menyimpan Slides

Klik tombol "Save" untuk masuk ke mode save slides (generate & simpan image untuk setiap slide).

### Menghapus Topic

1. Klik tombol "Delete"
2. Konfirmasi di dialog
3. Topic dan semua data terkait akan dihapus permanent

## Integration with Existing Features

Topic menggunakan infrastruktur yang sama dengan Riddles dan Sites:

-   Template page di `/template/[id]` untuk menampilkan slides
-   SaveSlidesButton component untuk menyimpan slides
-   DownloadSlidesButton untuk download hasil
-   ShowContentButton untuk preview

## AI Prompt Strategy

Generator menggunakan prompt yang:

1. Menyesuaikan konten dengan kategori dan keywords
2. Membuat struktur INTRO → KONTEN → KESIMPULAN
3. Menghasilkan konten yang informatif namun tetap engaging untuk Instagram
4. Menyediakan prompt image yang detailed dan artistic

## Next Steps (Future Enhancements)

1. ✨ Filter berdasarkan category
2. ✨ Search topics by title/keywords
3. ✨ Bulk operations (delete multiple topics)
4. ✨ Export topics to JSON/CSV
5. ✨ AI refinement (regenerate specific slides)
6. ✨ Template preset untuk berbagai jenis kategori
7. ✨ Analytics (views, engagement tracking)

## Testing Checklist

-   [ ] Create topic via form input
-   [ ] Create topic via JSON input
-   [ ] View topics list with pagination
-   [ ] View topic detail
-   [ ] Save slides for a topic
-   [ ] Download slides
-   [ ] Delete topic
-   [ ] Mobile responsive view
-   [ ] Error handling (invalid input, API errors)
-   [ ] Loading states

---

**Created:** 2025-01-12
**Status:** ✅ Implementation Complete
