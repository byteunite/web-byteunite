"use client";

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
import { Badge } from "@/components/ui/badge";
import { TypingText } from "@/components/typing-text";
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation";
import { PixelGridBackground } from "@/components/pixel-grid-background";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import {
    ArrowRight,
    Users,
    Calendar,
    Star,
    Github,
    ExternalLink,
    Clock,
    Eye,
    Heart,
} from "lucide-react";

const latestBlogPosts = [
    {
        id: 1,
        title: "The Future of Web Development: What's Coming in 2025",
        excerpt:
            "Explore the latest trends and technologies that will shape web development in the coming year, from AI integration to new frameworks.",
        author: {
            name: "Sarah Chen",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-12-10",
        readTime: "8 min read",
        category: "Web Development",
        tags: ["React", "AI", "Future Tech"],
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
        likes: 234,
        views: 3420,
        featured: true,
    },
    {
        id: 4,
        title: "Getting Started with Machine Learning for Web Developers",
        excerpt:
            "Demystify machine learning concepts and learn how to integrate AI features into your web applications using modern tools.",
        author: {
            name: "David Kim",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-12-03",
        readTime: "15 min read",
        category: "AI & Machine Learning",
        tags: ["Machine Learning", "AI", "JavaScript"],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
        likes: 298,
        views: 4120,
        featured: true,
    },
    {
        id: 2,
        title: "Building Scalable APIs with Node.js and TypeScript",
        excerpt:
            "Learn best practices for creating robust, maintainable APIs that can handle enterprise-level traffic and complexity.",
        author: {
            name: "Michael Rodriguez",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-12-08",
        readTime: "12 min read",
        category: "Backend Development",
        tags: ["Node.js", "TypeScript", "API Design"],
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
        likes: 189,
        views: 2890,
        featured: false,
    },
];

export default function HomePage() {
    const [mouseCoords, setMouseCoords] = useState<{
        x: number | null;
        y: number | null;
    }>({ x: null, y: null });

    const handleHeroMouseMove = useCallback((event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMouseCoords({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            {/* Hero Section */}
            <section
                className="relative h-screen overflow-hidden"
                onMouseMove={handleHeroMouseMove}
            >
                <PixelGridBackground
                    mouseX={mouseCoords.x}
                    mouseY={mouseCoords.y}
                    gridSize={40}
                    pixelColor="rgba(255, 214, 0, 0.1)"
                    hoverColor="rgba(255, 214, 0, 0.5)"
                    hoverRadius={100}
                    className="z-10"
                />
                <BackgroundGradientAnimation
                    gradientBackgroundStart="rgb(248, 250, 252)"
                    gradientBackgroundEnd="rgb(241, 245, 249)"
                    firstColor="255, 214, 0"
                    secondColor="255, 235, 59"
                    thirdColor="255, 193, 7"
                    fourthColor="255, 160, 0"
                    fifthColor="255, 111, 97"
                    pointerColor="255, 214, 0"
                    size="80%"
                    blendingValue="hard-light"
                    containerClassName="absolute inset-0"
                    interactive={true}
                >
                    {/* Content */}
                    <div className="relative z-20 flex items-center justify-center h-full px-4">
                        <div className="container mx-auto text-center">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <h1 className="text-6xl md:text-8xl font-bold text-foreground">
                                    <TypingText
                                        text="Byte Unite"
                                        speed={150}
                                        loop={true}
                                        pauseDuration={3000}
                                    />
                                </h1>
                                <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
                                    Where Programmers Connect
                                </p>
                                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                                    Join a vibrant community of developers,
                                    showcase your projects, discover events, and
                                    connect with like-minded programmers from
                                    around the world.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Button
                                        size="lg"
                                        className="text-lg px-8 py-6"
                                        asChild
                                    >
                                        <Link href="/programmers">
                                            Explore Programmers
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="text-lg px-8 py-6"
                                        asChild
                                    >
                                        <Link href="/register">
                                            Join the Community
                                            <Users className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </BackgroundGradientAnimation>
            </section>

            {/* Categories Grid */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">
                            Programming Categories
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Discover developers across different specializations
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Frontend",
                                description:
                                    "React, Vue, Angular, and modern web interfaces",
                                count: "1,234",
                                href: "/categories/frontend",
                                color: "bg-primary/10 border-primary/20 hover:bg-primary/20",
                            },
                            {
                                title: "Backend",
                                description:
                                    "APIs, databases, and server-side development",
                                count: "987",
                                href: "/categories/backend",
                                color: "bg-secondary/10 border-secondary/20 hover:bg-secondary/20",
                            },
                            {
                                title: "Full Stack",
                                description:
                                    "End-to-end application development",
                                count: "756",
                                href: "/categories/fullstack",
                                color: "bg-chart-3/10 border-chart-3/20 hover:bg-chart-3/20",
                            },
                            {
                                title: "Mobile",
                                description:
                                    "iOS, Android, and cross-platform apps",
                                count: "543",
                                href: "/categories/mobile",
                                color: "bg-chart-4/10 border-chart-4/20 hover:bg-chart-4/20",
                            },
                        ].map((category) => (
                            <Link key={category.title} href={category.href}>
                                <Card
                                    className={`${category.color} transition-all duration-300 hover:scale-105 cursor-pointer h-full`}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-xl text-foreground">
                                            {category.title}
                                        </CardTitle>
                                        <Badge
                                            variant="secondary"
                                            className="w-fit"
                                        >
                                            {category.count} developers
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base text-foreground/80">
                                            {category.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Programmers */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">
                            Featured Programmers
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Meet some of our amazing community members
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Frontend Developer",
                                stack: ["React", "TypeScript", "Tailwind"],
                                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                                github: "sarahchen",
                                portfolio: "sarahchen.dev",
                            },
                            {
                                name: "Marcus Rodriguez",
                                role: "Full Stack Engineer",
                                stack: ["Node.js", "Python", "PostgreSQL"],
                                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                                github: "marcusdev",
                                portfolio: "marcus.codes",
                            },
                            {
                                name: "Aisha Patel",
                                role: "Mobile Developer",
                                stack: ["React Native", "Swift", "Kotlin"],
                                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                                github: "aishapatel",
                                portfolio: "aisha.app",
                            },
                        ].map((programmer) => (
                            <Card
                                key={programmer.name}
                                className="hover:shadow-lg transition-shadow duration-300"
                            >
                                <CardHeader className="text-center">
                                    <img
                                        src={
                                            programmer.avatar ||
                                            "/placeholder.svg"
                                        }
                                        alt={programmer.name}
                                        className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20 object-cover"
                                    />
                                    <CardTitle className="text-xl">
                                        {programmer.name}
                                    </CardTitle>
                                    <CardDescription className="text-lg font-medium text-secondary">
                                        {programmer.role}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-foreground/80">
                                        {programmer.stack.join(", ")}
                                    </CardDescription>
                                    <div className="flex justify-center space-x-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`https://github.com/${programmer.github}`}
                                            >
                                                <Github className="h-4 w-4 mr-2" />
                                                GitHub
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`https://${programmer.portfolio}`}
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Portfolio
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/programmers">
                                View All Programmers
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Latest Blog Posts */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">
                            Latest Blog Posts
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Stay updated with the latest insights and tutorials
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {latestBlogPosts.map((post) => (
                            <Card
                                key={post.id}
                                className="hover:shadow-lg transition-all duration-300 overflow-hidden pt-0"
                            >
                                <div className="relative">
                                    <img
                                        src={post.image || "/placeholder.svg"}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <Badge className="absolute top-3 left-3 bg-card text-card-foreground border border-border">
                                        {post.category}
                                    </Badge>
                                    {post.featured && (
                                        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(
                                                post.publishedAt
                                            ).toLocaleDateString()}
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl leading-tight">
                                        <Link
                                            href={`/blog/${post.id}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="text-sm leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={
                                                    post.author.avatar ||
                                                    "/placeholder.svg"
                                                }
                                                alt={post.author.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            <div className="text-xs font-medium">
                                                {post.author.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                            <div className="flex items-center">
                                                <Heart className="h-3 w-3 mr-1" />
                                                {post.likes}
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="h-3 w-3 mr-1" />
                                                {post.views}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/blog">
                                View All Articles
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Preview */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">
                            Upcoming Events
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Join workshops, meetups, and conferences
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "React 19 Workshop",
                                date: "Dec 15, 2024",
                                time: "2:00 PM EST",
                                type: "Workshop",
                                location: "Online",
                                attendees: 45,
                            },
                            {
                                title: "Full Stack Meetup",
                                date: "Dec 20, 2024",
                                time: "6:00 PM PST",
                                type: "Meetup",
                                location: "San Francisco",
                                attendees: 120,
                            },
                            {
                                title: "Mobile Dev Conference",
                                date: "Jan 10, 2025",
                                time: "9:00 AM EST",
                                type: "Conference",
                                location: "New York",
                                attendees: 300,
                            },
                        ].map((event) => (
                            <Card
                                key={event.title}
                                className="hover:shadow-lg transition-shadow duration-300"
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="secondary">
                                            {event.type}
                                        </Badge>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Users className="h-4 w-4 mr-1" />
                                            {event.attendees}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl">
                                        {event.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {event.date} at {event.time}
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Star className="h-4 w-4 mr-2" />
                                        {event.location}
                                    </div>
                                    <Button className="w-full mt-4">
                                        Register Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/events">
                                View All Events
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-4 bg-primary/5">
                <div className="container mx-auto text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Ready to Join Our Community?
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Connect with thousands of developers, showcase your
                            projects, and grow your career.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-6"
                                asChild
                            >
                                <Link href="/register">
                                    Get Started Today
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6 bg-transparent"
                                asChild
                            >
                                <Link href="/about">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
