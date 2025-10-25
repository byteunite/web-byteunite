/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
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
