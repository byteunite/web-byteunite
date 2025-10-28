# Dynamic Template Page - Multi Data Source Support

## Overview

Halaman `/template/[id]` sekarang mendukung pengambilan data dari berbagai endpoint API secara dinamis menggunakan query parameter `?data=[category]`.

## Fitur Utama

-   ✅ Fetch data dari multiple endpoints
-   ✅ Validasi category yang valid
-   ✅ Fallback otomatis ke "riddles" jika category tidak valid
-   ✅ Error handling yang robust

## Cara Penggunaan

### 1. Default (Riddles)

Tanpa parameter `data`, halaman akan mengambil data dari endpoint riddles:

```
/template/[id]
/template/abc123
```

**Endpoint yang dipanggil:** `/api/riddles/abc123`

### 2. Dengan Parameter Data

Tambahkan query parameter `?data=[category]` untuk mengambil dari endpoint berbeda:

#### Riddles (Explicit)

```
/template/abc123?data=riddles
```

**Endpoint yang dipanggil:** `/api/riddles/abc123`

#### Sites

```
/template/xyz456?data=sites
```

**Endpoint yang dipanggil:** `/api/sites/xyz456`

### 3. Kombinasi dengan Parameter Lain

Parameter `data` dapat dikombinasikan dengan parameter lain:

```
/template/abc123?data=sites&format=save
/template/abc123?data=riddles&screenshot=true&slideIndex=2
```

## Valid Categories

Saat ini, category yang valid adalah:

-   `riddles` - Data riddles/teka-teki
-   `sites` - Data sites/website

**Catatan:** Jika category yang diberikan tidak valid, sistem akan otomatis fallback ke `riddles`.

## Struktur Data yang Diharapkan

Semua endpoint harus mengembalikan data dengan struktur yang sama:

```json
{
    "data": {
        "carouselData": {
            "slides": [
                {
                    "tipe_slide": "OPENING",
                    "judul_slide": "...",
                    "sub_judul_slide": "...",
                    "konten_slide": "..."
                }
            ],
            "caption": "...",
            "hashtags": ["..."]
        }
    }
}
```

### Field Wajib

-   `carouselData.slides` - Array of slide objects
-   `carouselData.caption` - Caption untuk download
-   `carouselData.hashtags` - Array hashtags untuk download

## Menambahkan Category Baru

Untuk menambahkan category baru:

1. Pastikan endpoint API sudah tersedia: `/api/[category]/[id]`
2. Tambahkan category ke array `validCategories` di fungsi `getDataByCategory`:

```typescript
const validCategories = ["riddles", "sites", "new-category"];
```

3. Pastikan endpoint mengembalikan struktur data yang sesuai dengan format yang diharapkan

## Implementasi Detail

### Fungsi Utama

#### `getDataByCategory(id, category)`

```typescript
async function getDataByCategory(id: string, category: string = "riddles");
```

-   Mengambil data dari API berdasarkan category
-   Memvalidasi category terhadap daftar valid categories
-   Otomatis fallback ke "riddles" jika category tidak valid
-   Return `null` jika data tidak ditemukan

### Flow Diagram

```
User Request → /template/[id]?data=[category]
     ↓
Extract category from searchParams (default: "riddles")
     ↓
getDataByCategory(id, category)
     ↓
Validate category → Valid? → Fetch from /api/{category}/{id}
     ↓              ↓ Invalid
     ↓              → Fallback to "riddles"
     ↓
Check data.carouselData.slides exists
     ↓
Render slides with SlideRenderer
```

## Error Handling

1. **Invalid Category**: Otomatis fallback ke "riddles"
2. **API Error**: Return `null` dan trigger 404 page
3. **Missing Data Structure**: Trigger 404 page jika:
    - `carouselData` tidak ada
    - `carouselData.slides` tidak ada atau kosong

## Testing

### Test Cases

1. **Default behavior**

    ```
    GET /template/abc123
    → Should fetch from /api/riddles/abc123
    ```

2. **Valid category**

    ```
    GET /template/abc123?data=sites
    → Should fetch from /api/sites/abc123
    ```

3. **Invalid category**

    ```
    GET /template/abc123?data=invalid
    → Should fallback to /api/riddles/abc123
    ```

4. **Data not found**
    ```
    GET /template/nonexistent?data=riddles
    → Should show 404 page
    ```

## Best Practices

1. **Selalu sediakan data lengkap** - Pastikan semua field wajib ada di response API
2. **Gunakan same structure** - Semua endpoint harus return struktur yang konsisten
3. **Validasi di backend** - Tambahkan validasi di API endpoint untuk memastikan data integrity
4. **Cache strategy** - Saat ini menggunakan `cache: "no-store"`, sesuaikan jika perlu

## Related Files

-   `/app/(template-post)/template/[id]/page.tsx` - Main page component
-   `/components/SaveSlidesButton.tsx` - Save functionality
-   `/components/DownloadSlidesButton.tsx` - Download functionality
-   `/app/(template-post)/template/[id]/slide-components/SlideRenderer.tsx` - Slide rendering logic

## Future Enhancements

-   [ ] Add TypeScript type definitions for different data categories
-   [ ] Implement data transformation layer for different data structures
-   [ ] Add caching strategy based on category
-   [ ] Support for custom data transformers per category
-   [ ] Admin UI to manage valid categories
