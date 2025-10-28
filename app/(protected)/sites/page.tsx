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
    Save,
    CheckCircle2,
    XCircle,
    ExternalLink,
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
import { Switch } from "@/components/ui/switch";

interface ISite {
    _id: string;
    title: string;
    description: string;
    link: string;
    category: string;
    thumbnails: string[];
    isFree: boolean;
    carouselData: {
        slides: Array<{
            tipe_slide: string;
            judul_slide: string;
            sub_judul_slide: string;
            konten_slide: string;
            prompt_untuk_image?: string;
            saved_image_url?: string;
            saved_slide_url?: string;
        }>;
        caption: string;
        hashtags: string[];
    };
    createdAt: string;
    updatedAt: string;
}

interface SitesResponse {
    success: boolean;
    data: ISite[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function SitesPage() {
    const [sites, setSites] = useState<ISite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Modal state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // Form mode state
    const [inputMode, setInputMode] = useState<"form" | "json">("form");

    // Form inputs
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        link: "",
        category: "",
        isFree: false,
        thumbnails: "",
    });

    // JSON input
    const [jsonInput, setJsonInput] = useState("");

    // Delete state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchSites = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/sites?page=${page}&limit=10`);

            if (!response.ok) {
                throw new Error("Failed to fetch sites");
            }

            const result: SitesResponse = await response.json();

