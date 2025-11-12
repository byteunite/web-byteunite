"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home,
    LayoutTemplate,
    Image as ImageIcon,
    User,
    LogOut,
    Menu,
    X,
    Puzzle,
    Globe,
    BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { Toaster } from "@/components/ui/sonner";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/templates", label: "Templates", icon: LayoutTemplate },
    { href: "/designs", label: "Designs", icon: ImageIcon },
    { href: "/riddles", label: "Riddles", icon: Puzzle },
    { href: "/sites", label: "Sites", icon: Globe },
    { href: "/topics", label: "Topics", icon: BookOpen },
    { href: "/account", label: "Account", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !user && pathname !== "/auth" && pathname !== "/") {
            router.push("/auth");
        }
    }, [isMounted, user, pathname, router]);

    if (!isMounted || (!user && pathname !== "/auth" && pathname !== "/")) {
        return (
            <div className="flex h-screen w-full items-center justify-center retro-noise-bg">
                <p>Loading...</p>
            </div>
        );
    }

    if (pathname === "/auth" || pathname === "/") {
        return <>{children}</>;
    }

    const handleLogout = () => {
        logout();
        router.push("/auth");
    };

    const SidebarContent = () => (
        <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-primary/80 hover:text-primary-foreground ${
                        pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : ""
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );

    return (
        <div className="min-h-screen w-full bg-background">
            <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex h-full w-[220px] lg:w-[280px] flex-col border-r bg-card">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold text-xl"
                        >
                            <span>Byte Unite</span>
                        </Link>
                    </div>
                    <SidebarContent />
                </div>
            </div>
            <div className="flex flex-col md:ml-[220px] lg:ml-[280px] min-h-screen">
                <header className="flex h-16 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 md:top-0 md:z-20">
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden retro-shadow"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    <div className="w-full flex-1">
                        {/* Can add breadcrumbs or search here */}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full retro-shadow"
                            >
                                <Avatar>
                                    <AvatarImage
                                        src={user?.avatarUrl}
                                        alt={user?.name}
                                    />
                                    <AvatarFallback>
                                        {user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="sr-only">
                                    Toggle user menu
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="retro-card">
                            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => router.push("/account")}
                            >
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 retro-noise-bg">
                    {children}
                </main>
            </div>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div
                        className="fixed inset-y-0 left-0 z-50 flex w-3/4 max-w-sm flex-col border-r bg-card retro-border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6 retro-border">
                            <Link
                                href="/"
                                className="flex items-center gap-2 font-semibold text-xl"
                            >
                                <span>Byte Unite</span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            )}
            <Toaster />
        </div>
    );
}
