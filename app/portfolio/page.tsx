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
import { Search, ExternalLink, Github, Eye, Heart } from "lucide-react";

// Mock data for portfolio projects
const portfolioData = [
    {
        id: 1,
        title: "E-commerce Dashboard",
        description:
            "Modern admin dashboard for online retailers with real-time analytics and inventory management.",
        author: "Sarah Chen",
        authorId: 1,
        category: "frontend",
        stack: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center",
        liveUrl: "https://ecommerce-dashboard-demo.vercel.app",
        githubUrl: "https://github.com/sarahchen/ecommerce-dashboard",
        likes: 124,
        views: 2340,
        featured: true,
        createdAt: "2024-11-15",
    },
    {
        id: 2,
        title: "Task Management API",
        description:
            "RESTful API for task management with authentication, real-time updates, and team collaboration.",
        author: "Marcus Rodriguez",
        authorId: 2,
        category: "backend",
        stack: ["Node.js", "Express", "PostgreSQL", "Socket.io"],
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop&crop=center",
        liveUrl: "https://task-api-docs.herokuapp.com",
        githubUrl: "https://github.com/marcusdev/task-api",
        likes: 89,
        views: 1560,
        featured: false,
        createdAt: "2024-11-10",
    },
    {
        id: 3,
        title: "Fitness Tracker App",
        description:
            "Cross-platform mobile app for tracking workouts, nutrition, and health metrics.",
        author: "Aisha Patel",
        authorId: 3,
        category: "mobile",
        stack: ["React Native", "Firebase", "Redux", "Expo"],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&crop=center",
        liveUrl: "https://fitness-tracker-demo.netlify.app",
        githubUrl: "https://github.com/aishapatel/fitness-tracker",
        likes: 156,
        views: 2890,
        featured: true,
        createdAt: "2024-11-08",
    },
    {
        id: 4,
        title: "Microservices Architecture",
        description:
            "Scalable microservices setup with Docker, Kubernetes, and service mesh for high-traffic applications.",
        author: "David Kim",
        authorId: 4,
        category: "backend",
        stack: ["Go", "Docker", "Kubernetes", "gRPC", "Istio"],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&crop=center",
        liveUrl: "https://microservices-demo.davidkim.dev",
        githubUrl: "https://github.com/davidkim/microservices-demo",
        likes: 203,
        views: 3450,
        featured: true,
        createdAt: "2024-11-05",
    },
    {
        id: 5,
        title: "Component Library",
        description:
            "Reusable UI component library with Storybook documentation and automated testing.",
        author: "James Wilson",
        authorId: 6,
        category: "frontend",
        stack: ["Vue.js", "Storybook", "Jest", "Rollup"],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&crop=center",
        liveUrl: "https://ui-components.jameswilson.tech",
        githubUrl: "https://github.com/jameswilson/vue-components",
        likes: 178,
        views: 2670,
        featured: false,
        createdAt: "2024-11-01",
    },
    {
        id: 6,
        title: "DevOps Pipeline",
        description:
            "Complete CI/CD pipeline with automated testing, deployment, and monitoring for web applications.",
        author: "Elena Volkov",
        authorId: 5,
        category: "backend",
        stack: ["Jenkins", "Docker", "Terraform", "AWS", "Prometheus"],
        image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=200&fit=crop&crop=center",
        liveUrl: "https://pipeline-demo.elena.cloud",
        githubUrl: "https://github.com/elenavolkov/devops-pipeline",
        likes: 145,
        views: 2100,
        featured: false,
        createdAt: "2024-10-28",
    },
];

