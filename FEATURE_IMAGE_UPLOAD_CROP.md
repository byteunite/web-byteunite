# Feature: Upload & Crop Image untuk ClickableImage Component

## 📋 Overview

Fitur ini menambahkan kemampuan untuk mengupload gambar dari komputer lokal, melakukan crop dengan proporsi yang sesuai, dan menyimpan gambar ke Cloudinary.

## ✨ Fitur yang Ditambahkan

### 1. **Upload Gambar**

-   User dapat mengupload gambar dari komputer lokal
-   Support berbagai format gambar (jpg, png, webp, dll)
-   Validasi tipe file otomatis

### 2. **Crop Gambar dengan Proporsi yang Tepat**

-   Automatic aspect ratio sesuai dimensi slide (width/height)
-   Interactive crop tool dengan preview real-time
-   Gambar akan di-resize ke ukuran slide yang tepat setelah crop

### 3. **Upload ke Cloudinary**

-   Upload gambar melalui API endpoint `/api/upload-image`
-   Organized folder structure: `{category}/{riddleId}/slide-{index}-{timestamp}`
-   Auto-optimization dengan quality "auto:good"
-   Return secure HTTPS URL

### 4. **Simpan ke Database**

-   URL gambar dari Cloudinary disimpan ke database
-   Support untuk semua kategori: riddles, sites, topics
-   Preview URL yang sudah diupload

## 🚀 Cara Menggunakan

### 1. Klik pada gambar slide

![Click Image]

### 2. Dialog "Opsi Gambar" akan muncul dengan 3 pilihan:

-   **Upload Gambar** - Upload gambar baru dari komputer
-   **Ganti Gambar** - Generate gambar baru dari Pollinations AI
-   **Simpan ke Database** - Simpan URL gambar aktif ke database

### 3. Jika memilih "Upload Gambar":

1. Pilih file gambar dari komputer
2. Dialog crop akan muncul
3. Sesuaikan area crop (aspect ratio otomatis sesuai dimensi slide)
4. Klik "Upload & Simpan"
5. Gambar akan diupload ke Cloudinary
6. URL akan ditampilkan di dialog

### 4. Setelah upload berhasil:

-   URL gambar Cloudinary akan muncul dengan indikator "✓ Gambar terupload"
-   Klik "Simpan ke Database" untuk menyimpan URL ke database
-   Gambar yang tersimpan akan muncul saat slide ditampilkan kembali

## 🔧 Technical Implementation

### Dependencies

```json
{
    "react-image-crop": "^11.0.10",
    "cloudinary": "^2.8.0"
}
```

### API Endpoint

**POST** `/api/upload-image`

**Request Body:**

```json
{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "folder": "riddles/677f3a1234567890abcdef",
    "public_id": "slide-0-1234567890"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "url": "https://res.cloudinary.com/.../image.jpg",
        "public_id": "riddles/677f3a1234567890abcdef/slide-0-1234567890",
        "width": 1080,
        "height": 1920
    }
}
```

### Component State

```typescript
const [isUploading, setIsUploading] = useState(false);
const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
const [uploadedImageUrl, setUploadedImageUrl] = useState("");
const [crop, setCrop] = useState<Crop>();
const [completedCrop, setCompletedCrop] = useState<Crop>();
const [uploadedFile, setUploadedFile] = useState("");
const imgRef = useRef<HTMLImageElement>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
```

### Key Functions

#### 1. `handleFileSelect()`

-   Membaca file yang dipilih user
-   Convert ke base64
-   Buka modal crop

#### 2. `onImageLoadCrop()`

-   Initialize crop dengan aspect ratio yang sesuai
-   Center crop pada gambar

#### 3. `getCroppedImg()`

-   Crop gambar sesuai area yang dipilih
-   Resize ke dimensi slide yang tepat (width x height)
-   Convert ke base64 JPEG

#### 4. `handleUploadImage()`

-   Upload cropped image ke Cloudinary
-   Simpan URL hasil upload
-   Update imageUrl state

#### 5. `handleSaveImageToDb()`

-   Save URL (dari upload atau pollinations) ke database
-   Support multi-category (riddles/sites/topics)

## 📊 Flow Diagram

```
User clicks image
    ↓
Modal "Opsi Gambar"
    ↓
├─→ Upload Gambar
│       ↓
│   Select File
│       ↓
│   Crop Modal (with aspect ratio)
│       ↓
│   Adjust crop area
│       ↓
│   Click "Upload & Simpan"
│       ↓
│   Upload to Cloudinary
│       ↓
│   Show URL ✓
│       ↓
│   Back to Options Modal
│       ↓
│   Click "Simpan ke Database"
│       ↓
│   Save to MongoDB
│
├─→ Ganti Gambar
│       ↓
│   Generate new from Pollinations AI
│       ↓
│   (optional) Click "Simpan ke Database"
│
└─→ Simpan ke Database
        ↓
    Save current URL to MongoDB
```

## 🔐 Environment Variables

Pastikan environment variables berikut sudah diset:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📝 Notes

### Crop Behavior

-   Aspect ratio dikunci sesuai proporsi slide (width/height)
-   Gambar hasil crop akan di-resize exact ke dimensi slide
-   Quality JPEG 95% untuk balance antara kualitas dan ukuran file

### Upload Optimization

-   Auto-optimization: `quality: "auto:good"`
-   Auto-format: `fetch_format: "auto"`
-   Organized folder structure per category dan item ID

### State Management

-   `uploadedImageUrl` disimpan saat upload berhasil
-   Reset saat user klik "Ganti Gambar"
-   Preserved sampai user save ke database

## 🐛 Troubleshooting

### Upload gagal

-   Cek Cloudinary credentials di environment variables
-   Cek network connection
-   Cek console untuk error details

### Crop tidak muncul

-   Pastikan file yang dipilih adalah gambar valid
-   Refresh halaman dan coba lagi

### URL tidak tersimpan

-   Pastikan `slideIndex` dan `riddleId` tersedia
-   Cek API endpoint sesuai category
-   Lihat console untuk error details

## 🎯 Future Improvements

1. **Multiple image formats**: Support PNG with transparency
2. **Preview before save**: Show comparison old vs new image
3. **Batch upload**: Upload multiple slides sekaligus
4. **Image filters**: Add filters/effects before upload
5. **Compression options**: User-adjustable quality settings
6. **Undo feature**: Revert to previous image

## 📚 Related Files

-   `/components/ClickableImage.tsx` - Main component
-   `/app/api/upload-image/route.ts` - Upload API endpoint
-   `/app/api/riddles/[id]/save-image/route.ts` - Save to DB endpoint
-   `/app/api/sites/[id]/save-image/route.ts` - Sites save endpoint
-   `/app/api/topics/[id]/save-image/route.ts` - Topics save endpoint

---

**Created:** November 20, 2025
**Version:** 1.0.0
