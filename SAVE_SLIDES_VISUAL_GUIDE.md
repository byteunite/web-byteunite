# Save Slides Feature - Visual Guide

## 🎯 Feature Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Normal Mode                              │
│  URL: /template/[id]                                        │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Slide 1  │  Slide 2  │  Slide 3  │  Slide 4  │ ... │     │
│  └───────────────────────────────────────────────────┘     │
│                                                              │
│  [No Save Button]                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Save Mode                                │
│  URL: /template/[id]?format=save                            │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Slide 1  │  Slide 2  │  Slide 3  │  Slide 4  │ ... │     │
│  └───────────────────────────────────────────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │  💾 Save All Slides to Cloud                     │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Process Flow

### Step 1: User Access

```
User enters URL with ?format=save parameter
                ↓
        Page renders normally
                ↓
    SaveSlidesButton appears at bottom
```

### Step 2: Capture Process

```
User clicks "Save All Slides to Cloud"
                ↓
┌───────────────────────────────────────┐
│ For each slide (0 to totalSlides-1): │
├───────────────────────────────────────┤
│ 1. Find element by data-slide-index  │
│ 2. html2canvas(element)               │
│ 3. canvas.toDataURL("image/png")     │
│ 4. Store in array                     │
└───────────────────────────────────────┘
                ↓
    Progress: 0% → 50% (Capturing)
```

### Step 3: Upload Process

```
POST /api/riddles/save-slides
                ↓
┌───────────────────────────────────────┐
│ For each captured image:              │
├───────────────────────────────────────┤
│ 1. Extract base64 from dataURL       │
│ 2. imagekit.upload(base64)           │
│ 3. Get secure URL                     │
│ 4. Update slide.saved_image_url       │
└───────────────────────────────────────┘
                ↓
    Progress: 50% → 100% (Uploading)
                ↓
        Save to MongoDB
                ↓
    Return success/failure results
```

### Step 4: Completion

```
Client receives response
                ↓
    Show success message
                ↓
    Wait 2 seconds
                ↓
    window.location.reload()
```

## 📊 Data Structure

### Client-Side (SaveSlidesButton)

```typescript
// State Management
const [loading, setLoading] = useState(false);
const [progress, setProgress] = useState(0); // 0-100
const [status, setStatus] = useState("");

// Captured Images Array
const capturedImages: Array<{
    slideIndex: number;
    dataUrl: string; // "data:image/png;base64,..."
}>;
```

### API Request Format

```json
{
    "riddleId": "507f1f77bcf86cd799439011",
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

### API Response Format

```json
{
    "success": true,
    "message": "Successfully saved 5 out of 5 slides",
    "data": {
        "riddleId": "507f1f77bcf86cd799439011",
        "uploadResults": [
            {
                "slideIndex": 0,
                "imageUrl": "https://ik.imagekit.io/.../slide-0.png",
                "success": true
            },
            {
                "slideIndex": 1,
                "imageUrl": "https://ik.imagekit.io/.../slide-1.png",
                "success": true
            }
        ],
        "successCount": 5,
        "totalCount": 5
    }
}
```

### Database Schema

```javascript
// Before save
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Programming Riddle",
  "carouselData": {
    "slides": [
      {
        "tipe_slide": "COVER",
        "judul_slide": "Test Your Skills",
        "sub_judul_slide": "Programming Challenge",
        "konten_slide": "Content here...",
        "prompt_untuk_image": "A computer coding...",
        // saved_image_url: undefined (not exists)
      }
    ]
  }
}

// After save
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Programming Riddle",
  "carouselData": {
    "slides": [
      {
        "tipe_slide": "COVER",
        "judul_slide": "Test Your Skills",
        "sub_judul_slide": "Programming Challenge",
        "konten_slide": "Content here...",
        "prompt_untuk_image": "A computer coding...",
        "saved_image_url": "https://ik.imagekit.io/xyz/riddles/507f1f77bcf86cd799439011/riddle-507f1f77bcf86cd799439011-slide-0-1698765432100.png" // ✅ NEW
      }
    ]
  }
}
```

## 🎨 UI Components

### SaveSlidesButton Component

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  Progress: Capturing slide 3 of 5...       60%  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░        │
│                                                  │
│  ┌────────────────────────────────────────────┐│
│  │  ⏳ Processing...                          ││
│  └────────────────────────────────────────────┘│
│                                                  │
│  Akan menyimpan 5 slides sebagai gambar ke      │
│  cloud storage                                   │
│                                                  │
└─────────────────────────────────────────────────┘
```

### States

```
Initial State:
┌──────────────────────────────────────┐
│  💾 Save All Slides to Cloud         │
└──────────────────────────────────────┘

Loading State:
┌──────────────────────────────────────┐
│  ⏳ Processing...                    │
└──────────────────────────────────────┘

Success State:
Status: "✅ Semua slide berhasil disimpan!"
Progress: 100%
[Auto-refresh in 2 seconds]

Error State:
Status: "❌ Terjadi kesalahan: Error message here"
```

## 🔧 Configuration Files

### .env.local (Required)

