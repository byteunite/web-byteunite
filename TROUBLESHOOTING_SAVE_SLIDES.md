# Quick Troubleshooting Guide - Save Slides Feature

## 🚨 Common Errors & Solutions

### Error 1: "Attempting to parse unsupported color function oklch"

**Cause**: html2canvas doesn't support modern CSS color functions like `oklch()`

**Solution**: ✅ Fixed in SaveSlidesButton.tsx

-   Automatically converts oklch colors to hex before capture
-   Uses `onclone` callback to preprocess colors

**Manual Check**:

```javascript
// Check if you have oklch colors in your CSS
document.querySelectorAll("[style*='oklch']").length;
```

---

### Error 2: "Slide element X tidak ditemukan"

**Cause**: Selector couldn't find the correct slide element

**Solution**: ✅ Fixed with improved element selection

-   Smart filtering to find actual slide container
-   Fallback to largest element by area
-   Better logging for debugging

**Manual Check**:

```javascript
// Check if slide wrappers exist
document.querySelectorAll("[data-slide-index]").length;

// Check specific slide
document.querySelector('[data-slide-index="0"]');
```

---

### Error 3: "Main container tidak ditemukan"

**Cause**: Page structure changed or not loaded

**Solution**:

1. Ensure you're on the template detail page
2. Wait for page to fully load
3. Check container exists:

```javascript
document.querySelector('div[class*="bg-white relative"]');
```

---

### Error 4: Images not uploading to ImageKit

**Cause**: Invalid credentials or network issues

**Solutions**:

1. Check `.env.local` has correct ImageKit credentials
2. Verify credentials on ImageKit dashboard
3. Check browser network tab for API errors
4. Restart dev server after changing env variables

```bash
# Restart server
npm run dev
# or
pnpm dev
```

---

### Error 5: "Failed to fetch" or Network Error

**Cause**: API endpoint not responding

**Solutions**:

1. Check server is running
2. Verify API endpoint exists: `/api/riddles/save-slides`
3. Check browser console and server logs
4. Test API directly:

```javascript
fetch("/api/riddles/save-slides", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ riddleId: "test", images: [] }),
});
```

---

## 🔍 Debugging Steps

### Step 1: Open Browser Console (F12)

Check for errors:

-   Red errors = critical issues
-   Yellow warnings = may need attention
-   Blue logs = informational

### Step 2: Check Network Tab

Filter by "save-slides" to see API request:

-   Status 200 = Success ✅
-   Status 400 = Bad request (check data)
-   Status 401 = Authentication issue
-   Status 500 = Server error

### Step 3: Check Server Logs

Look at terminal where dev server is running:

-   API errors
-   ImageKit upload errors
-   Database connection issues

### Step 4: Verify Data

```javascript
// In browser console
const riddleId = window.location.pathname.split("/").pop();
console.log("Riddle ID:", riddleId);
console.log(
    "Total slides:",
    document.querySelectorAll("[data-slide-index]").length
);
```

---

## ✅ Quick Fixes

### Fix 1: Clear Browser Cache

```
Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
Or: Hard Refresh with Ctrl+F5
```

### Fix 2: Restart Dev Server

```bash
# Kill server (Ctrl+C)
# Then restart
npm run dev
```

### Fix 3: Reinstall Dependencies

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Fix 4: Check Environment Variables

```bash
# View current env vars (don't commit this!)
cat .env.local

# Should have:
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=xxx
IMAGEKIT_PRIVATE_KEY=xxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=xxx
```

---

## 🧪 Test Checklist

Before reporting a bug, verify:

-   [ ] Dev server is running without errors
-   [ ] On correct page: `/template/[id]?format=save`
-   [ ] Button is visible at bottom of page
-   [ ] Browser console has no errors before clicking
-   [ ] ImageKit credentials are valid
-   [ ] Network connection is stable
-   [ ] Slides are fully loaded (wait 2-3 seconds)

---

## 📊 Expected Behavior

### Normal Flow:

```
1. Click "Save All Slides to Cloud" button
2. Status: "Memulai proses capture..."
3. Progress: 0% → 50% (Capturing each slide)
4. Status: "Capturing slide X of Y..."
5. Status: "Mengupload gambar ke cloud storage..."
6. Progress: 50% → 100% (Uploading)
7. Status: "✅ Semua slide berhasil disimpan!"
8. Page auto-refreshes after 2 seconds
```

### Total Time:

-   5 slides: ~10-20 seconds
-   10 slides: ~20-40 seconds
-   Depends on: slide complexity, image count, network speed

---

## 🆘 Still Having Issues?

### Collect This Info:

1. **Error Message**: Full text from console
2. **Browser**: Chrome/Firefox/Safari + version
3. **Page URL**: The exact URL you're on
4. **Network Tab**: Screenshot of failed request
5. **Console Logs**: Full error stack trace

### Where to Get Help:

1. Check `FIX_SAVE_SLIDES_ERRORS.md` for detailed fixes
2. Review `SAVE_SLIDES_FEATURE.md` for setup
3. Check GitHub issues for similar problems
4. Create detailed bug report with info above

---

## 💡 Pro Tips

### Tip 1: Test with Simple Riddle First

Start with a riddle that has 2-3 slides to verify functionality.

### Tip 2: Monitor Progress

Watch the progress bar and status messages - they indicate exactly what's happening.

### Tip 3: Check ImageKit Dashboard

After successful upload, verify images appear in ImageKit dashboard under `/riddles/[id]`.

### Tip 4: Use Logging

The fix includes detailed console.log statements. Check them for clues.

### Tip 5: Wait for Images

If slides have many images, wait a few seconds before clicking save.

---

## 🔧 Advanced Debugging

### Enable html2canvas Logging:

```typescript
// In SaveSlidesButton.tsx, change:
logging: false,  // to
logging: true,
```

### Test Single Slide Capture:

```javascript
// In browser console
const slide = document.querySelector('[data-slide-index="0"]');
html2canvas(slide).then((canvas) => {
    document.body.appendChild(canvas);
});
```

### Test ImageKit Connection:

```javascript
// In browser console
fetch("/api/riddles/save-slides", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        riddleId: "test-id",
        images: [
            {
                slideIndex: 0,
                dataUrl: "data:image/png;base64,test",
            },
        ],
    }),
})
    .then((r) => r.json())
    .then(console.log);
```

---

**Last Updated**: October 25, 2025
**Version**: 2.0 (with oklch and selector fixes)
