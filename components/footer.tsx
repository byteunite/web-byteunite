import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-muted border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-xl text-primary">
                            Byte Unite
                        </h3>
                        <p className="text-muted-foreground">
                            Where programmers connect, showcase their work, and
                            grow together.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="https://github.com/byteunite"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                target="_"
                            >
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://www.threads.com/@byteunite.dev"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                target="_"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://www.linkedin.com/company/byte-unite"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                target="_blank"
                            >
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Community</h4>
                        <div className="space-y-2">
                            <Link
                                href="/programmers"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Browse Programmers
                            </Link>
                            <Link
                                href="/portfolio"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Portfolio Showcase
                            </Link>
                            <Link
                                href="/events"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Events
                            </Link>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Categories</h4>
                        <div className="space-y-2">
                            <Link
                                href="/categories/frontend"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Frontend
                            </Link>
                            <Link
                                href="/categories/backend"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Backend
                            </Link>
                            <Link
                                href="/categories/fullstack"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Full Stack
                            </Link>
                            <Link
                                href="/categories/mobile"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Mobile
                            </Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Support</h4>
                        <div className="space-y-2">
                            <Link
                                href="/about"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Contact
                            </Link>
                            <Link
                                href="/privacy"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="block text-muted-foreground hover:text-primary transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
                    <p>&copy; 2025 Byte Unite. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