```env
# ImageKit (Default)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# OR Cloudinary (Alternative)
# CLOUDINARY_CLOUD_NAME=your_cloud
# CLOUDINARY_API_KEY=123456789
# CLOUDINARY_API_SECRET=xxxxxxxxxxxxx
```

### package.json (Dependencies)

```json
{
    "dependencies": {
        "html2canvas": "^1.4.1",
        "imagekit": "^6.0.0"
    }
}
```

### Optional (Cloudinary)

```bash
npm install cloudinary
```

## 📁 File Structure

```
project/
├── components/
│   └── SaveSlidesButton.tsx          # Client component
│
├── app/
│   ├── (template-post)/
│   │   └── template/
│   │       └── [id]/
│   │           └── page.tsx           # Updated with ?format=save
│   │
│   └── api/
│       └── riddles/
│           ├── save-slides/
│           │   └── route.ts           # ImageKit endpoint
│           └── save-slides-cloudinary/
│               └── route.ts           # Cloudinary endpoint (optional)
│
├── .env.example                       # Environment template
├── .env.local                         # Your credentials (gitignored)
│
├── SAVE_SLIDES_QUICKSTART.md         # Quick start guide
├── SAVE_SLIDES_FEATURE.md            # Full documentation
├── IMPLEMENTATION_SUMMARY.md          # Technical summary
└── SAVE_SLIDES_VISUAL_GUIDE.md       # This file
```

## 🔐 Security Flow

```
Client Request
      ↓
┌─────────────────────┐
│ Authentication?     │  ← Not implemented yet
│ (TODO)              │     Recommended to add
└─────────────────────┘
      ↓
┌─────────────────────┐
│ Rate Limiting?      │  ← Not implemented yet
│ (TODO)              │     Recommended to add
└─────────────────────┘
      ↓
┌─────────────────────┐
│ Validate Input      │  ✅ Implemented
│ - riddleId valid?   │
│ - images array?     │
│ - slideIndex valid? │
└─────────────────────┘
      ↓
┌─────────────────────┐
│ Check Riddle Exists │  ✅ Implemented
└─────────────────────┘
      ↓
┌─────────────────────┐
│ Upload to Cloud     │  ✅ Implemented
│ - ImageKit/         │
│   Cloudinary        │
└─────────────────────┘
      ↓
┌─────────────────────┐
│ Update Database     │  ✅ Implemented
└─────────────────────┘
      ↓
   Response
```

## 📈 Performance Metrics

### Expected Times (approximate)

```
Per Slide:
├── Capture (html2canvas): ~200-500ms
├── Base64 conversion: ~50-100ms
└── Upload to cloud: ~500-2000ms (depends on size & connection)

Total for 5 slides:
├── Capture phase: ~1-2.5 seconds
├── Upload phase: ~2.5-10 seconds
└── Database save: ~200-500ms
────────────────────────────────
TOTAL: ~4-13 seconds
```

### Optimization Strategies

```
Current: Sequential Processing
Slide 1 → Slide 2 → Slide 3 → Slide 4 → Slide 5
[═════][═════][═════][═════][═════]

Alternative: Parallel Upload
Slide 1 ┐
Slide 2 ├─→ Upload simultaneously
Slide 3 ├─→ (after all captured)
Slide 4 ├─→
Slide 5 ┘
[═════]
  └─→ 2-5x faster upload phase
```

## 🎓 Usage Examples

### Example 1: Test with Single Riddle

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
http://localhost:3000/template/6735a1b2c3d4e5f6a7b8c9d0?format=save

# 3. Click button and wait

# 4. Check ImageKit dashboard
https://imagekit.io/dashboard/media-library
```

### Example 2: Verify Saved URLs

```javascript
// In MongoDB or API
db.riddles.findOne({ _id: ObjectId("6735a1b2c3d4e5f6a7b8c9d0") });

// Check output:
{
    carouselData: {
        slides: [
            {
                // ... other fields
                saved_image_url: "https://ik.imagekit.io/...", // ✅ Should exist
            },
        ];
    }
}
```

### Example 3: Use Saved Images

```tsx
// In your component
<img
    src={slide.saved_image_url || slide.prompt_untuk_image}
    alt={slide.judul_slide}
/>

// Priority: saved_image_url > prompt_untuk_image
```

## 🐛 Debugging Tips

### Client-Side Debugging

```javascript
// In browser console
console.log("Slide wrappers:", document.querySelectorAll("[data-slide-index]"));
console.log("First slide:", document.querySelector('[data-slide-index="0"]'));
```

### Server-Side Debugging

```typescript
// In API route
console.log("Received images count:", images.length);
console.log("Upload result:", uploadResponse);
console.log("Database update:", riddle.carouselData.slides[0].saved_image_url);
```

### Network Debugging

```
Chrome DevTools → Network Tab
├── Filter: Fetch/XHR
├── Look for: "save-slides"
├── Check: Request payload
├── Check: Response
└── Check: Status code
```

## 🎉 Success Indicators

✅ Button appears when ?format=save is in URL
✅ Progress bar shows 0-100%
✅ Status text updates during process
✅ Success message appears
✅ Page auto-refreshes
✅ Images visible in ImageKit dashboard
✅ saved_image_url populated in database
✅ No console errors

---

Made with ❤️ for ByteUnite
