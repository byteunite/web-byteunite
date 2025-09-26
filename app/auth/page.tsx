"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export default function AuthPage() {
    const router = useRouter();
    const { login, register } = useAuthStore();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(loginEmail, loginPassword);
        toast.success("Login berhasil! Selamat datang kembali.", {
            style: {
                border: "2px solid black",
                boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
            },
        });
        router.push("/dashboard");
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        register(registerName, registerEmail, registerPassword);
        toast.success("Registrasi berhasil! Selamat datang.", {
            style: {
                border: "2px solid black",
                boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
            },
        });
        router.push("/dashboard");
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 retro-noise-bg">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2 retro-border">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card className="retro-card">
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Masuk ke akun DesignForge Retro Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="email@contoh.com"
                                        required
                                        value={loginEmail}
                                        onChange={(e) =>
                                            setLoginEmail(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">
                                        Password
                                    </Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        required
                                        value={loginPassword}
                                        onChange={(e) =>
                                            setLoginPassword(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full retro-button"
                                >
                                    Login
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card className="retro-card">
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Buat akun baru untuk memulai.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleRegister}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="register-name">Nama</Label>
                                    <Input
                                        id="register-name"
                                        placeholder="Nama Anda"
                                        required
                                        value={registerName}
                                        onChange={(e) =>
                                            setRegisterName(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-email">
                                        Email
                                    </Label>
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="email@contoh.com"
                                        required
                                        value={registerEmail}
                                        onChange={(e) =>
                                            setRegisterEmail(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="register-password">
                                        Password
                                    </Label>
                                    <Input
                                        id="register-password"
                                        type="password"
                                        required
                                        value={registerPassword}
                                        onChange={(e) =>
                                            setRegisterPassword(e.target.value)
                                        }
                                        className="retro-input"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full retro-button"
                                >
                                    Register
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
