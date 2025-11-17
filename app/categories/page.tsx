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
import Link from "next/link";
import {
    Code,
    Database,
    Smartphone,
    Globe,
    Cloud,
    Brain,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

// Icon mapping
const iconMap: { [key: string]: any } = {
    Globe,
    Database,
    Smartphone,
    Code,
    Cloud,
    Brain,
};

interface Category {
    _id: string;
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    programmersCount: number;
    projectsCount: number;
    eventsCount: number;
    technologies: string[];
    image: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoading(true);
                const response = await fetch("/api/categories");
                const result = await response.json();

                if (result.success) {
                    setCategories(result.data);
                } else {
                    setError("Failed to load categories");
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories");
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            {/* Header */}
            <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Programming Categories
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore different areas of programming and connect with
                        developers who share your interests and expertise.
                    </p>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => {
                            const IconComponent =
                                iconMap[category.icon] || Code;
                            return (
                                <Card
                                    key={category.id}
                                    className="pt-0 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={
                                                category.image ||
                                                `/placeholder.svg?height=200&width=400&query=${category.title} banner`
                                            }
                                            alt={category.title}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                        <div
                                            className={`absolute top-4 left-4 w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}
                                        >
                                            <IconComponent className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl">
                                            {category.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {category.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {category.programmersCount}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Programmers
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {category.projectsCount}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Projects
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {category.eventsCount}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Events
                                                </div>
                                            </div>
                                        </div>

                                        {/* Technologies */}
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">
                                                Popular Technologies
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {category.technologies
                                                    .slice(0, 4)
                                                    .map((tech) => (
                                                        <Badge
                                                            key={tech}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                {category.technologies.length >
                                                    4 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {category.technologies
                                                            .length - 4}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Button className="w-full" asChild>
                                            <Link
                                                href={`/categories/${category.id}`}
                                            >
                                                Explore {category.title}
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Can't Find Your Specialty?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join our community and help us expand into new
                        programming areas and technologies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/register">Join Community</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/contact">Suggest Category</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
