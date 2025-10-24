# Quick Start - Save Slides Feature

## Setup ImageKit (Recommended)

### 1. Get ImageKit Credentials

-   Sign up at https://imagekit.io
-   Go to https://imagekit.io/dashboard/developer/api-keys
-   Copy: Public Key, Private Key, and URL Endpoint

### 2. Add to Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### 3. Test the Feature

1. Run the development server:

    ```bash
    npm run dev
    ```

2. Open a riddle template with `?format=save`:

    ```
    http://localhost:3000/template/[riddle-id]?format=save
    ```

3. Click "Save All Slides to Cloud" button at the bottom

4. Watch the progress and wait for completion

5. Check ImageKit dashboard to see uploaded images

## Usage

### Access Save Mode

Add `?format=save` to any riddle template URL:

```
/template/123?format=save
```

### Button Appears

A button will appear at the bottom of the page

### Process Flow

1. Click button
2. Each slide gets captured as PNG
3. Images uploaded to ImageKit
4. URLs saved to database in `saved_image_url` field
5. Page auto-refreshes on completion

## Alternative: Cloudinary

If you prefer Cloudinary over ImageKit:

### 1. Install Cloudinary

```bash
npm install cloudinary
```

### 2. Setup Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Update SaveSlidesButton Component

Change the API endpoint in `components/SaveSlidesButton.tsx`:

```typescript
const response = await fetch("/api/riddles/save-slides-cloudinary", {
    method: "POST",
    // ... rest of the code
});
```

## Troubleshooting

### Button Not Showing

-   Make sure URL has `?format=save` parameter
-   Check browser console for errors

### Upload Fails

-   Verify environment variables are correct
-   Check ImageKit/Cloudinary dashboard for quota
-   Check browser console and server logs

### Images Not Saving to Database

-   Verify MongoDB connection
-   Check API route logs
-   Ensure riddle ID is valid

## For More Details

See `SAVE_SLIDES_FEATURE.md` for complete documentation.
