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
import { useState } from "react";
import { Search, Github, ExternalLink, MapPin, Star } from "lucide-react";

// Mock data for programmers
const programmersData = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Frontend Developer",
        location: "San Francisco, CA",
        bio: "Passionate about creating beautiful, accessible user interfaces with React and modern CSS.",
        stack: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        category: "frontend",
        avatar: "/professional-woman-developer.png",
        github: "sarahchen",
        portfolio: "sarahchen.dev",
        rating: 4.9,
        projects: 12,
    },
    {
        id: 2,
        name: "Marcus Rodriguez",
        role: "Full Stack Engineer",
        location: "Austin, TX",
        bio: "Building scalable web applications with modern technologies and best practices.",
        stack: ["Node.js", "Python", "PostgreSQL", "Docker", "AWS"],
        category: "fullstack",
        avatar: "/professional-man-developer.png",
        github: "marcusdev",
        portfolio: "marcus.codes",
        rating: 4.8,
        projects: 18,
    },
    {
        id: 3,
        name: "Aisha Patel",
        role: "Mobile Developer",
        location: "Toronto, ON",
        bio: "Creating native and cross-platform mobile experiences that users love.",
        stack: ["React Native", "Swift", "Kotlin", "Flutter"],
        category: "mobile",
        avatar: "/professional-woman-mobile-developer.jpg",
        github: "aishapatel",
        portfolio: "aisha.app",
        rating: 4.9,
        projects: 15,
    },
    {
        id: 4,
        name: "David Kim",
        role: "Backend Developer",
        location: "Seattle, WA",
        bio: "Designing robust APIs and distributed systems for high-scale applications.",
        stack: ["Go", "Kubernetes", "Redis", "MongoDB", "gRPC"],
        category: "backend",
        avatar: "/professional-asian-man-developer.jpg",
        github: "davidkim",
        portfolio: "davidkim.dev",
        rating: 4.7,
        projects: 22,
    },
    {
        id: 5,
        name: "Elena Volkov",
        role: "DevOps Engineer",
        location: "Berlin, Germany",
        bio: "Automating infrastructure and improving developer experience through CI/CD.",
        stack: ["Terraform", "Jenkins", "Docker", "AWS", "Ansible"],
        category: "backend",
        avatar: "/professional-woman-devops-engineer.jpg",
        github: "elenavolkov",
        portfolio: "elena.cloud",
        rating: 4.8,
        projects: 9,
    },
    {
        id: 6,
        name: "James Wilson",
        role: "Frontend Architect",
        location: "London, UK",
        bio: "Leading frontend teams and establishing scalable architecture patterns.",
        stack: ["Vue.js", "Nuxt.js", "GraphQL", "Storybook", "Webpack"],
        category: "frontend",
        avatar: "/professional-british-man-developer.jpg",
        github: "jameswilson",
        portfolio: "jameswilson.tech",
        rating: 4.9,
        projects: 25,
    },
];

export default function ProgrammersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    // Filter and sort programmers
    const filteredProgrammers = programmersData
        .filter((programmer) => {
            const matchesSearch =
                programmer.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                programmer.role
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                programmer.stack.some((tech) =>
                    tech.toLowerCase().includes(searchTerm.toLowerCase())
                );

            const matchesCategory =
                selectedCategory === "all" ||
                programmer.category === selectedCategory;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "rating":
                    return b.rating - a.rating;
                case "projects":
                    return b.projects - a.projects;
                default:
                    return 0;
            }
        });

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
                                key={programmer.id}
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
                                            href={`/programmers/${programmer.id}`}
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
                        <Link href="/register">Join Byte Unite</Link>
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
