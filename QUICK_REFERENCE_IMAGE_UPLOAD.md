# 🚀 Quick Reference: Image Upload Feature

## ⚡ TL;DR

Upload custom images to slides with automatic cropping and cloud storage.

## 📦 What Was Added

```typescript
// New feature in ClickableImage component
<ClickableImage
    prompt="..."
    width={1080}
    height={1920}
    slideIndex={0}
    riddleId="123"
    category="riddles"
/>
```

**3 New Actions:**

1. 📤 Upload Gambar
2. 🔄 Ganti Gambar (existing, unchanged)
3. 💾 Simpan ke Database (enhanced)

## 🔧 Setup (30 seconds)

```bash
# 1. Environment variables (.env.local)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 2. Dependencies (already installed)
pnpm install  # react-image-crop already added

# 3. Done! Start dev server
pnpm dev
```

## 🎯 Usage Flow

```
Click Image → Upload → Select File → Crop → Upload → Save
     ↓          ↓         ↓          ↓       ↓        ↓
  Modal     File Pick  Crop UI   Cloudinary MongoDB  Done!
```

## 📁 Files

### Created:

-   `/app/api/upload-image/route.ts` - Upload API
-   `/FEATURE_IMAGE_UPLOAD_CROP.md` - Full docs
-   `/SETUP_IMAGE_UPLOAD.md` - Setup guide
-   `/IMPLEMENTATION_IMAGE_UPLOAD.md` - Summary
-   `/VISUAL_GUIDE_IMAGE_UPLOAD.md` - Visual guide

### Modified:

-   `/components/ClickableImage.tsx` - Added upload feature
-   `/package.json` - Added react-image-crop

## 🔑 Key Features

| Feature         | Description              |
| --------------- | ------------------------ |
| **Upload**      | From local computer      |
| **Crop**        | Auto aspect ratio (9:16) |
| **Storage**     | Cloudinary cloud         |
| **Persistence** | MongoDB database         |
| **Preview**     | Real-time feedback       |

## 🧪 Test Checklist

-   [ ] Upload JPG image ✓
-   [ ] Upload PNG image ✓
-   [ ] Crop and adjust ✓
-   [ ] Upload to Cloudinary ✓
-   [ ] Save to database ✓
-   [ ] Load saved image ✓

## 📞 Quick Troubleshooting

| Problem          | Solution                     |
| ---------------- | ---------------------------- |
| Upload fails     | Check Cloudinary credentials |
| Crop not working | Refresh page                 |
| Can't save       | Verify slideIndex & riddleId |
| Slow upload      | Check internet connection    |

## 📚 Documentation

| Doc                               | Purpose                |
| --------------------------------- | ---------------------- |
| `FEATURE_IMAGE_UPLOAD_CROP.md`    | Complete feature docs  |
| `SETUP_IMAGE_UPLOAD.md`           | Setup instructions     |
| `IMPLEMENTATION_IMAGE_UPLOAD.md`  | Implementation summary |
| `VISUAL_GUIDE_IMAGE_UPLOAD.md`    | Visual flow guide      |
| `QUICK_REFERENCE_IMAGE_UPLOAD.md` | This file (quick ref)  |

## 🎓 Code Snippets

### API Call Example:

```typescript
const response = await fetch("/api/upload-image", {
    method: "POST",
    body: JSON.stringify({
        image: base64Data,
        folder: "riddles/123",
        public_id: "slide-0-123456789",
    }),
});
```

### Response:

```json
{
    "success": true,
    "data": {
        "url": "https://res.cloudinary.com/.../image.jpg",
        "width": 1080,
        "height": 1920
    }
}
```

## ⚙️ Technical Stack

```
Frontend:          Backend:         Storage:
- React            - Next.js        - Cloudinary
- TypeScript       - Node.js        - MongoDB
- React Image Crop - API Routes
- Shadcn/ui
```

## 📊 Supported Categories

✅ Riddles
✅ Sites
✅ Topics

## 🎨 UI Components Used

-   Dialog (modal)
-   Button
-   ReactCrop (crop tool)
-   Toast (notifications)
-   Lucide Icons

## 🔒 Security

✅ File type validation
✅ Signed uploads
✅ Server-side processing
✅ Environment variables
✅ Error handling

## 📈 Performance

-   Image optimization: ✅
-   Lazy loading: ✅
-   CDN delivery: ✅
-   JPEG compression (95%): ✅

## 🌟 Best Practices

1. **Use high-quality images** (min 1080px width)
2. **Wait for upload** to complete before saving
3. **Crop carefully** to avoid losing content
4. **Monitor Cloudinary quota** for free plan

## 💰 Cloudinary Free Tier

-   25 GB storage
-   25 GB bandwidth/month
-   Unlimited images
-   Auto-optimization included

## 🚀 Next Steps

After setup:

1. Add environment variables
2. Test locally with `pnpm dev`
3. Deploy to Vercel with env vars
4. Test in production
5. Monitor usage

## 📝 Notes

-   Aspect ratio auto-locked to slide dimensions
-   Upload organized by category/ID
-   Original files not stored (only cropped version)
-   URLs are HTTPS and permanent

## 🎯 Key Improvements Over Old System

| Before                | After                  |
| --------------------- | ---------------------- |
| Only AI-generated     | ✅ AI + Custom uploads |
| No cropping           | ✅ Smart crop tool     |
| No persistence option | ✅ Save to database    |
| Random refresh        | ✅ Controlled updates  |

## 🔗 Quick Links

-   [Cloudinary Dashboard](https://cloudinary.com/console)
-   [React Image Crop Docs](https://www.npmjs.com/package/react-image-crop)
-   [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Version:** 1.0.0  
**Last Updated:** November 20, 2025  
**Status:** ✅ Production Ready
