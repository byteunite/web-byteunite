# Blog Implementation Summary

## Implementasi Blog yang Mengambil Konten dari Template-Post

### File yang Sudah Dibuat:

1. **`/lib/blog-utils.ts`** ✅

    - Utility functions untuk mengkonversi slides menjadi blog articles
    - Functions: `convertSlidesToArticle()`, `convertToBlogArticle()`, `fetchAllBlogArticles()`, `fetchBlogArticle()`
    - Interface `BlogArticle` untuk struktur data blog

2. **`/app/api/blog/route.ts`** ✅

    - API endpoint untuk list semua blog articles
    - GET `/api/blog?page=1&limit=10&category=riddles`
    - Mengambil data dari riddles, sites, topics, tutorials

3. **`/app/api/blog/[id]/route.ts`** ✅

    - API endpoint untuk single blog article by ID
    - GET `/api/blog/[id]?category=riddles`
    - Return single blog article dengan content yang sudah dikonversi

4. **`/components/MarkdownRenderer.tsx`** ✅
    - Component untuk merender markdown content dengan baik
    - Support: headings, bold, italic, lists, code blocks, links, horizontal rules
    - Styling yang rapih dengan Tailwind CSS

### File yang Perlu Dibuat Ulang:

5. **`/app/blog/page.tsx`** - Blog Listing Page
6. **`/app/blog/[id]/page.tsx`** - Blog Detail Page

## Cara Manual untuk Membuat File yang Tersisa:

### 1. Buat `/app/blog/page.tsx`:

```tsx
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Search, Calendar, Clock, Eye, Heart, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { BlogArticle } from "@/lib/blog-utils";

const categories = [
    "All",
    "Programming Riddles",
    "Web Development",
    "Tech Topics",
    "Tutorials",
];

export default function BlogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [blogPosts, setBlogPosts] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/blog?limit=100");
            const result = await response.json();
            if (result.success) {
                setBlogPosts(result.data);
                setTotalPosts(result.pagination.total);
            }
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = blogPosts
        .filter(
            (post) =>
                (selectedCategory === "All" ||
                    post.category === selectedCategory) &&
                (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.excerpt
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    post.tags.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                    ))
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return (
                        new Date(b.publishedAt).getTime() -
                        new Date(a.publishedAt).getTime()
                    );
                case "oldest":
                    return (
                        new Date(a.publishedAt).getTime() -
                        new Date(b.publishedAt).getTime()
                    );
                case "popular":
                    return b.views - a.views;
                case "liked":
                    return b.likes - a.likes;
                default:
                    return 0;
            }
        });

    const featuredPosts = filteredPosts.filter((post) => post.featured);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">
                            Loading articles...
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
                <div className="container mx-auto text-center">
                    <h1 className="font-heading text-6xl md:text-8xl mb-6 text-balance">
                        Developer <span className="text-primary">Blog</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
                        Insights, tutorials, and stories from the world of
                        software development.
                    </p>
                    <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                                {totalPosts}+
                            </div>
                            <div>Articles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                                {categories.length - 1}
                            </div>
                            <div>Categories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                                50K+
                            </div>
                            <div>Readers</div>
                        </div>
                    </div>
                </div>
            </section>
            {featuredPosts.length > 0 && (
                <section className="py-16 px-4">
                    <div className="container mx-auto">
                        <h2 className="font-heading text-4xl mb-8">
                            Featured Articles
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {featuredPosts.slice(0, 2).map((post) => (
                                <Card
                                    key={post.id}
                                    className="pt-0 retro-card hover:shadow-lg transition-all duration-300 overflow-hidden"
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                post.coverImage ||
                                                post.images[0] ||
                                                "/placeholder.svg"
                                            }
                                            alt={post.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                                            Featured
                                        </Badge>
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                                            <Badge variant="outline">
                                                {post.category}
                                            </Badge>
                                            <span>•</span>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {new Date(
                                                    post.publishedAt
                                                ).toLocaleDateString()}
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {post.readTime}
                                            </div>
                                        </div>
                                        <CardTitle className="font-heading text-2xl mb-2">
                                            <Link
                                                href={`/blog/${post.id}?category=${post.sourceCategory}`}
                                                className="hover:text-primary transition-colors"
                                            >
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="text-base leading-relaxed">
                                            {post.excerpt}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={
                                                        post.author.avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={post.author.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {post.author.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <Heart className="h-4 w-4 mr-1" />
                                                    {post.likes}
                                                </div>
                                                <div className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    {post.views}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <section className="py-8 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 retro-input"
                            />
                        </div>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-full lg:w-48 retro-input">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full lg:w-48 retro-input">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="popular">
                                    Most Popular
                                </SelectItem>
                                <SelectItem value="liked">
                                    Most Liked
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-heading text-4xl">
                            {selectedCategory === "All"
                                ? "All Articles"
                                : selectedCategory}
                        </h2>
                        <div className="text-sm text-muted-foreground">
                            {filteredPosts.length} article
                            {filteredPosts.length !== 1 ? "s" : ""} found
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Card
                                key={post.id}
                                className="pt-0 retro-card hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            post.coverImage ||
                                            post.images[0] ||
                                            "/placeholder.svg"
                                        }
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <Badge className="absolute top-3 left-3 bg-card text-card-foreground border border-border">
                                        {post.category}
                                    </Badge>
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
                                    <CardTitle className="font-heading text-xl leading-tight">
                                        <Link
                                            href={`/blog/${post.id}?category=${post.sourceCategory}`}
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
                                                variant="secondary"
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
                                            <div className="text-xs text-muted-foreground">
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
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-16">
                            <h3 className="font-heading text-2xl mb-4">
                                No articles found
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Try adjusting your search terms or category
                                filter.
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("All");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
            <section className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto text-center">
                    <Card className="retro-card max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle className="font-heading text-3xl">
                                Stay Updated
                            </CardTitle>
                            <CardDescription className="text-base">
                                Get the latest articles and insights delivered
                                to your inbox weekly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    className="retro-input flex-1"
                                />
                                <Button className="retro-button bg-primary text-primary-foreground hover:bg-primary/90">
                                    Subscribe{" "}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                No spam, unsubscribe at any time.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
            <Footer />
        </div>
    );
}
```

