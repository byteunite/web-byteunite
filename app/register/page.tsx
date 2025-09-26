"use client";

import type React from "react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Github, Mail } from "lucide-react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        category: "",
        bio: "",
        agreeToTerms: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Registration attempt:", formData);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
                <div className="w-full max-w-2xl">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold">
                                Join Byte Unite
                            </CardTitle>
                            <CardDescription>
                                Create your account and become part of our
                                developer community
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            placeholder="Enter your first name"
                                            value={formData.firstName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "firstName",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Enter your last name"
                                            value={formData.lastName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "lastName",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Programming Category
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) =>
                                            handleInputChange("category", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your primary focus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="frontend">
                                                Frontend Developer
                                            </SelectItem>
                                            <SelectItem value="backend">
                                                Backend Developer
                                            </SelectItem>
                                            <SelectItem value="fullstack">
                                                Full Stack Developer
                                            </SelectItem>
                                            <SelectItem value="mobile">
                                                Mobile Developer
                                            </SelectItem>
                                            <SelectItem value="devops">
                                                DevOps Engineer
                                            </SelectItem>
                                            <SelectItem value="data">
                                                Data Scientist
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio (Optional)</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself and your programming journey..."
                                        value={formData.bio}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "bio",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "confirmPassword",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={formData.agreeToTerms}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "agreeToTerms",
                                                e.target.checked
                                            )
                                        }
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        required
                                    />
                                    <Label htmlFor="terms" className="text-sm">
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="text-primary hover:underline"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="text-primary hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="bg-transparent"
                                >
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                                <Button
                                    variant="outline"
                                    className="bg-transparent"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Google
                                </Button>
                            </div>

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    );
}
