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
import { useState, useEffect } from "react";
import {
    Search,
    Github,
    ExternalLink,
    MapPin,
    Star,
    Loader2,
} from "lucide-react";

interface Programmer {
    _id: string;
    name: string;
    role: string;
    location: string;
    bio: string;
    stack: string[];
    category: string;
    avatar: string;
    github: string;
    portfolio: string;
    slug: string;
    rating: number;
    projects: number;
}

export default function ProgrammersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [programmers, setProgrammers] = useState<Programmer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProgrammers() {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    category: selectedCategory,
                    search: searchTerm,
                    sortBy,
                    publicOnly: "true", // Only fetch published programmers
                });
                const response = await fetch(`/api/programmers?${params}`);
                const result = await response.json();

                if (result.success) {
                    setProgrammers(result.data);
                } else {
                    setError("Failed to load programmers");
                }
            } catch (err) {
                console.error("Error fetching programmers:", err);
                setError("Failed to load programmers");
            } finally {
                setLoading(false);
            }
        }

        fetchProgrammers();
    }, [selectedCategory, searchTerm, sortBy]);

    // Filter and sort programmers (now done on client for immediate feedback)
    const filteredProgrammers = programmers;

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
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold mb-4">
                            Programmers Directory
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Discover talented developers from around the world.
                            Connect, collaborate, and learn from each other.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search by name, role, or technology..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    <SelectItem value="frontend">
                                        Frontend
                                    </SelectItem>
                                    <SelectItem value="backend">
                                        Backend
                                    </SelectItem>
                                    <SelectItem value="fullstack">
                                        Full Stack
                                    </SelectItem>
                                    <SelectItem value="mobile">
                                        Mobile
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="rating">
                                        Rating
                                    </SelectItem>
                                    <SelectItem value="projects">
                                        Projects
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results count */}
                        <div className="text-center text-muted-foreground mb-8">
                            Showing {filteredProgrammers.length} programmer
                            {filteredProgrammers.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>
            </section>

            {/* Programmers Grid */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProgrammers.map((programmer) => (
                            <Card
                                key={programmer._id}
                                className="hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <CardHeader className="text-center">
                                    <img
                                        src={
                                            programmer.avatar ||
                                            "/placeholder.svg"
                                        }
                                        alt={programmer.name}
                                        className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20"
                                    />
                                    <CardTitle className="text-xl">
                                        {programmer.name}
                                    </CardTitle>
                                    <CardDescription className="text-lg font-medium text-secondary">
                                        {programmer.role}
                                    </CardDescription>
                                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {programmer.location}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground text-center">
                                        {programmer.bio}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex justify-center space-x-6 text-sm">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 mr-1 text-primary" />
                                            {programmer.rating}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {programmer.projects} projects
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {programmer.stack
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
                                        {programmer.stack.length > 4 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                +{programmer.stack.length - 4}{" "}
                                                more
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`https://github.com/${programmer.github}`}
                                                target="_blank"
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
                                                target="_blank"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Portfolio
                                            </Link>
                                        </Button>
                                    </div>

                                    <Button className="w-full" asChild>
                                        <Link
                                            href={`/programmers/${programmer.slug}`}
                                        >
                                            View Profile
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* No results */}
                    {filteredProgrammers.length === 0 && (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-semibold mb-4">
                                No programmers found
                            </h3>
                            <p className="text-muted-foreground mb-8">
                                Try adjusting your search criteria or filters.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("all");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Want to be featured?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join our community and showcase your skills to thousands
                        of developers.
                    </p>
                    <Button size="lg" asChild>
                        <Link
                            href="https://discord.gg/PfqUrQfD"
                            target="_blank"
                        >
                            Join Byte Unite
                        </Link>
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
