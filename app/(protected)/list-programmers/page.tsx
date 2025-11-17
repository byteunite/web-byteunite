"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Eye,
    Loader2,
    PlusCircle,
    Trash2,
    Edit,
    Mail,
    Github,
    ExternalLink,
    Star,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IProgrammer {
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
    email: string;
    rating: number;
    projects: number;
    experience: string;
    availability: string;
    hourlyRate: string;
    createdAt: string;
    updatedAt: string;
}

interface ProgrammersResponse {
    success: boolean;
    data: IProgrammer[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function ProgrammersAdminPage() {
    const [programmers, setProgrammers] = useState<IProgrammer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Modal state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProgrammer, setEditingProgrammer] =
        useState<IProgrammer | null>(null);
    const { toast } = useToast();

    // Form mode state
    const [inputMode, setInputMode] = useState<"form" | "json">("form");

    // Form inputs
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        location: "",
        bio: "",
        fullBio: "",
        stack: "",
        category: "frontend",
        avatar: "",
        github: "",
        portfolio: "",
        email: "",
        rating: "4.5",
        projects: "0",
        joinedDate: new Date().toISOString().split("T")[0],
        experience: "",
        availability: "",
        hourlyRate: "",
        languages: "",
        certifications: "",
    });

    // JSON input
    const [jsonInput, setJsonInput] = useState("");

    // Delete state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Search and filter
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const fetchProgrammers = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                ...(categoryFilter !== "all" && { category: categoryFilter }),
                ...(searchTerm && { search: searchTerm }),
            });

            const response = await fetch(`/api/programmers?${params}`);

            if (!response.ok) {
                throw new Error("Failed to fetch programmers");
            }

            const result: ProgrammersResponse = await response.json();

            if (result.success) {
                setProgrammers(result.data);
                setCurrentPage(result.pagination.page);
                setTotalPages(result.pagination.totalPages);
                setTotal(result.pagination.total);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgrammers(currentPage);
    }, [currentPage, categoryFilter, searchTerm]);

    const truncateText = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            location: "",
            bio: "",
            fullBio: "",
            stack: "",
            category: "frontend",
            avatar: "",
            github: "",
            portfolio: "",
            email: "",
            rating: "4.5",
            projects: "0",
            joinedDate: new Date().toISOString().split("T")[0],
            experience: "",
            availability: "",
            hourlyRate: "",
            languages: "",
            certifications: "",
        });
        setJsonInput("");
        setEditingProgrammer(null);
    };

    const handleOpenDialog = (programmer?: IProgrammer) => {
        if (programmer) {
            // Edit mode
            setEditingProgrammer(programmer);
            setFormData({
                name: programmer.name,
                role: programmer.role,
                location: programmer.location,
                bio: programmer.bio,
                fullBio: "",
                stack: programmer.stack.join(", "),
                category: programmer.category,
                avatar: programmer.avatar,
                github: programmer.github,
                portfolio: programmer.portfolio,
                email: programmer.email,
                rating: programmer.rating.toString(),
                projects: programmer.projects.toString(),
                joinedDate: new Date().toISOString().split("T")[0],
                experience: programmer.experience,
                availability: programmer.availability,
                hourlyRate: programmer.hourlyRate,
                languages: "",
                certifications: "",
            });
        } else {
            // Create mode
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmitProgrammer = async () => {
        try {
            setIsSubmitting(true);

            let payload;

            if (inputMode === "form") {
                // Validate form inputs
                if (
                    !formData.name ||
                    !formData.role ||
                    !formData.email ||
                    !formData.location
                ) {
                    toast({
                        title: "Error",
                        description: "Please fill in all required fields",
                        variant: "destructive",
                    });
                    return;
                }

                // Process arrays
                const stackArray = formData.stack
                    ? formData.stack
                          .split(",")
                          .map((tech) => tech.trim())
                          .filter((tech) => tech)
                    : [];

                const languagesArray = formData.languages
                    ? formData.languages
                          .split(",")
                          .map((lang) => lang.trim())
                          .filter((lang) => lang)
                    : ["English"];

                const certificationsArray = formData.certifications
                    ? formData.certifications
                          .split(",")
                          .map((cert) => cert.trim())
                          .filter((cert) => cert)
                    : [];

                payload = {
                    name: formData.name,
                    role: formData.role,
                    location: formData.location,
                    bio: formData.bio,
                    fullBio: formData.fullBio || formData.bio,
                    stack: stackArray,
                    category: formData.category,
                    avatar: formData.avatar || "/placeholder.svg",
                    github: formData.github,
                    portfolio: formData.portfolio,
                    email: formData.email,
                    rating: parseFloat(formData.rating) || 4.5,
                    projects: parseInt(formData.projects) || 0,
                    joinedDate: formData.joinedDate,
                    experience: formData.experience,
                    availability: formData.availability,
                    hourlyRate: formData.hourlyRate,
                    languages: languagesArray,
                    certifications: certificationsArray,
                    skills: [],
                    recentProjects: [],
                    testimonials: [],
                };
            } else {
                // Validate and parse JSON
                try {
                    payload = JSON.parse(jsonInput);
                    if (
                        !payload.name ||
                        !payload.role ||
                        !payload.email ||
                        !payload.location
                    ) {
                        throw new Error(
                            "JSON must contain name, role, email, and location"
                        );
                    }
                } catch (parseError) {
                    toast({
                        title: "Invalid JSON",
                        description:
                            parseError instanceof Error
                                ? parseError.message
                                : "Please provide valid JSON",
                        variant: "destructive",
                    });
                    return;
                }
            }

            // Determine if we're creating or updating
            const url = editingProgrammer
                ? `/api/programmers/${editingProgrammer._id}`
                : "/api/programmers";
            const method = editingProgrammer ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save programmer");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: `Programmer ${
                        editingProgrammer ? "updated" : "created"
                    } successfully`,
                });

                resetForm();
                setIsDialogOpen(false);

                // Refresh programmers list
                fetchProgrammers(1);
                setCurrentPage(1);
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to save programmer",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProgrammer = async (programmerId: string) => {
        try {
            setDeletingId(programmerId);

            const response = await fetch(`/api/programmers/${programmerId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete programmer");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Programmer deleted successfully",
                });

                // Refresh the programmers list
                if (programmers.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    fetchProgrammers(currentPage - 1);
                } else {
                    fetchProgrammers(currentPage);
                }
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete programmer",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && programmers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Programmers Management</h1>
                <Card className="retro-card">
                    <CardContent className="pt-6">
                        <p className="text-red-500">Error: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Programmers Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Total: {total} programmers
                    </p>
                </div>
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button
                            className="retro-button"
                            onClick={() => handleOpenDialog()}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Programmer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProgrammer
                                    ? "Edit Programmer"
                                    : "Add New Programmer"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingProgrammer
                                    ? "Update programmer information"
                                    : "Add a new programmer by filling the form or using JSON input"}
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs
                            value={inputMode}
                            onValueChange={(value) =>
                                setInputMode(value as "form" | "json")
                            }
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="form">
                                    Form Input
                                </TabsTrigger>
                                <TabsTrigger value="json">
                                    JSON Input
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="form"
                                className="space-y-4 mt-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter full name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role">
                                            Role{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="role"
                                            placeholder="e.g., Senior Frontend Developer"
                                            value={formData.role}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    role: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">
                                            Location{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="location"
                                            placeholder="e.g., San Francisco, CA"
                                            value={formData.location}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    location: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                category: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                            <SelectItem value="devops">
                                                DevOps
                                            </SelectItem>
                                            <SelectItem value="data">
                                                Data Science & AI
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">
                                        Bio{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Short bio..."
                                        value={formData.bio}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                bio: e.target.value,
                                            })
                                        }
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stack">
                                        Tech Stack (comma-separated)
                                    </Label>
                                    <Textarea
                                        id="stack"
                                        placeholder="React, TypeScript, Node.js, MongoDB"
                                        value={formData.stack}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stack: e.target.value,
                                            })
                                        }
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="github">GitHub</Label>
                                        <Input
                                            id="github"
                                            placeholder="username"
                                            value={formData.github}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    github: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="portfolio">
                                            Portfolio
                                        </Label>
                                        <Input
                                            id="portfolio"
                                            placeholder="yoursite.com"
                                            value={formData.portfolio}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    portfolio: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rating">Rating</Label>
                                        <Input
                                            id="rating"
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={formData.rating}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    rating: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="projects">
                                            Projects
                                        </Label>
                                        <Input
                                            id="projects"
                                            type="number"
                                            min="0"
                                            value={formData.projects}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    projects: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">
                                            Experience
                                        </Label>
                                        <Input
                                            id="experience"
                                            placeholder="5+ years"
                                            value={formData.experience}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    experience: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="availability">
                                            Availability
                                        </Label>
                                        <Input
                                            id="availability"
                                            placeholder="Available for freelance"
                                            value={formData.availability}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    availability:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hourlyRate">
                                            Hourly Rate
                                        </Label>
                                        <Input
                                            id="hourlyRate"
                                            placeholder="$80-120"
                                            value={formData.hourlyRate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    hourlyRate: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="avatar">Avatar URL</Label>
                                    <Input
                                        id="avatar"
                                        placeholder="https://example.com/avatar.jpg"
                                        value={formData.avatar}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                avatar: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="json"
                                className="space-y-4 mt-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="json-input">
                                        JSON Input
                                    </Label>
                                    <Textarea
                                        id="json-input"
                                        placeholder={`{\n  "name": "John Doe",\n  "role": "Frontend Developer",\n  "email": "john@example.com",\n  "location": "New York, NY",\n  "bio": "...",\n  "fullBio": "...",\n  "stack": ["React", "TypeScript"],\n  "category": "frontend",\n  "github": "johndoe",\n  "portfolio": "johndoe.dev",\n  "rating": 4.5,\n  "projects": 10,\n  "experience": "5+ years",\n  "availability": "Available",\n  "hourlyRate": "$80-120"\n}`}
                                        value={jsonInput}
                                        onChange={(e) =>
                                            setJsonInput(e.target.value)
                                        }
                                        rows={15}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter a valid JSON object with required
                                        fields: name, role, email, location
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitProgrammer}
                                disabled={isSubmitting}
                                className="retro-button"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : editingProgrammer ? (
                                    "Update Programmer"
                                ) : (
                                    "Create Programmer"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Filter */}
            <Card className="retro-card">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                            placeholder="Search by name, role, or technology..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1"
                        />
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                <SelectItem value="frontend">
                                    Frontend
                                </SelectItem>
                                <SelectItem value="backend">Backend</SelectItem>
                                <SelectItem value="fullstack">
                                    Full Stack
                                </SelectItem>
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="devops">DevOps</SelectItem>
                                <SelectItem value="data">
                                    Data Science & AI
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="retro-card">
                <CardHeader>
                    <CardTitle>All Programmers</CardTitle>
                </CardHeader>
                <CardContent>
                    {programmers.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px]">
                                                No
                                            </TableHead>
                                            <TableHead>
                                                Programmer Info
                                            </TableHead>
                                            <TableHead className="w-[150px]">
                                                Stats
                                            </TableHead>
                                            <TableHead className="w-[200px] text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {programmers.map(
                                            (programmer, index) => (
                                                <TableRow key={programmer._id}>
                                                    <TableCell className="font-medium">
                                                        {(currentPage - 1) *
                                                            10 +
                                                            index +
                                                            1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-start gap-3">
                                                            <img
                                                                src={
                                                                    programmer.avatar ||
                                                                    "/placeholder.svg"
                                                                }
                                                                alt={
                                                                    programmer.name
                                                                }
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                            <div className="space-y-1">
                                                                <div className="font-semibold">
                                                                    {
                                                                        programmer.name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {
                                                                        programmer.role
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {
                                                                        programmer.location
                                                                    }
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <Badge variant="outline">
                                                                        {
                                                                            programmer.category
                                                                        }
                                                                    </Badge>
                                                                    {programmer.stack
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        )
                                                                        .map(
                                                                            (
                                                                                tech
                                                                            ) => (
                                                                                <Badge
                                                                                    key={
                                                                                        tech
                                                                                    }
                                                                                    variant="secondary"
                                                                                    className="text-xs"
                                                                                >
                                                                                    {
                                                                                        tech
                                                                                    }
                                                                                </Badge>
                                                                            )
                                                                        )}
                                                                    {programmer
                                                                        .stack
                                                                        .length >
                                                                        3 && (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            +
                                                                            {programmer
                                                                                .stack
                                                                                .length -
                                                                                3}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                                <span className="text-sm font-medium">
                                                                    {
                                                                        programmer.rating
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    programmer.projects
                                                                }{" "}
                                                                projects
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    programmer.experience
                                                                }
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/programmers/${programmer._id}`}
                                                                    target="_blank"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                onClick={() =>
                                                                    handleOpenDialog(
                                                                        programmer
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </Button>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                        disabled={
                                                                            deletingId ===
                                                                            programmer._id
                                                                        }
                                                                    >
                                                                        {deletingId ===
                                                                        programmer._id ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <>
                                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                                Delete
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Are
                                                                            you
                                                                            sure?
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This
                                                                            action
                                                                            cannot
                                                                            be
                                                                            undone.
                                                                            This
                                                                            will
                                                                            permanently
                                                                            delete
                                                                            <span className="font-semibold">
                                                                                {" "}
                                                                                "
                                                                                {
                                                                                    programmer.name
                                                                                }

                                                                                "
                                                                            </span>
                                                                            .
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className="bg-red-500 hover:bg-red-600"
                                                                            onClick={() =>
                                                                                handleDeleteProgrammer(
                                                                                    programmer._id
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {programmers.map((programmer, index) => (
                                    <Card
                                        key={programmer._id}
                                        className="overflow-hidden"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3 mb-3">
                                                <img
                                                    src={
                                                        programmer.avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={programmer.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            #
                                                            {(currentPage - 1) *
                                                                10 +
                                                                index +
                                                                1}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {
                                                                programmer.category
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <div className="font-semibold">
                                                        {programmer.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {programmer.role}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {programmer.location}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mb-3 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                    {programmer.rating}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {programmer.projects}{" "}
                                                    projects
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {programmer.experience}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {programmer.stack
                                                    .slice(0, 4)
                                                    .map((tech) => (
                                                        <Badge
                                                            key={tech}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                {programmer.stack.length >
                                                    4 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {programmer.stack
                                                            .length - 4}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/programmers/${programmer._id}`}
                                                            target="_blank"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                programmer
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                </div>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                            disabled={
                                                                deletingId ===
                                                                programmer._id
                                                            }
                                                        >
                                                            {deletingId ===
                                                            programmer._id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                    Programmer
                                                                </>
                                                            )}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action
                                                                cannot be
                                                                undone. This
                                                                will permanently
                                                                delete
                                                                <span className="font-semibold">
                                                                    {" "}
                                                                    "
                                                                    {
                                                                        programmer.name
                                                                    }
                                                                    "
                                                                </span>
                                                                .
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-500 hover:bg-red-600"
                                                                onClick={() =>
                                                                    handleDeleteProgrammer(
                                                                        programmer._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(1, prev - 1)
                                                )
                                            }
                                            disabled={
                                                currentPage === 1 || loading
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        totalPages,
                                                        prev + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages ||
                                                loading
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">
                                No programmers found. Add your first programmer!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
