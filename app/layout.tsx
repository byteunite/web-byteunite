import type React from "react";
import type { Metadata } from "next";
import {
    Archivo_Black,
    Space_Grotesk,
    DM_Serif_Display,
} from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const archivoBlack = Archivo_Black({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-archivo-black",
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-space-grotesk",
    display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-dm-serif-display",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Byte Unite - Where Programmers Connect",
    description:
        "A vibrant community hub for programmers to showcase portfolios, connect with peers, and discover events.",
    generator: "Crafted by Byte Unite",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <script src="https://js.puter.com/v2/" />
            </head>
            <body
                className={`font-sans ${archivoBlack.variable} ${spaceGrotesk.variable} ${dmSerifDisplay.variable} ${GeistMono.variable} antialiased`}
            >
                <Suspense fallback={null}>{children}</Suspense>
                <Toaster />
                <Analytics />
            </body>
        </html>
    );
}
