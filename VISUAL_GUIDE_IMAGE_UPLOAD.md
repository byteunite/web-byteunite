# 🖼️ Visual Guide: Image Upload & Crop Feature

## 📸 Screenshots & Flow

### 1. Initial State - Image Display

```
┌─────────────────────────────────────┐
│                                     │
│    [Generated Image from AI]        │
│                                     │
│    Click to see options →           │
│                                     │
└─────────────────────────────────────┘
```

### 2. Options Modal (Step 1)

```
┌──────────── Opsi Gambar ────────────┐
│                                     │
│  Pilih aksi yang ingin Anda        │
│  lakukan dengan gambar ini          │
│                                     │
│  ┌────────────────────────────┐    │
│  │  📤  Upload Gambar         │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │  🔄  Ganti Gambar          │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │  💾  Simpan ke Database    │    │
│  └────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### 3. File Selection

User clicks "Upload Gambar" → File picker opens

```
┌──────── Select File ────────┐
│                             │
│  📁 Documents               │
│  📁 Pictures                │
│  📁 Downloads               │
│     └─ image1.jpg ✓        │
│     └─ photo.png            │
│     └─ screenshot.webp      │
│                             │
│  [Cancel]  [Open]           │
└─────────────────────────────┘
```

### 4. Crop Modal (Step 2)

```
┌────────────── Crop Gambar ──────────────┐
│                                         │
│  Sesuaikan area crop sesuai proporsi    │
│  gambar slide (1080x1920px)             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ╔═════════════════════════╗    │   │
│  │  ║                         ║    │   │
│  │  ║    [Cropped Area]       ║    │   │
│  │  ║                         ║    │   │
│  │  ║    Aspect Ratio: 9:16   ║    │   │
│  │  ║                         ║    │   │
│  │  ╚═════════════════════════╝    │   │
│  │      (Full Image Preview)       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ 📤 Upload &  │  │    Batal     │   │
│  │    Simpan    │  │              │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
│  * Gambar akan di-crop sesuai area     │
│    yang dipilih dan disesuaikan        │
│    dengan ukuran 1080x1920 pixel       │
│                                         │
└─────────────────────────────────────────┘
```

### 5. Uploading State

```
┌────────────── Crop Gambar ──────────────┐
│                                         │
│  [Cropped Image Preview]                │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  ⌛ Mengupload...                 │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 6. Upload Success - Back to Options Modal

```
┌──────────── Opsi Gambar ────────────┐
│                                     │
│  ┌────────────────────────────┐    │
│  │  📤  Upload Gambar         │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │  🔄  Ganti Gambar          │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │  💾  Simpan ke Database    │    │
│  └────────────────────────────┘    │
│                                     │
│  ┌────────────────────────────┐    │
│  │  ✓ Gambar terupload        │    │
│  │  https://res.cloudinary... │    │
│  └────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### 7. Saving to Database

```
┌──────────── Opsi Gambar ────────────┐
│                                     │
│  ┌────────────────────────────┐    │
│  │  ⌛ Menyimpan...           │    │
│  └────────────────────────────┘    │
│                                     │
│  ✓ Gambar terupload                │
│  https://res.cloudinary...         │
│                                     │
└─────────────────────────────────────┘
```

### 8. Final Success

```
┌─────────── Toast Notification ──────┐
│  ✅ Berhasil!                       │
│  Gambar slide 1 berhasil disimpan   │
└─────────────────────────────────────┘

[Modal closes automatically]
[Slide now shows uploaded image]
```

## 🎬 Interaction Flow

### Flow A: Upload New Image

```
1. User sees slide image
   ↓
2. Clicks on image
   ↓
3. Modal opens with 3 options
   ↓
4. Clicks "Upload Gambar"
   ↓
5. File picker opens
   ↓
6. Selects image file
   ↓
7. Crop modal opens
   ↓
8. Adjusts crop area (locked aspect ratio)
   ↓
9. Clicks "Upload & Simpan"
   ↓
10. Image uploads to Cloudinary (loading...)
    ↓
11. Upload success! URL shown
    ↓
12. Back to options modal
    ↓
13. Clicks "Simpan ke Database"
    ↓
14. URL saved to MongoDB
    ↓
15. Success toast appears
    ↓
16. Modal closes
    ↓
17. Slide shows new image
```

### Flow B: Refresh AI Image

```
1. Clicks on image
   ↓
2. Clicks "Ganti Gambar"
   ↓
3. New AI image generates
   ↓
4. (Optional) Click "Simpan ke Database"
```

### Flow C: Direct Save

```
1. Clicks on image
   ↓
