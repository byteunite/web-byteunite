# 🎯 Fix: Puppeteer Deployment on Vercel

## ❌ Problem

Error saat deploy ke Vercel:

```
Screenshot error: Error: The input directory "/var/task/.next/server/app/api/riddles/bin" does not exist.
```

## 🔍 Root Cause

-   Puppeteer standar terlalu besar untuk Vercel (>250MB limit)
-   Path ke Chromium binary tidak ditemukan di environment Vercel
-   Next.js mencoba membundle puppeteer-core dan @sparticuz/chromium

## ✅ Solution

Mengikuti guide resmi Vercel: https://vercel.com/guides/deploying-puppeteer-with-nextjs-on-vercel

### 1. Package Dependencies

```json
{
    "dependencies": {
        "puppeteer-core": "^24.26.1", // Lightweight version untuk production
        "@sparticuz/chromium": "115.0.0" // Minimal Chromium untuk Vercel
    },
    "devDependencies": {
        "puppeteer": "^24.26.1" // Full version untuk local development
    }
}
```

### 2. Next.js Configuration (`next.config.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... existing config ...

    // Required for Puppeteer on Vercel
    // Prevents Next.js from bundling these packages
    experimental: {
        serverComponentsExternalPackages: [
            "@sparticuz/chromium",
            "puppeteer-core",
        ],
    },
};

export default nextConfig;
```

> **Note**: In Next.js 14.2.x, use `experimental.serverComponentsExternalPackages` instead of `serverExternalPackages`

### 3. Dynamic Imports in API Routes

Menggunakan dynamic imports untuk load puppeteer berdasarkan environment:

```typescript
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

// Detect if running on Vercel
const isVercel = !!process.env.VERCEL_ENV;

export async function POST(request: NextRequest) {
    try {
        // Dynamic import of puppeteer based on environment
        let puppeteer: any;
        let launchOptions: any = {
            headless: true,
        };

        if (isVercel) {
            // On Vercel: use puppeteer-core with @sparticuz/chromium
            const chromium = (await import("@sparticuz/chromium")).default;
            puppeteer = await import("puppeteer-core");
            launchOptions = {
                ...launchOptions,
                args: chromium.args,
                executablePath: await chromium.executablePath(),
            };
        } else {
            // Local development: use full puppeteer
            puppeteer = await import("puppeteer");
            launchOptions = {
                ...launchOptions,
                args: ["--no-sandbox"],
                executablePath:
                    process.platform === "win32"
                        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
                        : process.platform === "darwin"
                        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
                        : "/usr/bin/google-chrome",
            };
        }

        // Launch browser
        const browser = await puppeteer.launch(launchOptions);

        // ... rest of your code ...
    } catch (error) {
        // ... error handling ...
    }
}
```

## 📝 Files Changed

### ✅ Updated Files:

1. **`next.config.mjs`**

    - Added `experimental.serverComponentsExternalPackages` configuration (for Next.js 14.2.x)

2. **`app/api/riddles/screenshot-full/route.ts`**

    - Added dynamic imports for puppeteer/puppeteer-core
    - Changed environment detection from `NODE_ENV` to `VERCEL_ENV`
    - Added runtime export: `export const runtime = "nodejs"`

3. **`app/api/riddles/screenshot/route.ts`**

    - Same changes as screenshot-full route

4. **`package.json`**
    - Moved `puppeteer` to devDependencies
    - Kept `puppeteer-core` and `@sparticuz/chromium` in dependencies

## 🎯 Key Changes Summary

| Before                                                       | After                                         |
| ------------------------------------------------------------ | --------------------------------------------- |
| `import puppeteer from "puppeteer-core"`                     | Dynamic import berdasarkan environment        |
| `const isProduction = process.env.NODE_ENV === "production"` | `const isVercel = !!process.env.VERCEL_ENV`   |
| Static imports                                               | Dynamic imports dengan `await import()`       |
| No serverComponentsExternalPackages                          | Added to next.config.mjs experimental section |

## 🚀 How It Works

### Local Development:

-   Uses full `puppeteer` package (from devDependencies)
-   Bundles own Chrome browser
-   Uses local Chrome installation path

### Vercel Production:

-   Uses lightweight `puppeteer-core` (no browser bundled)
-   Uses `@sparticuz/chromium` (minimal Chromium ~50MB)
-   Automatically detects via `VERCEL_ENV` environment variable
-   Chromium binary fetched at runtime

## ✅ Benefits

-   ✅ Works on both local and Vercel
-   ✅ Under Vercel's 250MB function limit
-   ✅ No manual Chrome installation needed
-   ✅ Automatic environment detection
-   ✅ Better bundle optimization

## 🧪 Testing

### Local:

```bash
pnpm dev
# Test screenshot endpoints
```

### Vercel:

```bash
vercel --prod
# Screenshot API will automatically use puppeteer-core + @sparticuz/chromium
```

## 📚 References

-   [Official Vercel Guide: Deploying Puppeteer with Next.js](https://vercel.com/guides/deploying-puppeteer-with-nextjs-on-vercel)
-   [@sparticuz/chromium on npm](https://www.npmjs.com/package/@sparticuz/chromium)
-   [puppeteer-core documentation](https://pptr.dev/)

## ⚠️ Important Notes

1. **Don't** import puppeteer statically at the top level
2. **Do** use dynamic imports with environment detection
3. **Always** add `serverExternalPackages` to next.config.mjs
4. **Use** `VERCEL_ENV` not `NODE_ENV` for Vercel detection
5. **Keep** puppeteer in devDependencies, puppeteer-core in dependencies

---

**Status**: ✅ Fixed and ready for deployment
**Date**: October 25, 2025
