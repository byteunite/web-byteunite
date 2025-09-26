import type React from "react";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense fallback={null}>
            <AppShell>{children}</AppShell>
        </Suspense>
    );
}