            if (result.success) {
                setSites(result.data);
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
        fetchSites(currentPage);
    }, [currentPage]);

    const truncateText = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const getSavedSlidesCount = (site: ISite) => {
        return site.carouselData.slides.filter((slide) => slide.saved_slide_url)
            .length;
    };

    const handleSubmitSite = async () => {
        try {
            setIsSubmitting(true);

            let payload;

            if (inputMode === "form") {
                // Validate form inputs
                if (
                    !formData.title ||
                    !formData.description ||
                    !formData.link ||
                    !formData.category
                ) {
                    toast({
                        title: "Error",
                        description: "Please fill in all required fields",
                        variant: "destructive",
                    });
                    return;
                }

                // Process thumbnails
                const thumbnailsArray = formData.thumbnails
                    ? formData.thumbnails
                          .split(",")
                          .map((url) => url.trim())
                          .filter((url) => url)
                    : [];

                payload = {
                    ...formData,
                    thumbnails: thumbnailsArray,
                };
            } else {
                // Validate and parse JSON
                try {
                    payload = JSON.parse(jsonInput);
                    if (
                        !payload.title ||
                        !payload.description ||
                        !payload.link ||
                        !payload.category
                    ) {
                        throw new Error(
                            "JSON must contain title, description, link, and category"
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

            // Send POST request to generate-site endpoint
            const response = await fetch("/api/generate-site", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to generate site");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Site created successfully",
                });

                // Reset form
                setFormData({
                    title: "",
                    description: "",
                    link: "",
                    category: "",
                    isFree: false,
                    thumbnails: "",
                });
                setJsonInput("");
                setIsDialogOpen(false);

                // Refresh sites list
                fetchSites(1);
                setCurrentPage(1);
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to create site",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSite = async (siteId: string) => {
        try {
            setDeletingId(siteId);

            const response = await fetch(`/api/sites/${siteId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete site");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Site deleted successfully",
                });

                // Refresh the sites list
                // If current page becomes empty after delete, go to previous page
                if (sites.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    fetchSites(currentPage - 1);
                } else {
                    fetchSites(currentPage);
                }
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete site",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && sites.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Recommendation Sites</h1>
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
                        Recommendation Sites for Developers
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Total: {total} sites
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="retro-button">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Site
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                Add New Recommendation Site
                            </DialogTitle>
                            <DialogDescription>
                                Add a new site by filling the form or using JSON
                                input
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
                                <div className="space-y-2">
                                    <Label htmlFor="title">
                                        Title{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter site title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter site description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="link">
                                        Link{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="link"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={formData.link}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                link: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="category"
                                        placeholder="e.g., UI/UX Tools, API Services"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="thumbnails">
                                        Thumbnails (comma-separated URLs)
                                    </Label>
                                    <Textarea
                                        id="thumbnails"
                                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                        value={formData.thumbnails}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                thumbnails: e.target.value,
                                            })
                                        }
                                        rows={2}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Separate multiple URLs with commas
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isFree"
                                        checked={formData.isFree}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                isFree: checked,
                                            })
                                        }
                                    />
                                    <Label
                                        htmlFor="isFree"
                                        className="cursor-pointer"
                                    >
                                        This site is free to use
                                    </Label>
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
                                        placeholder={`{\n  "title": "Site title",\n  "description": "Site description",\n  "link": "https://example.com",\n  "category": "UI/UX Tools",\n  "isFree": true,\n  "thumbnails": ["https://example.com/image.jpg"]\n}`}
                                        value={jsonInput}
                                        onChange={(e) =>
                                            setJsonInput(e.target.value)
                                        }
                                        rows={12}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter a valid JSON object with title,
                                        description, link, and category fields
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
                                onClick={handleSubmitSite}
                                disabled={isSubmitting}
                                className="retro-button"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Site"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="retro-card">
                <CardHeader>
                    <CardTitle>All Recommendation Sites</CardTitle>
                </CardHeader>
                <CardContent>
                    {sites.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px]">
                                                No
                                            </TableHead>
                                            <TableHead>Site Info</TableHead>
                                            <TableHead className="w-[150px]">
                                                Status
                                            </TableHead>
                                            <TableHead className="w-[200px] text-right">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sites.map((site, index) => {
                                            const totalSlides =
                                                site.carouselData.slides.length;
                                            const savedSlides =
                                                getSavedSlidesCount(site);

                                            return (
                                                <TableRow key={site._id}>
                                                    <TableCell className="font-medium">
                                                        {(currentPage - 1) *
                                                            10 +
                                                            index +
                                                            1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="font-semibold flex items-center gap-2">
                                                                {site.title}
                                                                {site.isFree && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="bg-green-100 text-green-800"
                                                                    >
                                                                        Free
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {truncateText(
                                                                    site.description,
                                                                    80
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Badge variant="outline">
                                                                    {
                                                                        site.category
                                                                    }
                                                                </Badge>
                                                                <a
                                                                    href={
                                                                        site.link
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                                >
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    Visit Site
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-2">
                                                            <Badge variant="secondary">
                                                                {totalSlides}{" "}
                                                                slides
                                                            </Badge>
                                                            <div className="flex items-center gap-1 text-sm">
                                                                {savedSlides ===
                                                                totalSlides ? (
                                                                    <Badge
                                                                        variant="default"
                                                                        className="bg-green-500 hover:bg-green-600"
                                                                    >
                                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                        {
                                                                            savedSlides
                                                                        }
                                                                        /
                                                                        {
                                                                            totalSlides
                                                                        }{" "}
                                                                        saved
                                                                    </Badge>
                                                                ) : savedSlides >
                                                                  0 ? (
                                                                    <Badge
                                                                        variant="default"
                                                                        className="bg-yellow-500 hover:bg-yellow-600"
                                                                    >
                                                                        {
                                                                            savedSlides
                                                                        }
                                                                        /
                                                                        {
                                                                            totalSlides
                                                                        }{" "}
                                                                        saved
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-gray-500"
                                                                    >
                                                                        <XCircle className="h-3 w-3 mr-1" />
                                                                        Not
                                                                        saved
                                                                    </Badge>
                                                                )}
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
                                                                    href={`/template/${site._id}?data=sites`}
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Detail
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Link
                                                                    href={`/template/${site._id}?data=sites&format=save`}
                                                                >
                                                                    <Save className="h-4 w-4 mr-2" />
                                                                    Save
                                                                </Link>
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
                                                                            site._id
                                                                        }
                                                                    >
                                                                        {deletingId ===
                                                                        site._id ? (
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
                                                                            the
                                                                            site
                                                                            <span className="font-semibold">
                                                                                {" "}
                                                                                "
                                                                                {
                                                                                    site.title
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
                                                                                handleDeleteSite(
                                                                                    site._id
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
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {sites.map((site, index) => {
                                    const totalSlides =
                                        site.carouselData.slides.length;
                                    const savedSlides =
                                        getSavedSlidesCount(site);

                                    return (
                                        <Card
                                            key={site._id}
                                            className="overflow-hidden"
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                #
                                                                {(currentPage -
                                                                    1) *
                                                                    10 +
                                                                    index +
                                                                    1}
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {site.category}
                                                            </Badge>
                                                            {site.isFree && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-green-100 text-green-800"
                                                                >
                                                                    Free
                                                                </Badge>
                                                            )}
                                                            <Badge variant="secondary">
                                                                {totalSlides}{" "}
                                                                slides
                                                            </Badge>
                                                        </div>
                                                        <CardTitle className="text-lg wrap-break-word">
                                                            {site.title}
                                                        </CardTitle>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <p className="wrap-break-word">
                                                            {truncateText(
                                                                site.description,
                                                                100
                                                            )}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={site.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        Visit Site
                                                    </a>
                                                </div>

                                                {/* Saved Status */}
                                                <div className="pt-2">
                                                    {savedSlides ===
                                                    totalSlides ? (
                                                        <Badge
                                                            variant="default"
                                                            className="bg-green-500 hover:bg-green-600"
                                                        >
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            {savedSlides}/
                                                            {totalSlides} slides
                                                            saved
                                                        </Badge>
                                                    ) : savedSlides > 0 ? (
                                                        <Badge
                                                            variant="default"
                                                            className="bg-yellow-500 hover:bg-yellow-600"
                                                        >
                                                            {savedSlides}/
                                                            {totalSlides} slides
                                                            saved
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-gray-500"
                                                        >
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            No slides saved
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-2 pt-2">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/template/${site._id}?data=sites`}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Detail
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/template/${site._id}?data=sites&format=save`}
                                                            >
                                                                <Save className="h-4 w-4 mr-2" />
                                                                Save
                                                            </Link>
                                                        </Button>
                                                    </div>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                                disabled={
                                                                    deletingId ===
                                                                    site._id
                                                                }
                                                            >
                                                                {deletingId ===
                                                                site._id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                        Site
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
                                                                    This action
                                                                    cannot be
                                                                    undone. This
                                                                    will
                                                                    permanently
                                                                    delete the
                                                                    site
                                                                    <span className="font-semibold">
                                                                        {" "}
                                                                        "
                                                                        {
                                                                            site.title
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
                                                                        handleDeleteSite(
                                                                            site._id
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
                                    );
                                })}
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
                                No sites found. Add your first recommendation
                                site!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