export default function PortfolioPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedTech, setSelectedTech] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Get unique technologies
    const allTechnologies = Array.from(
        new Set(portfolioData.flatMap((project) => project.stack))
    ).sort();

    // Filter and sort projects
    const filteredProjects = portfolioData
        .filter((project) => {
            const matchesSearch =
                project.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                project.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                project.author
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                project.stack.some((tech) =>
                    tech.toLowerCase().includes(searchTerm.toLowerCase())
                );

            const matchesCategory =
                selectedCategory === "all" ||
                project.category === selectedCategory;
            const matchesTech =
                selectedTech === "all" || project.stack.includes(selectedTech);

            return matchesSearch && matchesCategory && matchesTech;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                case "oldest":
                    return (
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    );
                case "popular":
                    return b.likes - a.likes;
                case "views":
                    return b.views - a.views;
                default:
                    return 0;
            }
        });

    const featuredProjects = portfolioData.filter(
        (project) => project.featured
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            {/* Header */}
            <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold mb-4">
                            Portfolio Showcase
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Discover amazing projects built by our community
                            members. Get inspired and showcase your own work.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search projects, authors, or technologies..."
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
                                <SelectTrigger className="w-full lg:w-48">
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
                                    <SelectItem value="mobile">
                                        Mobile
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={selectedTech}
                                onValueChange={setSelectedTech}
                            >
                                <SelectTrigger className="w-full lg:w-48">
                                    <SelectValue placeholder="Technology" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Technologies
                                    </SelectItem>
                                    {allTechnologies.map((tech) => (
                                        <SelectItem key={tech} value={tech}>
                                            {tech}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full lg:w-48">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">
                                        Newest
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        Oldest
                                    </SelectItem>
                                    <SelectItem value="popular">
                                        Most Liked
                                    </SelectItem>
                                    <SelectItem value="views">
                                        Most Viewed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results count */}
                        <div className="text-center text-muted-foreground mb-8">
                            Showing {filteredProjects.length} project
                            {filteredProjects.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            {searchTerm === "" &&
                selectedCategory === "all" &&
                selectedTech === "all" && (
                    <section className="py-16 px-4 bg-muted/30">
                        <div className="container mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-12">
                                Featured Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredProjects.map((project) => (
                                    <Card
                                        key={project.id}
                                        className="pt-0 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    >
                                        <div className="relative">
                                            <img
                                                src={
                                                    project.image ||
                                                    "/placeholder.svg?height=200&width=400"
                                                }
                                                alt={project.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                                Featured
                                            </Badge>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-xl">
                                                {project.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                by{" "}
                                                <Link
                                                    href={`/programmers/${project.authorId}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {project.author}
                                                </Link>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {project.description}
                                            </p>

                                            {/* Tech Stack */}
                                            <div className="flex flex-wrap gap-2">
                                                {project.stack
                                                    .slice(0, 3)
                                                    .map((tech) => (
                                                        <Badge
                                                            key={tech}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                {project.stack.length > 3 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {project.stack.length -
                                                            3}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <Heart className="h-4 w-4 mr-1" />
                                                        {project.likes}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        {project.views}
                                                    </div>
                                                </div>
                                                <div>
                                                    {new Date(
                                                        project.createdAt
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 bg-transparent"
                                                    asChild
                                                >
                                                    <Link
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        Live Demo
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 bg-transparent"
                                                    asChild
                                                >
                                                    <Link
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                    >
                                                        <Github className="h-4 w-4 mr-2" />
                                                        Code
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

            {/* All Projects */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {searchTerm ||
                        selectedCategory !== "all" ||
                        selectedTech !== "all"
                            ? "Search Results"
                            : "All Projects"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <Card
                                key={project.id}
                                className="pt-0 pthover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            project.image ||
                                            "/placeholder.svg?height=200&width=400"
                                        }
                                        alt={project.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    {project.featured && (
                                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        by{" "}
                                        <Link
                                            href={`/programmers/${project.authorId}`}
                                            className="text-primary hover:underline"
                                        >
                                            {project.author}
                                        </Link>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.stack
                                            .slice(0, 3)
                                            .map((tech) => (
                                                <Badge
                                                    key={tech}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {tech}
                                                </Badge>
                                            ))}
                                        {project.stack.length > 3 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                +{project.stack.length - 3}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <Heart className="h-4 w-4 mr-1" />
                                                {project.likes}
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="h-4 w-4 mr-1" />
                                                {project.views}
                                            </div>
                                        </div>
                                        <div>
                                            {new Date(
                                                project.createdAt
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-transparent"
                                            asChild
                                        >
                                            <Link
                                                href={project.liveUrl}
                                                target="_blank"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Live Demo
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 bg-transparent"
                                            asChild
                                        >
                                            <Link
                                                href={project.githubUrl}
                                                target="_blank"
                                            >
                                                <Github className="h-4 w-4 mr-2" />
                                                Code
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* No results */}
                    {filteredProjects.length === 0 && (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-semibold mb-4">
                                No projects found
                            </h3>
                            <p className="text-muted-foreground mb-8">
                                Try adjusting your search criteria or filters.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("all");
                                    setSelectedTech("all");
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
                    <h2 className="text-3xl font-bold mb-4">Share Your Work</h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join our community and showcase your projects to
                        thousands of developers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/register">Join Community</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/login">Submit Project</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
