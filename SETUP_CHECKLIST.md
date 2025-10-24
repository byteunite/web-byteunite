# Save Slides Feature - Setup Checklist

## ✅ Pre-Implementation Checklist

-   [x] Dependencies installed (`html2canvas`, `imagekit`)
-   [x] Components created (`SaveSlidesButton.tsx`)
-   [x] API routes created (`/api/riddles/save-slides`)
-   [x] Page updated with searchParams support
-   [x] Documentation complete

## 📋 Setup Checklist (Complete These Steps)

### 1. ImageKit Account Setup

-   [ ] Sign up at https://imagekit.io
-   [ ] Verify email address
-   [ ] Complete account setup

### 2. Get ImageKit Credentials

-   [ ] Go to https://imagekit.io/dashboard/developer/api-keys
-   [ ] Copy Public Key
-   [ ] Copy Private Key
-   [ ] Copy URL Endpoint

### 3. Environment Configuration

-   [ ] Create `.env.local` file in project root
-   [ ] Add `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
-   [ ] Add `IMAGEKIT_PRIVATE_KEY`
-   [ ] Add `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
-   [ ] Verify no trailing slashes in URL endpoint
-   [ ] Verify no extra spaces in values

### 4. Verify Installation

-   [ ] Run `npm install` (if not already done)
-   [ ] Check `package.json` has `html2canvas` and `imagekit`
-   [ ] No errors in terminal

### 5. Start Development Server

-   [ ] Run `npm run dev`
-   [ ] Server starts without errors
-   [ ] No environment variable warnings

### 6. Test the Feature

#### 6.1 Access Test

-   [ ] Open a riddle template page
-   [ ] Add `?format=save` to URL
-   [ ] Button appears at bottom
-   [ ] Button is visible and clickable

#### 6.2 Capture Test

-   [ ] Click "Save All Slides to Cloud" button
-   [ ] Progress bar appears
-   [ ] Status text shows "Capturing slide X of Y"
-   [ ] Progress goes from 0% to 50%
-   [ ] No console errors during capture

#### 6.3 Upload Test

-   [ ] Status changes to "Mengupload gambar..."
-   [ ] Progress continues from 50% to 100%
-   [ ] No network errors in DevTools
-   [ ] Success message appears
-   [ ] Page auto-refreshes after 2 seconds

#### 6.4 Verification Test

-   [ ] Open ImageKit dashboard
-   [ ] Navigate to Media Library
-   [ ] Find folder `/riddles/[your-riddle-id]`
-   [ ] Verify images are uploaded
-   [ ] Check image quality/resolution

#### 6.5 Database Test

-   [ ] Check MongoDB database
-   [ ] Find your riddle document
-   [ ] Verify `saved_image_url` field exists in slides
-   [ ] URLs point to ImageKit
-   [ ] URLs are accessible

## 🔧 Troubleshooting Checklist

### If Button Doesn't Appear

-   [ ] URL has `?format=save` parameter
-   [ ] Page is a template page (`/template/[id]`)
-   [ ] Component imported correctly
-   [ ] No JavaScript errors in console

### If Capture Fails

-   [ ] Slides are fully loaded
-   [ ] `data-slide-index` attributes present
-   [ ] html2canvas loaded successfully
-   [ ] Check browser console for errors

### If Upload Fails

-   [ ] Environment variables are correct
-   [ ] ImageKit credentials are valid
-   [ ] No typos in credentials
-   [ ] Network connection is stable
-   [ ] Check ImageKit dashboard for errors
-   [ ] Check server logs

### If Database Not Updated

-   [ ] MongoDB connection is working
-   [ ] Riddle ID is valid
-   [ ] User has write permissions
-   [ ] Check server logs for errors

## 📊 Success Criteria

### Minimum Requirements

-   [ ] Button appears with `?format=save`
-   [ ] At least 1 slide captures successfully
-   [ ] At least 1 image uploads to ImageKit
-   [ ] At least 1 `saved_image_url` saved to DB

### Full Success

-   [ ] All slides capture successfully
-   [ ] All images upload to ImageKit
-   [ ] All `saved_image_url` fields populated
-   [ ] No errors in console or logs
-   [ ] Page refreshes automatically
-   [ ] Images accessible via URLs

## 🎯 Post-Setup Tasks

### Recommended Next Steps

-   [ ] Test with different riddles
-   [ ] Test with various slide counts
-   [ ] Monitor ImageKit usage/quota
-   [ ] Add authentication (production)
-   [ ] Add rate limiting (production)
-   [ ] Add error recovery mechanism
-   [ ] Set up monitoring/logging
-   [ ] Document for team members

### Optional Improvements

-   [ ] Add retry mechanism for failed uploads
-   [ ] Implement parallel upload
-   [ ] Add image compression options
-   [ ] Create admin dashboard for managing images
-   [ ] Add bulk delete functionality
-   [ ] Implement caching strategy

## 📝 Notes

### Important Reminders

-   Never commit `.env.local` to Git
-   Monitor ImageKit quota (free tier: 20GB/month)
-   Images are public by default (consider private if needed)
-   File naming includes timestamp for uniqueness

### Common Pitfalls

-   Forgetting `?format=save` in URL
-   Wrong environment variable names
-   Spaces in environment variable values
-   Trailing slashes in URL endpoint
-   Not restarting dev server after env changes

## 📞 Need Help?

### Documentation

1. [Quick Start Guide](./SAVE_SLIDES_QUICKSTART.md)
2. [Full Feature Documentation](./SAVE_SLIDES_FEATURE.md)
3. [Visual Guide](./SAVE_SLIDES_VISUAL_GUIDE.md)
4. [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

### Debugging Steps

1. Check browser console (F12)
2. Check Network tab in DevTools
3. Check server terminal logs
4. Check ImageKit dashboard
5. Check MongoDB database

### Support Resources

-   ImageKit Documentation: https://docs.imagekit.io
-   html2canvas GitHub: https://github.com/niklasvh/html2canvas
-   Next.js Docs: https://nextjs.org/docs

---

## 🎉 Ready to Start?

1. Start from "Setup Checklist" section
2. Complete each checkbox in order
3. Test thoroughly
4. Verify success criteria
5. Deploy to production (with security improvements)

Good luck! 🚀