### 2. Buat `/app/blog/[id]/page.tsx`:

```tsx
"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import {
    Calendar,
    Clock,
    Eye,
    Heart,
    Share2,
    ArrowLeft,
    User,
    MessageCircle,
    Bookmark,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BlogArticle } from "@/lib/blog-utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface BlogPostPageProps {
    params: {
        id: string;
    };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "riddles";
    const [post, setPost] = useState<BlogArticle | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogPost();
        fetchRelatedArticles();
    }, [params.id, category]);

    const fetchBlogPost = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/blog/${params.id}?category=${category}`
            );
            const result = await response.json();
            if (result.success) {
                setPost(result.data);
            } else {
                setPost(null);
            }
        } catch (error) {
            console.error("Error fetching blog post:", error);
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedArticles = async () => {
        try {
            const response = await fetch(`/api/blog?limit=3`);
            const result = await response.json();
            if (result.success) {
                const related = result.data
                    .filter((article: BlogArticle) => article.id !== params.id)
                    .slice(0, 2);
                setRelatedArticles(related);
            }
        } catch (error) {
            console.error("Error fetching related articles:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">
                            Loading article...
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <div className="container mx-auto px-4 py-4">
                <Button variant="ghost" asChild>
                    <Link href="/blog">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Blog
                    </Link>
                </Button>
            </div>
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-6">
                        <Badge className="mb-4">{post.category}</Badge>
                        <h1 className="font-heading text-4xl md:text-6xl mb-6 text-balance">
                            {post.title}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                            {post.excerpt}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div className="flex items-center space-x-4">
                            <img
                                src={post.author.avatar || "/placeholder.svg"}
                                alt={post.author.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <div className="font-medium">
                                    {post.author.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {post.author.bio}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(
                                    post.publishedAt
                                ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {post.readTime}
                            </div>
                            <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {post.views}
                            </div>
                        </div>
                    </div>
                    {(post.coverImage || post.images[0]) && (
                        <div className="mb-8">
                            <img
                                src={
                                    post.coverImage ||
                                    post.images[0] ||
                                    "/placeholder.svg"
                                }
                                alt={post.title}
                                className="w-full h-64 md:h-96 object-cover rounded-lg border-4 border-border"
                            />
                        </div>
                    )}
                </div>
            </section>
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <Card className="retro-card">
                                <CardContent className="p-8">
                                    <MarkdownRenderer content={post.content} />
                                </CardContent>
                            </Card>
                            {post.images.length > 1 && (
                                <div className="mt-8">
                                    <h3 className="font-heading text-2xl mb-4">
                                        Visual Gallery
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {post.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Slide ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="mt-8">
                                <h3 className="font-heading text-xl mb-4">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="outline"
                                        className="retro-button bg-transparent"
                                    >
                                        <Heart className="h-4 w-4 mr-2" />
                                        {post.likes} Likes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="retro-button bg-transparent"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Comment
                                    </Button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="retro-button bg-transparent"
                                    >
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="retro-button bg-transparent"
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Card className="retro-card bg-muted/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-heading text-lg mb-2">
                                                    View Original Template
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    See this content as
                                                    interactive slides
                                                </p>
                                            </div>
                                            <Button asChild>
                                                <Link
                                                    href={`/template/${post.sourceId}?data=${post.sourceCategory}`}
                                                >
                                                    View Slides
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                <Card className="retro-card">
                                    <CardHeader>
                                        <CardTitle className="font-heading text-lg">
                                            About the Author
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-3 mb-3">
                                            <img
                                                src={
                                                    post.author.avatar ||
                                                    "/placeholder.svg"
                                                }
                                                alt={post.author.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-medium">
                                                    {post.author.name}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {post.author.bio}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full retro-button bg-transparent"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            View Profile
                                        </Button>
                                    </CardContent>
                                </Card>
                                <Card className="retro-card">
                                    <CardHeader>
                                        <CardTitle className="font-heading text-lg">
                                            Article Stats
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Views
                                            </span>
                                            <span className="font-semibold">
                                                {post.views}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Likes
                                            </span>
                                            <span className="font-semibold">
                                                {post.likes}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Read Time
                                            </span>
                                            <span className="font-semibold">
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {relatedArticles.length > 0 && (
                <section className="py-16 px-4 bg-muted/30">
                    <div className="container mx-auto max-w-4xl">
                        <h2 className="font-heading text-3xl mb-8">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedArticles.map((article) => (
                                <Card
                                    key={article.id}
                                    className="retro-card hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                article.coverImage ||
                                                article.images[0] ||
                                                "/placeholder.svg"
                                            }
                                            alt={article.title}
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="font-heading text-lg leading-tight">
                                            <Link
                                                href={`/blog/${article.id}?category=${article.sourceCategory}`}
                                                className="hover:text-primary transition-colors"
                                            >
                                                {article.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div>by {article.author.name}</div>
                                            <div>{article.readTime}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <Footer />
        </div>
    );
}
```

## Fitur yang Sudah Diimplementasikan:

1. ✅ **Konversi Slides ke Blog Article**

    - Slides dari riddles, sites, topics, tutorials dikonversi menjadi markdown article
    - Image URLs dari slides ditampilkan sebagai cover image dan gallery
    - Metadata (author, date, readTime, tags) digenerate otomatis

2. ✅ **Markdown Renderer**

    - Support semua format markdown standard
    - Styling yang rapih dan responsive

3. ✅ **Blog List Page**

    - Menampilkan semua blog dari berbagai kategori
    - Search dan filter functionality
    - Featured articles section
    - Sort by date, views, likes

4. ✅ **Blog Detail Page**
    - Menampilkan full article dengan markdown rendering
    - Image gallery dari slides
    - Author info dan stats
    - Link ke original template slides
    - Related articles

## Cara Menggunakan:

1. User bisa mengakses `/blog` untuk melihat list semua blog articles
2. Blog articles diambil dari data riddles, sites, topics, tutorials
3. Klik article untuk melihat detail di `/blog/[id]?category=riddles`
4. Ada link "View Original Template" untuk kembali ke slides format
5. Content ditampilkan dalam format article yang nyaman dibaca dengan markdown formatting

## Testing:

```bash
# Test API endpoints
curl http://localhost:3000/api/blog
curl http://localhost:3000/api/blog/[RIDDLE_ID]?category=riddles

# Navigate to pages
http://localhost:3000/blog
http://localhost:3000/blog/[ID]?category=riddles
```
