# Save Slides Feature - Documentation

## Overview

Fitur ini memungkinkan untuk menyimpan setiap slide dari riddle sebagai gambar ke cloud storage (ImageKit) dan menyimpan URL-nya di database.

## Cara Menggunakan

### 1. Akses Halaman dengan Parameter `?format=save`

Tambahkan parameter `?format=save` pada URL template riddle:

```
http://localhost:3000/template/[riddle-id]?format=save
```

Contoh:
```
http://localhost:3000/template/6735a1b2c3d4e5f6a7b8c9d0?format=save
```

### 2. Klik Button "Save All Slides to Cloud"

Button akan muncul di bagian bawah halaman. Ketika diklik, proses akan:
1. **Capture** setiap slide dengan dimensi aslinya menggunakan html2canvas
2. **Upload** gambar ke ImageKit cloud storage
3. **Save** URL gambar ke database pada property `saved_image_url` di setiap slide

### 3. Progress Monitoring

Anda dapat melihat progress real-time:
- Progress bar menunjukkan persentase completion
- Status text menunjukkan slide mana yang sedang diproses
- Notifikasi sukses/error setelah selesai

## Setup ImageKit

### 1. Buat Account ImageKit

Daftar di: https://imagekit.io

### 2. Dapatkan Credentials

Dari dashboard ImageKit (https://imagekit.io/dashboard/developer/api-keys), copy:
- Public Key
- Private Key
- URL Endpoint

### 3. Setup Environment Variables

Buat file `.env.local` di root project dan isi dengan:

```env
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

**⚠️ Penting:** Jangan commit file `.env.local` ke Git!

## Struktur Data

### Before Save
```json
{
  "tipe_slide": "COVER",
  "judul_slide": "Riddle Title",
  "sub_judul_slide": "Subtitle",
  "konten_slide": "Content...",
  "prompt_untuk_image": "Image prompt...",
  "saved_image_url": null
}
```

### After Save
```json
{
  "tipe_slide": "COVER",
  "judul_slide": "Riddle Title",
  "sub_judul_slide": "Subtitle",
  "konten_slide": "Content...",
  "prompt_untuk_image": "Image prompt...",
  "saved_image_url": "https://ik.imagekit.io/your_id/riddles/[riddle-id]/riddle-[id]-slide-0-[timestamp].png"
}
```

## API Endpoints

### POST `/api/riddles/save-slides`

Endpoint untuk batch upload dan save slides.

**Request Body:**
```json
{
  "riddleId": "6735a1b2c3d4e5f6a7b8c9d0",
  "images": [
    {
      "slideIndex": 0,
      "dataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    },
    {
      "slideIndex": 1,
      "dataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully saved 5 out of 5 slides",
  "data": {
    "riddleId": "6735a1b2c3d4e5f6a7b8c9d0",
    "uploadResults": [
      {
        "slideIndex": 0,
        "imageUrl": "https://ik.imagekit.io/...",
        "success": true
      },
      {
        "slideIndex": 1,
        "imageUrl": "https://ik.imagekit.io/...",
        "success": true
      }
    ],
    "successCount": 5,
    "totalCount": 5
  }
}
```

## Troubleshooting

### Error: "Invalid ImageKit credentials"

**Solusi:**
1. Periksa apakah environment variables sudah benar
2. Pastikan tidak ada spasi atau karakter tersembunyi
3. Restart development server setelah update env variables

### Error: "Failed to capture slide"

**Solusi:**
1. Pastikan slide sudah fully loaded
2. Check browser console untuk error messages
3. Coba refresh halaman dan ulangi

### Error: "Failed to upload to ImageKit"

**Solusi:**
1. Check koneksi internet
2. Verify ImageKit credentials
3. Check ImageKit dashboard untuk quota limits

## Alternative: Menggunakan Cloudinary

Jika prefer menggunakan Cloudinary:

### 1. Install Cloudinary SDK

```bash
npm install cloudinary
```

### 2. Update API Route

Edit `app/api/riddles/save-slides/route.ts` dan ganti import ImageKit dengan Cloudinary:

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload code
const uploadResponse = await cloudinary.uploader.upload(dataUrl, {
  folder: `riddles/${riddleId}`,
  public_id: `slide-${slideIndex}-${Date.now()}`,
  resource_type: 'image',
});
```

### 3. Setup Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Performance Tips

1. **Capture Quality**: Default scale adalah 2 (high quality). Kurangi jika perlu faster processing:
   ```typescript
   const canvas = await html2canvas(slideElement, {
     scale: 1, // Lower quality, faster
   });
   ```

2. **Batch Size**: Saat ini upload dilakukan sequential. Untuk faster processing, bisa implement parallel upload dengan limit:
   ```typescript
   const results = await Promise.all(
     images.map(image => uploadImage(image))
   );
   ```

3. **Caching**: Saved images bisa di-cache untuk menghindari re-upload slides yang sudah pernah di-save.

## Security Considerations

1. ⚠️ **Private Keys**: Jangan expose private keys ke client-side
2. ⚠️ **Rate Limiting**: Implement rate limiting untuk mencegah abuse
3. ⚠️ **Authentication**: Tambahkan authentication check sebelum allow save slides
4. ⚠️ **Validation**: Validate image size dan format sebelum upload

## Future Improvements

- [ ] Add authentication/authorization
- [ ] Implement progress tracking with WebSockets
- [ ] Add retry mechanism for failed uploads
- [ ] Support for different image formats (JPEG, WebP)
- [ ] Compression before upload
- [ ] Batch delete untuk cleanup old images
- [ ] Preview saved images in dashboard
