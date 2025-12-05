"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

interface IRiddle {
    _id: string;
    title: string;
    riddle: string;
    solution: string;
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

interface RiddlesResponse {
    success: boolean;
    data: IRiddle[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function RiddlesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [riddles, setRiddles] = useState<IRiddle[]>([]);
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
        riddle: "",
        solution: "",
    });

    // JSON input
    const [jsonInput, setJsonInput] = useState("");

    // Delete state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchRiddles = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/riddles?page=${page}&limit=10`);

            if (!response.ok) {
                throw new Error("Failed to fetch riddles");
            }

            const result: RiddlesResponse = await response.json();

            if (result.success) {
                setRiddles(result.data);
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
        const pageFromUrl = searchParams.get("page");
        const pageNumber = pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
        setCurrentPage(pageNumber);
        fetchRiddles(pageNumber);
    }, [searchParams]);

    const truncateText = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const getSavedSlidesCount = (riddle: IRiddle) => {
        return riddle.carouselData.slides.filter(
            (slide) => slide.saved_slide_url
        ).length;
    };

    const handleSubmitRiddle = async () => {
        try {
            setIsSubmitting(true);

            let payload;

            if (inputMode === "form") {
                // Validate form inputs
                if (!formData.title || !formData.riddle || !formData.solution) {
                    toast({
                        title: "Error",
                        description: "Please fill in all fields",
                        variant: "destructive",
                    });
                    return;
                }
                payload = formData;
            } else {
                // Validate and parse JSON
                try {
                    payload = JSON.parse(jsonInput);
                    if (
                        !payload.title ||
                        !payload.riddle ||
                        !payload.solution
                    ) {
                        throw new Error(
                            "JSON must contain title, riddle, and solution"
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

            // Send POST request to generate-riddle endpoint
            const response = await fetch("/api/generate-riddle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to generate riddle");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Riddle created successfully",
                });

                // Reset form
                setFormData({ title: "", riddle: "", solution: "" });
                setJsonInput("");
                setIsDialogOpen(false);

                // Refresh riddles list
                fetchRiddles(1);
                setCurrentPage(1);
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to create riddle",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyJson = async () => {
        try {
            await navigator.clipboard.writeText(jsonInput || "");
            toast({ title: "Copied", description: "JSON copied to clipboard" });
        } catch (err) {
            try {
                const el = document.getElementById(
                    "json-input"
                ) as HTMLTextAreaElement | null;
                if (el) {
                    el.select();
                    document.execCommand("copy");
                    toast({
                        title: "Copied",
                        description: "JSON copied to clipboard",
                    });
                    return;
                }
            } catch (e) {
                // fallthrough
            }
            toast({
                title: "Error",
                description: "Failed to copy JSON",
                variant: "destructive",
            });
        }
    };

    const handleDeleteRiddle = async (riddleId: string) => {
        try {
            setDeletingId(riddleId);

            const response = await fetch(`/api/riddles/${riddleId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete riddle");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Riddle deleted successfully",
                });

                // Refresh the riddles list
                // If current page becomes empty after delete, go to previous page
                if (riddles.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    fetchRiddles(currentPage - 1);
                } else {
                    fetchRiddles(currentPage);
                }
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete riddle",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && riddles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Riddles</h1>
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
                    <h1 className="text-3xl font-bold">Riddles</h1>
                    <p className="text-muted-foreground mt-1">
                        Total: {total} riddles
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="retro-button">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Riddle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Riddle</DialogTitle>
                            <DialogDescription>
                                Add a new riddle by filling the form or using
                                JSON input
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
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter riddle title"
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
                                    <Label htmlFor="riddle">Riddle</Label>
                                    <Textarea
                                        id="riddle"
                                        placeholder="Enter the riddle question"
                                        value={formData.riddle}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                riddle: e.target.value,
                                            })
                                        }
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="solution">Solution</Label>
                                    <Textarea
                                        id="solution"
                                        placeholder="Enter the solution"
                                        value={formData.solution}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                solution: e.target.value,
                                            })
                                        }
                                        rows={3}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="json"
                                className="space-y-4 mt-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="json-input">
                                            JSON Input
                                        </Label>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleCopyJson}
                                        >
                                            Copy JSON
                                        </Button>
                                    </div>
                                    <Textarea
                                        id="json-input"
                                        placeholder={`{\n  "title": "Your riddle title",\n  "riddle": "Your riddle question",\n  "solution": "Your solution"\n}`}
                                        value={jsonInput}
                                        onChange={(e) =>
                                            setJsonInput(e.target.value)
                                        }
                                        rows={10}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter a valid JSON object with title,
                                        riddle, and solution fields
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
                                onClick={handleSubmitRiddle}
                                disabled={isSubmitting}
                                className="retro-button"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Riddle"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="retro-card">
                <CardHeader>
                    <CardTitle>All Riddles</CardTitle>
                </CardHeader>
                <CardContent>
                    {riddles.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px]">
                                                No
                                            </TableHead>
                                            <TableHead>Riddle</TableHead>
                                            <TableHead className="w-[150px]">
                                                Status
                                            </TableHead>
                                            <TableHead className="w-[200px] text-right">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {riddles.map((riddle, index) => {
                                            const totalSlides =
                                                riddle.carouselData.slides
                                                    .length;
                                            const savedSlides =
                                                getSavedSlidesCount(riddle);

                                            return (
                                                <TableRow key={riddle._id}>
                                                    <TableCell className="font-medium">
                                                        {(currentPage - 1) *
                                                            10 +
                                                            index +
                                                            1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="font-semibold">
                                                                {riddle.title}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                <strong>
                                                                    Riddle:
                                                                </strong>{" "}
                                                                {truncateText(
                                                                    riddle.riddle,
                                                                    80
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                <strong>
                                                                    Solution:
                                                                </strong>{" "}
                                                                {truncateText(
                                                                    riddle.solution,
                                                                    60
                                                                )}
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
                                                                    href={`/template/${riddle._id}`}
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Detail
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                            >
                                                                <Link
                                                                    href={`/template-video/${riddle._id}?format=save`}
                                                                >
                                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                                    Video
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Link
                                                                    href={`/template/${riddle._id}?format=save`}
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
                                                                            riddle._id
                                                                        }
                                                                    >
                                                                        {deletingId ===
                                                                        riddle._id ? (
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
                                                                            riddle
                                                                            <span className="font-semibold">
                                                                                {" "}
                                                                                "
                                                                                {
                                                                                    riddle.title
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
                                                                                handleDeleteRiddle(
                                                                                    riddle._id
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
                                {riddles.map((riddle, index) => {
                                    const totalSlides =
                                        riddle.carouselData.slides.length;
                                    const savedSlides =
                                        getSavedSlidesCount(riddle);

                                    return (
                                        <Card
                                            key={riddle._id}
                                            className="overflow-hidden"
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
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
                                                            <Badge variant="secondary">
                                                                {totalSlides}{" "}
                                                                slides
                                                            </Badge>
                                                        </div>
                                                        <CardTitle className="text-lg break-words">
                                                            {riddle.title}
                                                        </CardTitle>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <strong className="text-muted-foreground">
                                                            Riddle:
                                                        </strong>
                                                        <p className="mt-1 break-words">
                                                            {truncateText(
                                                                riddle.riddle,
                                                                100
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-muted-foreground">
                                                            Solution:
                                                        </strong>
                                                        <p className="mt-1 break-words">
                                                            {truncateText(
                                                                riddle.solution,
                                                                80
                                                            )}
                                                        </p>
                                                    </div>
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
                                                                href={`/template/${riddle._id}`}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Detail
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/template-video/${riddle._id}?format=save`}
                                                            >
                                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                                Video
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/template/${riddle._id}?format=save`}
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
                                                                    riddle._id
                                                                }
                                                            >
                                                                {deletingId ===
                                                                riddle._id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                        Riddle
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
                                                                    riddle
                                                                    <span className="font-semibold">
                                                                        {" "}
                                                                        "
                                                                        {
                                                                            riddle.title
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
                                                                        handleDeleteRiddle(
                                                                            riddle._id
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
                                            onClick={() => {
                                                const newPage = Math.max(
                                                    1,
                                                    currentPage - 1
                                                );
                                                router.push(
                                                    `/riddles?page=${newPage}`
                                                );
                                            }}
                                            disabled={
                                                currentPage === 1 || loading
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const newPage = Math.min(
                                                    totalPages,
                                                    currentPage + 1
                                                );
                                                router.push(
                                                    `/riddles?page=${newPage}`
                                                );
                                            }}
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
                                No riddles found.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
