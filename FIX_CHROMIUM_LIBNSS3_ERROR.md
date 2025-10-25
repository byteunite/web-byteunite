# 🔧 Fix: Chromium libnss3.so Error on Vercel

## ❌ Error yang Terjadi

```
Screenshot error: Error: Failed to launch the browser process: Code: 127

stderr:
/tmp/chromium: error while loading shared libraries: libnss3.so:
cannot open shared object file: No such file or directory
```

## 🔍 Root Cause

Error ini terjadi karena **version mismatch** antara `@sparticuz/chromium` dan `puppeteer-core`:

-   ❌ **Old Version**: `@sparticuz/chromium@115.0.0` (terlalu lama)
-   ✅ **New Version**: `@sparticuz/chromium@141.0.0` (kompatibel dengan puppeteer-core 24.x)

Versi lama (115.0.0) tidak memiliki shared libraries yang dibutuhkan oleh Vercel runtime environment.

## ✅ Solution

### Update Package Version

```bash
pnpm remove @sparticuz/chromium
pnpm add @sparticuz/chromium@141.0.0
```

### Verifikasi package.json

```json
{
    "dependencies": {
        "@sparticuz/chromium": "141.0.0",
        "puppeteer-core": "^24.26.1"
        // ... other deps
    },
    "devDependencies": {
        "puppeteer": "^24.26.1"
    }
}
```

## 📊 Version Compatibility Matrix

| puppeteer-core | @sparticuz/chromium | Status                      |
| -------------- | ------------------- | --------------------------- |
| 24.x           | 141.0.0             | ✅ Works                    |
| 24.x           | 135.0.0             | ✅ Works                    |
| 24.x           | 131.0.2             | ✅ Works                    |
| 24.x           | 115.0.0             | ❌ Fails (libnss3.so error) |
| 23.x           | 126.0.0             | ✅ Works                    |
| 22.x           | 123.0.0             | ✅ Works                    |

> **Rule of thumb**: Use the latest stable version of `@sparticuz/chromium` that matches or is close to your `puppeteer-core` major version.

## 🧪 Testing

### Build Test

```bash
pnpm build
```

Expected output:

```
✓ Compiled successfully
✓ Build completed
```

### Deploy Test

```bash
vercel --prod
```

Then test the screenshot endpoint on production.

## 🎯 Why This Happens

1. **Serverless Environment**: Vercel uses AWS Lambda-like environment with specific Linux runtime
2. **Missing System Libraries**: Old Chromium versions don't include all necessary shared libraries
3. **Binary Compatibility**: Newer versions of `@sparticuz/chromium` are compiled with all dependencies bundled

## 📝 Files Changed

-   ✅ `package.json` - Updated `@sparticuz/chromium` version

## ⚠️ Important Notes

1. **Always use latest stable version** of `@sparticuz/chromium`
2. **Check compatibility** with your `puppeteer-core` version
3. **Don't use versions older than 6 months** - they may lack Vercel runtime support
4. **Monitor package updates** - Chromium releases frequently

## 🔗 References

-   [@sparticuz/chromium npm page](https://www.npmjs.com/package/@sparticuz/chromium)
-   [Chromium release notes](https://github.com/Sparticuz/chromium/releases)
-   [Puppeteer troubleshooting](https://pptr.dev/troubleshooting)

---

**Status**: ✅ Fixed with @sparticuz/chromium@141.0.0  
**Date**: October 25, 2025  
**Issue**: libnss3.so missing shared library error  
**Solution**: Update to latest compatible chromium version
