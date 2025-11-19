# Setup Guide: Image Upload Feature

## 🔧 Quick Setup

### 1. Cloudinary Account Setup

1. Buat akun di [Cloudinary](https://cloudinary.com/) (gratis)
2. Login ke Dashboard
3. Copy credentials dari Dashboard:
    - Cloud Name
    - API Key
    - API Secret

### 2. Environment Variables

Tambahkan ke file `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**⚠️ Important:**

-   File `.env.local` tidak di-commit ke git (sudah ada di `.gitignore`)
-   Untuk production (Vercel), tambahkan variables ini di Project Settings → Environment Variables

### 3. Vercel Deployment Setup

Jika deploy ke Vercel:

1. Buka Project Settings
2. Pergi ke **Environment Variables**
3. Tambahkan 3 variables:
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
4. Set untuk environment: Production, Preview, dan Development
5. Redeploy project

### 4. Testing

Test upload feature:

```bash
# Development
pnpm dev

# Buka browser: http://localhost:3000
# Navigate ke halaman dengan ClickableImage
# Klik gambar → Upload Gambar → Select file → Crop → Upload
```

## 📦 Dependencies Already Installed

```json
{
    "react-image-crop": "^11.0.10",
    "cloudinary": "^2.8.0"
}
```

## 🎯 Features Overview

### What's New:

1. ✅ **Upload Image** - Upload dari local computer
2. ✅ **Crop with Aspect Ratio** - Auto-adjusted sesuai dimensi slide
3. ✅ **Cloudinary Integration** - Secure cloud storage
4. ✅ **Save to Database** - URL tersimpan untuk persistent display

### Where It Works:

-   ✅ Riddles slides
-   ✅ Sites slides
-   ✅ Topics slides

## 🔍 Verify Setup

### Check Cloudinary Connection

Buat test file: `scripts/test-cloudinary.ts`

```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function test() {
    try {
        const result = await cloudinary.api.ping();
        console.log("✅ Cloudinary connected:", result);
    } catch (error) {
        console.error("❌ Connection failed:", error);
    }
}

test();
```

Run test:

```bash
tsx scripts/test-cloudinary.ts
```

## 📊 Usage Limits (Free Plan)

| Resource        | Limit            |
| --------------- | ---------------- |
| Storage         | 25 GB            |
| Bandwidth       | 25 GB/month      |
| Transformations | 25 credits/month |
| Images          | Unlimited        |

## 🚨 Troubleshooting

### Issue: "Invalid credentials"

**Solution:** Double-check environment variables spelling dan values

### Issue: "Upload failed"

**Solution:**

1. Check internet connection
2. Verify Cloudinary quota tidak habis
3. Check browser console for detailed error

### Issue: "Crop modal tidak muncul"

**Solution:**

1. Check file type (harus image)
2. Check browser console
3. Refresh page dan try again

### Issue: "Z-index issues dengan modal"

**Solution:** Modal sudah set `z-1000`, jika masih issue, increase di Dialog component

## 📝 Notes

-   Upload menggunakan **signed upload** (lebih secure)
-   Images organized by category dan ID: `{category}/{id}/slide-{index}-{timestamp}`
-   Auto-optimization enabled untuk performance
-   Original aspect ratio preserved dengan crop tool

## 🔗 Helpful Links

-   [Cloudinary Docs](https://cloudinary.com/documentation)
-   [React Image Crop](https://www.npmjs.com/package/react-image-crop)
-   [Feature Documentation](./FEATURE_IMAGE_UPLOAD_CROP.md)

---

**Last Updated:** November 20, 2025
