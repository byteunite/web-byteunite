"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

export default function AccountPage() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push("/auth");
    };

    if (!user) {
        return <div>Loading user profile...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Account</h1>
            <Card className="retro-card max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 retro-border">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">
                                {user.name}
                            </CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full retro-button"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
