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
    FolderOpen,
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

interface ICategory {
    _id: string;
    id: string;
    title: string;
    description: string;
    longDescription: string;
    icon: string;
    color: string;
    programmersCount: number;
    projectsCount: number;
    eventsCount: number;
    technologies: string[];
    image: string;
    createdAt: string;
    updatedAt: string;
}

interface CategoriesResponse {
    success: boolean;
    data: ICategory[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function CategoriesAdminPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Modal state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(
        null
    );
    const { toast } = useToast();

    // Form mode state
    const [inputMode, setInputMode] = useState<"form" | "json">("form");

    // Form inputs
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        longDescription: "",
        icon: "Globe",
        color: "from-blue-500 to-cyan-500",
        programmersCount: "0",
        projectsCount: "0",
        eventsCount: "0",
        technologies: "",
        image: "",
    });

    // JSON input
    const [jsonInput, setJsonInput] = useState("");

    // Delete state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCategories = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });

            const response = await fetch(`/api/categories?${params}`);

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const result: CategoriesResponse = await response.json();

            if (result.success) {
                // Filter by search term on client side
                let filteredData = result.data;
                if (searchTerm) {
                    filteredData = result.data.filter(
                        (cat) =>
                            cat.title
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                            cat.description
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                            cat.id
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                    );
                }

                setCategories(filteredData);
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
        fetchCategories(currentPage);
    }, [currentPage]);

    useEffect(() => {
        // Re-fetch when search term changes
        if (currentPage === 1) {
            fetchCategories(1);
        } else {
            setCurrentPage(1);
        }
    }, [searchTerm]);

    const truncateText = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const resetForm = () => {
        setFormData({
            id: "",
            title: "",
            description: "",
            longDescription: "",
            icon: "Globe",
            color: "from-blue-500 to-cyan-500",
            programmersCount: "0",
            projectsCount: "0",
            eventsCount: "0",
            technologies: "",
            image: "",
        });
        setJsonInput("");
        setEditingCategory(null);
    };

    const handleOpenDialog = (category?: ICategory) => {
        if (category) {
            // Edit mode
            setEditingCategory(category);
            setFormData({
                id: category.id,
                title: category.title,
                description: category.description,
                longDescription: category.longDescription,
                icon: category.icon,
                color: category.color,
                programmersCount: category.programmersCount.toString(),
                projectsCount: category.projectsCount.toString(),
                eventsCount: category.eventsCount.toString(),
                technologies: category.technologies.join(", "),
                image: category.image,
            });
        } else {
            // Create mode
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmitCategory = async () => {
        try {
            setIsSubmitting(true);

            let payload;

            if (inputMode === "form") {
                // Validate form inputs
                if (
                    !formData.id ||
                    !formData.title ||
                    !formData.description ||
                    !formData.longDescription
                ) {
                    toast({
                        title: "Error",
                        description: "Please fill in all required fields",
                        variant: "destructive",
                    });
                    return;
                }

                // Process arrays
                const technologiesArray = formData.technologies
                    ? formData.technologies
                          .split(",")
                          .map((tech) => tech.trim())
                          .filter((tech) => tech)
                    : [];

                payload = {
                    id: formData.id,
                    title: formData.title,
                    description: formData.description,
                    longDescription: formData.longDescription,
                    icon: formData.icon,
                    color: formData.color,
                    programmersCount: parseInt(formData.programmersCount) || 0,
                    projectsCount: parseInt(formData.projectsCount) || 0,
                    eventsCount: parseInt(formData.eventsCount) || 0,
                    technologies: technologiesArray,
                    image: formData.image || "/placeholder.svg",
                    programmers: [],
                    projects: [],
                    events: [],
                    resources: [],
                };
            } else {
                // Validate and parse JSON
                try {
                    payload = JSON.parse(jsonInput);
                    if (
                        !payload.id ||
                        !payload.title ||
                        !payload.description ||
                        !payload.longDescription
                    ) {
                        throw new Error(
                            "JSON must contain id, title, description, and longDescription"
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
            const url = editingCategory
                ? `/api/categories/${editingCategory._id}`
                : "/api/categories";
            const method = editingCategory ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save category");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: `Category ${editingCategory ? "updated" : "created"} successfully`,
                });

                resetForm();
                setIsDialogOpen(false);

                // Refresh categories list
                fetchCategories(1);
                setCurrentPage(1);
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to save category",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            setDeletingId(categoryId);

            const response = await fetch(`/api/categories/${categoryId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete category");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Category deleted successfully",
                });

                // Refresh the categories list
                if (categories.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    fetchCategories(currentPage - 1);
                } else {
                    fetchCategories(currentPage);
                }
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete category",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Categories Management</h1>
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
                        Categories Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Total: {total} categories
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
                            Add New Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory
                                    ? "Edit Category"
                                    : "Add New Category"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCategory
                                    ? "Update category information"
                                    : "Add a new category by filling the form or using JSON input"}
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
                                        <Label htmlFor="id">
                                            Category ID (slug){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="id"
                                            placeholder="web-development"
                                            value={formData.id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    id: e.target.value,
                                                })
                                            }
                                            disabled={!!editingCategory}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            URL-friendly identifier (cannot be
                                            changed after creation)
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Title{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="Web Development"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Short Description{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Brief description for card view..."
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="longDescription">
                                        Long Description{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="longDescription"
                                        placeholder="Detailed description for detail page..."
                                        value={formData.longDescription}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                longDescription: e.target.value,
                                            })
                                        }
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="icon">
                                            Icon (Lucide Icon Name)
                                        </Label>
                                        <Input
                                            id="icon"
                                            placeholder="Globe, Code, Database, etc."
                                            value={formData.icon}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    icon: e.target.value,
                                                })
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            e.g., Globe, Code, Database,
                                            Smartphone, Cloud, Brain
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="color">
                                            Gradient Color
                                        </Label>
                                        <Input
                                            id="color"
                                            placeholder="from-blue-500 to-cyan-500"
                                            value={formData.color}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    color: e.target.value,
                                                })
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Tailwind gradient classes
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="programmersCount">
                                            Programmers
                                        </Label>
                                        <Input
                                            id="programmersCount"
                                            type="number"
                                            min="0"
                                            value={formData.programmersCount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    programmersCount:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="projectsCount">
                                            Projects
                                        </Label>
                                        <Input
                                            id="projectsCount"
                                            type="number"
                                            min="0"
                                            value={formData.projectsCount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    projectsCount:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="eventsCount">
                                            Events
                                        </Label>
                                        <Input
                                            id="eventsCount"
                                            type="number"
                                            min="0"
                                            value={formData.eventsCount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    eventsCount: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="technologies">
                                        Technologies (comma-separated)
                                    </Label>
                                    <Textarea
                                        id="technologies"
                                        placeholder="React, Node.js, MongoDB, TypeScript"
                                        value={formData.technologies}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                technologies: e.target.value,
                                            })
                                        }
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input
                                        id="image"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.image}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                image: e.target.value,
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
                                        placeholder={`{\n  "id": "web-development",\n  "title": "Web Development",\n  "description": "Brief description...",\n  "longDescription": "Detailed description...",\n  "icon": "Globe",\n  "color": "from-blue-500 to-cyan-500",\n  "programmersCount": 150,\n  "projectsCount": 50,\n  "eventsCount": 10,\n  "technologies": ["React", "Node.js"],\n  "image": "https://example.com/image.jpg",\n  "programmers": [],\n  "projects": [],\n  "events": [],\n  "resources": []\n}`}
                                        value={jsonInput}
                                        onChange={(e) =>
                                            setJsonInput(e.target.value)
                                        }
                                        rows={20}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter a valid JSON object with required
                                        fields: id, title, description,
                                        longDescription
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
                                onClick={handleSubmitCategory}
                                disabled={isSubmitting}
                                className="retro-button"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : editingCategory ? (
                                    "Update Category"
                                ) : (
                                    "Create Category"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Card className="retro-card">
                <CardContent className="pt-6">
                    <Input
                        placeholder="Search by title, description, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </CardContent>
            </Card>

            <Card className="retro-card">
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {categories.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px]">
                                                No
                                            </TableHead>
                                            <TableHead>Category Info</TableHead>
                                            <TableHead className="w-[150px]">
                                                Stats
                                            </TableHead>
                                            <TableHead className="w-[200px] text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.map((category, index) => (
                                            <TableRow key={category._id}>
                                                <TableCell className="font-medium">
                                                    {(currentPage - 1) * 10 +
                                                        index +
                                                        1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}
                                                        >
                                                            <FolderOpen className="h-6 w-6" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="font-semibold">
                                                                {category.title}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {truncateText(
                                                                    category.description,
                                                                    60
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline">
                                                                    {
                                                                        category.id
                                                                    }
                                                                </Badge>
                                                                {category.technologies
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
                                                                {category
                                                                    .technologies
                                                                    .length >
                                                                    3 && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        +
                                                                        {category
                                                                            .technologies
                                                                            .length -
                                                                            3}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1 text-sm">
                                                        <div>
                                                            👥{" "}
                                                            {
                                                                category.programmersCount
                                                            }{" "}
                                                            programmers
                                                        </div>
                                                        <div>
                                                            📁{" "}
                                                            {
                                                                category.projectsCount
                                                            }{" "}
                                                            projects
                                                        </div>
                                                        <div>
                                                            📅{" "}
                                                            {
                                                                category.eventsCount
                                                            }{" "}
                                                            events
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
                                                                href={`/categories/${category.id}`}
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
                                                                    category
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
                                                                        category._id
                                                                    }
                                                                >
                                                                    {deletingId ===
                                                                    category._id ? (
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
                                                                        Are you
                                                                        sure?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This
                                                                        action
                                                                        cannot be
                                                                        undone.
                                                                        This will
                                                                        permanently
                                                                        delete
                                                                        <span className="font-semibold">
                                                                            {" "}
                                                                            "
                                                                            {
                                                                                category.title
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
                                                                            handleDeleteCategory(
                                                                                category._id
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
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {categories.map((category, index) => (
                                    <Card
                                        key={category._id}
                                        className="overflow-hidden"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div
                                                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white flex-shrink-0`}
                                                >
                                                    <FolderOpen className="h-8 w-8" />
                                                </div>
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
                                                            {category.id}
                                                        </Badge>
                                                    </div>
                                                    <div className="font-semibold">
                                                        {category.title}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {truncateText(
                                                            category.description,
                                                            80
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1 text-sm mb-3">
                                                <div>
                                                    👥{" "}
                                                    {category.programmersCount}{" "}
                                                    programmers
                                                </div>
                                                <div>
                                                    📁 {category.projectsCount}{" "}
                                                    projects
                                                </div>
                                                <div>
                                                    📅 {category.eventsCount}{" "}
                                                    events
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {category.technologies
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
                                                {category.technologies.length >
                                                    4 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {category.technologies
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
                                                            href={`/categories/${category.id}`}
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
                                                                category
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
                                                                category._id
                                                            }
                                                        >
                                                            {deletingId ===
                                                            category._id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                    Category
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
                                                                        category.title
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
                                                                    handleDeleteCategory(
                                                                        category._id
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
                                No categories found. Add your first category!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
