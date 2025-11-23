# Fix: Video Script Persistence After Reload

## Problem

Ketika video script disimpan ke database, tanda "berhasil" muncul, tapi setelah reload halaman, video script tidak terpopulate kembali.

## Root Cause

1. **Data tidak dikirim ke component**: Meskipun API fetch data dari database mengambil field `videoScript`, data tersebut tidak dipass ke component `DownloadSlidesButton`.
2. **Component tidak initialize dari props**: Component `DownloadSlidesButton` tidak menerima atau menggunakan data `videoScript` yang sudah tersimpan di database.

## Solution

### 1. Update Interface `DownloadSlidesButton` Props

**File**: `components/DownloadSlidesButton.tsx`

Menambahkan prop `savedVideoScript` untuk menerima data dari database:

```tsx
interface DownloadSlidesButtonProps {
    slides: Slide[];
    riddleId: string;
    caption: string;
    hashtags: string[];
    category?: string;
    contentId?: string;
    savedVideoScript?: {
        // ✅ NEW
        script: string;
        estimatedDuration: string;
        tips: string[];
    } | null;
}
```

### 2. Initialize State Dengan Data Dari Database

**File**: `components/DownloadSlidesButton.tsx`

```tsx
// Initialize videoScript state dengan data dari database
const [videoScript, setVideoScript] = useState<{
    script: string;
    estimatedDuration: string;
    tips: string[];
} | null>(savedVideoScript || null); // ✅ Initialize from prop

// Track apakah sudah tersimpan di DB
const [scriptSavedToDB, setScriptSavedToDB] = useState(!!savedVideoScript); // ✅ NEW

// Auto-show section jika sudah ada saved script
const [showScriptSection, setShowScriptSection] = useState(
    !!savedVideoScript // ✅ Show if exists
);
```

### 3. Update State Saat Props Berubah

**File**: `components/DownloadSlidesButton.tsx`

```tsx
// Update state when prop changes
useEffect(() => {
    if (savedVideoScript) {
        setVideoScript(savedVideoScript);
        setShowScriptSection(true);
        setScriptSavedToDB(true);
    }
}, [savedVideoScript]);
```

### 4. Pass Data Dari Page ke Component

**File**: `app/(template-post)/template/[id]/page.tsx`

```tsx
<DownloadSlidesButton
    slides={processedData}
    riddleId={id}
    caption={fetchedData.carouselData.caption}
    hashtags={fetchedData.carouselData.hashtags}
    category={category}
    contentId={id}
    savedVideoScript={fetchedData.videoScript || null} // ✅ Pass from DB
/>
```

### 5. Visual Indicator untuk Status "Saved"

**File**: `components/DownloadSlidesButton.tsx`

Update button "Save to DB" untuk menampilkan status berbeda:

```tsx
<Button
    onClick={saveVideoScript}
    disabled={savingScript || scriptSavedToDB} // ✅ Disable if saved
    variant={scriptSavedToDB ? "outline" : "default"} // ✅ Different style
    className={
        scriptSavedToDB ? "border-green-500 text-green-600 bg-green-50" : ""
    }
>
    {savingScript ? (
        <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
        </>
    ) : scriptSavedToDB ? (
        <>
            <Check className="h-3 w-3" />
            Saved to DB // ✅ Show "Saved" status
        </>
    ) : (
        <>
            <Download className="h-3 w-3" />
            Save to DB
        </>
    )}
</Button>
```

### 6. Update saveVideoScript Function

**File**: `components/DownloadSlidesButton.tsx`

```tsx
const saveVideoScript = async () => {
    // ... existing code ...

    if (!response.ok) {
        throw new Error("Failed to save video script");
    }

    setScriptSavedToDB(true); // ✅ Mark as saved setelah berhasil
    alert("Video script berhasil disimpan!");

    // ... existing code ...
};
```

## Flow Diagram

```
┌─────────────────────────────────────────┐
│  1. User Generate Video Script         │
│     (Click "Generate Script" button)    │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  2. API Call: /api/generate-video-script│
│     Returns: { script, duration, tips } │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  3. setVideoScript(data)                │
│     setShowScriptSection(true)          │
│     Script displayed in UI              │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  4. User Click "Save to DB"             │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  5. API Call: /api/save-video-script   │
│     MongoDB Update: videoScript field   │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  6. setScriptSavedToDB(true)            │
│     Button shows: "Saved to DB" ✓       │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  7. User Reload Page                    │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  8. Page Fetch Data from DB             │
│     getDataByCategory(id, category)     │
│     Returns: { ..., videoScript: {...} }│
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  9. Pass to DownloadSlidesButton        │
│     savedVideoScript={fetchedData.      │
│       videoScript || null}              │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│ 10. Component Initialize State          │
│     useState(savedVideoScript || null)  │
│     useState(!!savedVideoScript) [saved]│
│     useState(!!savedVideoScript) [show] │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│ 11. useEffect Triggers                  │
│     - setVideoScript(savedVideoScript)  │
│     - setShowScriptSection(true)        │
│     - setScriptSavedToDB(true)          │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│ 12. UI Shows Saved Video Script ✓       │
│     - Script content visible            │
│     - Button shows "Saved to DB"        │
│     - Section auto-expanded             │
└─────────────────────────────────────────┘
```

## Testing Checklist

-   [x] Generate video script → shows in UI
-   [x] Save to DB → button shows success
-   [x] Reload page → script still visible
-   [x] Button shows "Saved to DB" with green styling
-   [x] Button is disabled after save
-   [x] Copy buttons still work
-   [x] Works for all categories (riddles, sites, topics)

## Files Modified

1. ✅ `components/DownloadSlidesButton.tsx`

    - Added `savedVideoScript` prop
    - Initialize state from prop
    - Added `scriptSavedToDB` state
    - Added `useEffect` to sync with prop
    - Updated button styling and logic

2. ✅ `app/(template-post)/template/[id]/page.tsx`
    - Pass `savedVideoScript` prop to component

## Database Schema (Already Exists)

Schema sudah support field `videoScript`:

```typescript
// models/Riddle.ts, Site.ts, Topic.ts
videoScript: {
    type: VideoScriptSchema,
    required: false,
}
```

## API Endpoints (Already Working)

-   ✅ `POST /api/save-video-script` - Save to DB
-   ✅ `GET /api/riddles/[id]` - Fetch with videoScript
-   ✅ `GET /api/sites/[id]` - Fetch with videoScript
-   ✅ `GET /api/topics/[id]` - Fetch with videoScript

## Result

✅ **Video script sekarang persist setelah reload!**
✅ **Visual indicator menunjukkan status "Saved to DB"**
✅ **User experience lebih baik dengan auto-population**