2. Clicks "Simpan ke Database"
   ↓
3. Current URL saved to DB
   ↓
4. Success!
```

## 🖱️ User Interactions

### Interactive Elements:

1. **Image Click**

    - Hover: Opacity 90%
    - Click: Opens modal
    - Cursor: Pointer

2. **Upload Button**

    - Icon: 📤 Upload
    - State: Enabled/Disabled
    - Triggers: File picker

3. **Crop Area**

    - Draggable: Yes
    - Resizable: Yes
    - Aspect Ratio: Locked
    - Handles: 8 corners/edges

4. **Upload & Simpan Button**

    - State: Disabled until crop complete
    - Loading: Spinner animation
    - Success: Transitions to main modal

5. **Save to Database Button**
    - State: Disabled if no data
    - Loading: Spinner animation
    - Success: Toast + close modal

## 📱 Responsive Behavior

### Desktop (>768px)

```
┌────────────────────────────────────┐
│                                    │
│  [   Large Crop Preview   ]        │
│                                    │
│  [Upload] [Cancel]                 │
│                                    │
└────────────────────────────────────┘
```

### Mobile (<768px)

```
┌────────────────┐
│                │
│  [ Crop Area ] │
│                │
│  [Upload]      │
│  [Cancel]      │
│                │
└────────────────┘
```

## 🎨 Visual States

### Loading States:

1. **Initial Image Load**

    ```
    ┌──────────┐
    │  ⌛      │
    │ Loading  │
    └──────────┘
    ```

2. **Uploading**

    ```
    ⌛ Mengupload...
    ```

3. **Saving**
    ```
    ⌛ Menyimpan...
    ```

### Success States:

1. **Upload Success**

    ```
    ✓ Gambar terupload
    https://res.cloudinary.com/...
    ```

2. **Save Success**
    ```
    Toast: ✅ Berhasil!
    Gambar slide 1 berhasil disimpan
    ```

### Error States:

1. **Invalid File**

    ```
    ❌ Error
    File harus berupa gambar
    ```

2. **Upload Failed**

    ```
    ❌ Error
    Gagal mengupload gambar
    ```

3. **Save Failed**
    ```
    ❌ Error
    Gagal menyimpan gambar ke database
    ```

## 🎯 Key Visual Features

### 1. **Crop Tool**

-   Transparent overlay outside crop area
-   Dashed border for crop area
-   8 resize handles (corners + edges)
-   Real-time preview
-   Locked aspect ratio indicator

### 2. **Upload Progress**

-   Button text changes
-   Spinner icon replaces upload icon
-   Button disabled during upload
-   Smooth transition

### 3. **URL Display**

-   Green background highlight
-   Truncated text with ellipsis
-   Checkmark icon
-   Small font size

### 4. **Modal Animations**

-   Fade in/out
-   Slide up effect
-   Backdrop blur
-   Z-index 1000

## 📐 Dimensions Reference

### Slide Dimensions:

-   **Riddles**: 1080 x 1920 (9:16)
-   **Sites**: 1080 x 1920 (9:16)
-   **Topics**: 1080 x 1920 (9:16)

### Crop Aspect Ratio:

```
aspect = width / height
aspect = 1080 / 1920
aspect = 0.5625 (9:16)
```

### Modal Sizes:

-   **Options Modal**: max-w-[425px]
-   **Crop Modal**: max-w-[800px]
-   **Mobile**: Full width - 32px padding

## 🔄 State Transitions

```
State Machine:

IDLE → (click) → MODAL_OPEN
MODAL_OPEN → (upload) → FILE_SELECT
FILE_SELECT → (select) → CROP_MODAL
CROP_MODAL → (crop) → UPLOADING
UPLOADING → (success) → UPLOAD_SUCCESS
UPLOAD_SUCCESS → (save) → SAVING
SAVING → (success) → IDLE

Alternative flows:
MODAL_OPEN → (refresh) → IDLE
MODAL_OPEN → (save) → SAVING → IDLE
CROP_MODAL → (cancel) → MODAL_OPEN
```

## 💡 Visual Feedback Examples

### Good State:

```
✅ All green, checkmark visible
Toast notification with success message
Modal closes smoothly
Image updates immediately
```

### Warning State:

```
⚠️ Yellow highlight
"Data slide tidak lengkap"
Buttons remain disabled
Helper text shown
```

### Error State:

```
❌ Red toast notification
Error message clear and specific
Modal remains open
User can retry
```

---

**Note**: These are ASCII art representations. Actual UI uses proper React components with Tailwind CSS styling and Shadcn/ui design system.
