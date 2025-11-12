"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    PlusCircle,
    Loader2,
    Eye,
    Trash2,
    Save,
    CheckCircle2,
    XCircle,
} from "lucide-react";

interface ITopic {
    _id: string;
    title: string;
    description: string;
    category?: string;
    keywords?: string[];
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

interface TopicsResponse {
    success: boolean;
    data: ITopic[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function TopicsPage() {
    const [topics, setTopics] = useState<ITopic[]>([]);
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
        category: "",
        keywords: "",
    });

    // JSON input
    const [jsonInput, setJsonInput] = useState("");

    // Delete state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchTopics = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/topics?page=${page}&limit=10`);

            if (!response.ok) {
                throw new Error("Failed to fetch topics");
            }

            const result: TopicsResponse = await response.json();

            if (result.success) {
                setTopics(result.data);
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
        fetchTopics(currentPage);
    }, [currentPage]);

    const truncateText = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const getSavedSlidesCount = (topic: ITopic) => {
        return topic.carouselData.slides.filter(
            (slide) => slide.saved_slide_url
        ).length;
    };

    const handleSubmitTopic = async () => {
        try {
            setIsSubmitting(true);

            let payload: any;

            if (inputMode === "form") {
                // Validate form inputs
                if (!formData.title || !formData.description) {
                    toast({
                        title: "Error",
                        description: "Please fill in title and description",
                        variant: "destructive",
                    });
                    return;
                }

                // Parse keywords from comma-separated string
                const keywordsArray = formData.keywords
                    ? formData.keywords
                          .split(",")
                          .map((k) => k.trim())
                          .filter((k) => k.length > 0)
                    : [];

                payload = {
                    title: formData.title,
                    description: formData.description,
                    category: formData.category || undefined,
                    keywords:
                        keywordsArray.length > 0 ? keywordsArray : undefined,
                };
            } else {
                // Validate and parse JSON
                try {
                    payload = JSON.parse(jsonInput);
                    if (!payload.title || !payload.description) {
                        throw new Error(
                            "JSON must contain title and description"
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

            // Send POST request to generate-topic endpoint
            const response = await fetch("/api/generate-topic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to generate topic");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Topic created successfully",
                });

                // Reset form
                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    keywords: "",
                });
                setJsonInput("");
                setIsDialogOpen(false);

                // Refresh topics list
                fetchTopics(1);
                setCurrentPage(1);
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to create topic",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        try {
            setDeletingId(topicId);

            const response = await fetch(`/api/topics/${topicId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete topic");
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Topic deleted successfully",
                });

                // Refresh the topics list
                if (topics.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    fetchTopics(currentPage - 1);
                } else {
                    fetchTopics(currentPage);
                }
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete topic",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && topics.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Topics</h1>
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
                    <h1 className="text-3xl font-bold">Topics</h1>
                    <p className="text-muted-foreground mt-1">
                        Total: {total} topics
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="retro-button">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Topic
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Topic</DialogTitle>
                            <DialogDescription>
                                Add a new topic by filling the form or using
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
                                    <Label htmlFor="title">
                                        Title{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter topic title"
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
                                        placeholder="Enter detailed description of the topic"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        placeholder="e.g., Technology, Education, Health"
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
                                    <Label htmlFor="keywords">Keywords</Label>
                                    <Input
                                        id="keywords"
                                        placeholder="Enter keywords separated by commas"
                                        value={formData.keywords}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                keywords: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Separate multiple keywords with commas
                                        (e.g., AI, machine learning, tech)
                                    </p>
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
                                        placeholder={`{\n  "title": "Your topic title",\n  "description": "Detailed description",\n  "category": "Category name (optional)",\n  "keywords": ["keyword1", "keyword2"]\n}`}
                                        value={jsonInput}
                                        onChange={(e) =>
                                            setJsonInput(e.target.value)
                                        }
                                        rows={12}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter a valid JSON object with title and
                                        description (required), category and
                                        keywords (optional)
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
                                onClick={handleSubmitTopic}
                                disabled={isSubmitting}
                                className="retro-button"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Topic"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="retro-card">
                <CardHeader>
                    <CardTitle>All Topics</CardTitle>
                </CardHeader>
                <CardContent>
                    {topics.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[60px]">
                                                No
                                            </TableHead>
                                            <TableHead>Topic</TableHead>
                                            <TableHead className="w-[150px]">
                                                Status
                                            </TableHead>
                                            <TableHead className="w-[200px] text-right">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topics.map((topic, index) => {
                                            const totalSlides =
                                                topic.carouselData.slides
                                                    .length;
                                            const savedSlides =
                                                getSavedSlidesCount(topic);

                                            return (
                                                <TableRow key={topic._id}>
                                                    <TableCell className="font-medium">
                                                        {(currentPage - 1) *
                                                            10 +
                                                            index +
                                                            1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="font-semibold">
                                                                {topic.title}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {truncateText(
                                                                    topic.description,
                                                                    100
                                                                )}
                                                            </div>
                                                            {topic.category && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs mt-1"
                                                                >
                                                                    {
                                                                        topic.category
                                                                    }
                                                                </Badge>
                                                            )}
                                                            {topic.keywords &&
                                                                topic.keywords
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {topic.keywords
                                                                            .slice(
                                                                                0,
                                                                                3
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    keyword,
                                                                                    i
                                                                                ) => (
                                                                                    <Badge
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        variant="secondary"
                                                                                        className="text-xs"
                                                                                    >
                                                                                        {
                                                                                            keyword
                                                                                        }
                                                                                    </Badge>
                                                                                )
                                                                            )}
                                                                        {topic
                                                                            .keywords
                                                                            .length >
                                                                            3 && (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="text-xs"
                                                                            >
                                                                                +
                                                                                {topic
                                                                                    .keywords
                                                                                    .length -
                                                                                    3}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                )}
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
                                                                        }
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
                                                                        }
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-gray-500"
                                                                    >
                                                                        <XCircle className="h-3 w-3 mr-1" />
                                                                        0/
                                                                        {
                                                                            totalSlides
                                                                        }
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
                                                                    href={`/template/${topic._id}?data=topics`}
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
                                                                    href={`/template/${topic._id}?format=save&data=topics`}
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
                                                                        disabled={
                                                                            deletingId ===
                                                                            topic._id
                                                                        }
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        {deletingId ===
                                                                        topic._id ? (
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
                                                                            topic
                                                                            "
                                                                            {
                                                                                topic.title
                                                                            }
                                                                            "
                                                                            and
                                                                            all
                                                                            its
                                                                            data.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDeleteTopic(
                                                                                    topic._id
                                                                                )
                                                                            }
                                                                            className="bg-red-600 hover:bg-red-700"
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
                                {topics.map((topic, index) => {
                                    const totalSlides =
                                        topic.carouselData.slides.length;
                                    const savedSlides =
                                        getSavedSlidesCount(topic);

                                    return (
                                        <Card
                                            key={topic._id}
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
                                                        <CardTitle className="text-lg wrap-break-word">
                                                            {topic.title}
                                                        </CardTitle>
                                                        {topic.category && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs mt-2"
                                                            >
                                                                {topic.category}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <strong className="text-muted-foreground">
                                                            Description:
                                                        </strong>
                                                        <p className="mt-1 wrap-break-word">
                                                            {truncateText(
                                                                topic.description,
                                                                120
                                                            )}
                                                        </p>
                                                    </div>
                                                    {topic.keywords &&
                                                        topic.keywords.length >
                                                            0 && (
                                                            <div>
                                                                <strong className="text-muted-foreground">
                                                                    Keywords:
                                                                </strong>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {topic.keywords
                                                                        .slice(
                                                                            0,
                                                                            5
                                                                        )
                                                                        .map(
                                                                            (
                                                                                keyword,
                                                                                i
                                                                            ) => (
                                                                                <Badge
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    variant="secondary"
                                                                                    className="text-xs"
                                                                                >
                                                                                    {
                                                                                        keyword
                                                                                    }
                                                                                </Badge>
                                                                            )
                                                                        )}
                                                                    {topic
                                                                        .keywords
                                                                        .length >
                                                                        5 && (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            +
                                                                            {topic
                                                                                .keywords
                                                                                .length -
                                                                                5}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
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
                                                                href={`/template/${topic._id}?data=topics`}
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
                                                                href={`/template/${topic._id}?format=save&data=topics`}
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
                                                                disabled={
                                                                    deletingId ===
                                                                    topic._id
                                                                }
                                                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                            >
                                                                {deletingId ===
                                                                topic._id ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        Deleting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                        Topic
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
                                                                    topic "
                                                                    {
                                                                        topic.title
                                                                    }
                                                                    " and all
                                                                    its data.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDeleteTopic(
                                                                            topic._id
                                                                        )
                                                                    }
                                                                    className="bg-red-600 hover:bg-red-700"
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
                                No topics found. Create your first topic!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
