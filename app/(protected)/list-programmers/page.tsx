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
    Award,
    Briefcase,
    MessageSquare,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ISkill {
    name: string;
    level: number;
}

interface IRecentProject {
    title: string;
    description: string;
    tech: string[];
    link: string;
    image: string;
    duration: string;
    role: string;
}

interface ITestimonial {
    name: string;
    role: string;
    company: string;
    text: string;
    rating: number;
}

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
    linkedin: string;
    email: string;
    slug: string;
    rating: number;
    projects: number;
    experience: string;
    availability: string;
    hourlyRate: string;
    skills: ISkill[];
    certifications: string[];
    recentProjects: IRecentProject[];
    testimonials: ITestimonial[];
    isPublished: boolean;
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
    const [inputMode, setInputMode] = useState<"form" | "json" | "cv">("form");

    // CV Upload state
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [cvParseError, setCvParseError] = useState<string | null>(null);

    // Parsed nested data from CV (skills, projects, testimonials)
    const [parsedNestedData, setParsedNestedData] = useState<{
        skills: ISkill[];
        recentProjects: IRecentProject[];
        testimonials: ITestimonial[];
    }>({
        skills: [],
        recentProjects: [],
        testimonials: [],
    });

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
        linkedin: "",
        email: "",
        rating: "4.5",
        projects: "0",
        joinedDate: new Date().toISOString().split("T")[0],
        experience: "",
        availability: "",
        hourlyRate: "",
        languages: "",
        certifications: "",
        isPublished: false,
    });

    // JSON input
    const [jsonInput, setJsonInput] = useState("");

    // Delete state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Search and filter
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Nested Data Management States
    const [manageDialogOpen, setManageDialogOpen] = useState(false);
    const [manageType, setManageType] = useState<
        "skills" | "certifications" | "projects" | "testimonials" | null
    >(null);
    const [selectedProgrammer, setSelectedProgrammer] =
        useState<IProgrammer | null>(null);

    // Skills state
    const [skillDialogOpen, setSkillDialogOpen] = useState(false);
    const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(
        null
    );
    const [skillForm, setSkillForm] = useState({ name: "", level: "50" });

    // Certifications state
    const [certDialogOpen, setCertDialogOpen] = useState(false);
    const [certForm, setCertForm] = useState("");

    // Recent Projects state
    const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    const [editingProjectIndex, setEditingProjectIndex] = useState<
        number | null
    >(null);
    const [projectForm, setProjectForm] = useState({
        title: "",
        description: "",
        tech: "",
        link: "",
        image: "",
        duration: "",
        role: "",
    });

    // Testimonials state
    const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
    const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<
        number | null
    >(null);
    const [testimonialForm, setTestimonialForm] = useState({
        name: "",
        role: "",
        company: "",
        text: "",
        rating: "5",
    });

    const fetchProgrammers = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                full: "true", // Request full data including nested fields
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
            linkedin: "",
            email: "",
            rating: "4.5",
            projects: "0",
            joinedDate: new Date().toISOString().split("T")[0],
            experience: "",
            availability: "",
            hourlyRate: "",
            languages: "",
            certifications: "",
            isPublished: false,
        });
        setJsonInput("");
        setEditingProgrammer(null);
        setCvFile(null);
        setCvParseError(null);
        setInputMode("form");
        setParsedNestedData({
            skills: [],
            recentProjects: [],
            testimonials: [],
        });
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
                linkedin: programmer.linkedin || "",
                email: programmer.email,
                rating: programmer.rating.toString(),
                projects: programmer.projects.toString(),
                joinedDate: new Date().toISOString().split("T")[0],
                experience: programmer.experience,
                availability: programmer.availability,
                hourlyRate: programmer.hourlyRate,
                languages: "",
                certifications: "",
                isPublished: programmer.isPublished ?? false,
            });

            // Populate nested data for editing
            setParsedNestedData({
                skills: programmer.skills || [],
                recentProjects: programmer.recentProjects || [],
                testimonials: programmer.testimonials || [],
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
                    linkedin: formData.linkedin,
                    email: formData.email,
                    rating: parseFloat(formData.rating) || 4.5,
                    projects: parseInt(formData.projects) || 0,
                    joinedDate: formData.joinedDate,
                    experience: formData.experience,
                    availability: formData.availability,
                    hourlyRate: formData.hourlyRate,
                    languages: languagesArray,
                    certifications: certificationsArray,
                    skills: parsedNestedData.skills,
                    recentProjects: parsedNestedData.recentProjects,
                    testimonials: parsedNestedData.testimonials,
                    isPublished: formData.isPublished,
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

    // Handle CV file selection
    const handleCVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (file.type !== "application/pdf") {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload a PDF file",
                    variant: "destructive",
                });
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast({
                    title: "File Too Large",
                    description: "File size must be less than 5MB",
                    variant: "destructive",
                });
                return;
            }

            setCvFile(file);
            setCvParseError(null);
        }
    };

    // Handle CV parsing
    const handleParseCV = async () => {
        if (!cvFile) {
            toast({
                title: "No File Selected",
                description: "Please select a PDF file first",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsParsing(true);
            setCvParseError(null);

            const formData = new FormData();
            formData.append("file", cvFile);

            const response = await fetch("/api/programmers/parse-cv", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to parse CV");
            }

            if (result.success && result.data) {
                // Populate form with parsed data
                setFormData({
                    name: result.data.name || "",
                    role: result.data.role || "",
                    location: result.data.location || "",
                    bio: result.data.bio || "",
                    fullBio: result.data.fullBio || "",
                    stack: result.data.stack?.join(", ") || "",
                    category: result.data.category || "frontend",
                    avatar: result.data.avatar || "",
                    github: result.data.github || "",
                    portfolio: result.data.portfolio || "",
                    linkedin: result.data.linkedin || "",
                    email: result.data.email || "",
                    rating: result.data.rating?.toString() || "4.5",
                    projects: result.data.projects?.toString() || "0",
                    joinedDate:
                        result.data.joinedDate ||
                        new Date().toISOString().split("T")[0],
                    experience: result.data.experience || "",
                    availability: result.data.availability || "",
                    hourlyRate: result.data.hourlyRate || "",
                    languages: result.data.languages?.join(", ") || "",
                    certifications:
                        result.data.certifications?.join(", ") || "",
                    isPublished: false, // Default to unpublished for new CV uploads
                });

                // Save nested data (skills, recentProjects, testimonials)
                setParsedNestedData({
                    skills: result.data.skills || [],
                    recentProjects: result.data.recentProjects || [],
                    testimonials: result.data.testimonials || [],
                });

                // Also populate JSON input
                setJsonInput(JSON.stringify(result.data, null, 2));

                toast({
                    title: "CV Parsed Successfully!",
                    description:
                        "Data has been extracted. Please review and edit if needed.",
                });

                // Switch to form view to review data
                setInputMode("form");
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to parse CV";
            setCvParseError(errorMessage);
            toast({
                title: "Error Parsing CV",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsParsing(false);
        }
    };

    // Clear CV upload
    const handleClearCV = () => {
        setCvFile(null);
        setCvParseError(null);
        const fileInput = document.getElementById(
            "cv-upload"
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
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

    const handleTogglePublished = async (
        programmerId: string,
        currentStatus: boolean
    ) => {
        try {
            const response = await fetch(`/api/programmers/${programmerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isPublished: !currentStatus }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to update publish status"
                );
            }

            if (result.success) {
                toast({
                    title: "Success!",
                    description: `Programmer ${
                        !currentStatus ? "published" : "unpublished"
                    } successfully`,
                });

                // Refresh the programmers list
                fetchProgrammers(currentPage);
            }
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to update publish status",
                variant: "destructive",
            });
        }
    };

    // ========== NESTED DATA MANAGEMENT FUNCTIONS ==========

    const handleOpenManageDialog = (
        programmer: IProgrammer,
        type: "skills" | "certifications" | "projects" | "testimonials"
    ) => {
        setSelectedProgrammer(programmer);
        setManageType(type);
        setManageDialogOpen(true);
    };

    // Skills Functions
    const handleAddSkill = () => {
        setSkillForm({ name: "", level: "50" });
        setEditingSkillIndex(null);
        setSkillDialogOpen(true);
    };

    const handleEditSkill = (index: number) => {
        if (!selectedProgrammer) return;
        const skill = selectedProgrammer.skills[index];
        setSkillForm({ name: skill.name, level: skill.level.toString() });
        setEditingSkillIndex(index);
        setSkillDialogOpen(true);
    };

    const handleSaveSkill = async () => {
        if (!selectedProgrammer || !skillForm.name) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        try {
            const newSkill = {
                name: skillForm.name,
                level: parseInt(skillForm.level),
            };

            let updatedSkills;
            if (editingSkillIndex !== null) {
                updatedSkills = [...selectedProgrammer.skills];
                updatedSkills[editingSkillIndex] = newSkill;
            } else {
                updatedSkills = [...selectedProgrammer.skills, newSkill];
            }

            const response = await fetch(
                `/api/programmers/${selectedProgrammer._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ skills: updatedSkills }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save skill");
            }

            toast({
                title: "Success!",
                description: `Skill ${
                    editingSkillIndex !== null ? "updated" : "added"
                } successfully`,
            });

            setSkillDialogOpen(false);
            fetchProgrammers(currentPage);

            // Update selected programmer
            const updatedProgrammer = {
                ...selectedProgrammer,
                skills: updatedSkills,
            };
            setSelectedProgrammer(updatedProgrammer);
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error ? err.message : "Failed to save skill",
                variant: "destructive",
            });
        }
    };

    const handleDeleteSkill = async (index: number) => {
        if (!selectedProgrammer) return;

        try {
            const updatedSkills = selectedProgrammer.skills.filter(
                (_, i) => i !== index
            );

            const response = await fetch(
                `/api/programmers/${selectedProgrammer._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ skills: updatedSkills }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete skill");
            }

            toast({
                title: "Success!",
                description: "Skill deleted successfully",
            });

            fetchProgrammers(currentPage);

            const updatedProgrammer = {
                ...selectedProgrammer,
                skills: updatedSkills,
            };
            setSelectedProgrammer(updatedProgrammer);
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete skill",
                variant: "destructive",
            });
        }
    };

    // Certifications Functions
    const handleAddCertification = () => {
        setCertForm("");
        setCertDialogOpen(true);
    };

    const handleSaveCertification = async () => {
        if (!selectedProgrammer || !certForm) {
            toast({
                title: "Error",
                description: "Please enter a certification",
                variant: "destructive",
            });
            return;
        }

        try {
            const updatedCertifications = [
                ...selectedProgrammer.certifications,
                certForm,
            ];

            const response = await fetch(
                `/api/programmers/${selectedProgrammer._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        certifications: updatedCertifications,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save certification");
            }

            toast({
                title: "Success!",
                description: "Certification added successfully",
            });

            setCertDialogOpen(false);
            fetchProgrammers(currentPage);

            const updatedProgrammer = {
                ...selectedProgrammer,
                certifications: updatedCertifications,
            };
            setSelectedProgrammer(updatedProgrammer);
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to save certification",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCertification = async (index: number) => {
        if (!selectedProgrammer) return;

        try {
            const updatedCertifications =
                selectedProgrammer.certifications.filter((_, i) => i !== index);

            const response = await fetch(
                `/api/programmers/${selectedProgrammer._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        certifications: updatedCertifications,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to delete certification"
                );
            }

            toast({
                title: "Success!",
                description: "Certification deleted successfully",
            });

            fetchProgrammers(currentPage);

            const updatedProgrammer = {
                ...selectedProgrammer,
                certifications: updatedCertifications,
            };
            setSelectedProgrammer(updatedProgrammer);
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete certification",
                variant: "destructive",
            });
        }
    };

    // Recent Projects Functions
    const handleAddProject = () => {
        setProjectForm({
            title: "",
            description: "",
            tech: "",
            link: "",
            image: "",
            duration: "",
            role: "",
        });
        setEditingProjectIndex(null);
        setProjectDialogOpen(true);
    };

    const handleEditProject = (index: number) => {
        if (!selectedProgrammer) return;
        const project = selectedProgrammer.recentProjects[index];
        setProjectForm({
            title: project.title,
            description: project.description,
            tech: project.tech.join(", "),
            link: project.link,
            image: project.image,
            duration: project.duration,
            role: project.role,
        });
        setEditingProjectIndex(index);
        setProjectDialogOpen(true);
    };

    const handleSaveProject = async () => {
        if (
            !selectedProgrammer ||
            !projectForm.title ||
            !projectForm.description
        ) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        try {
            const newProject = {
                title: projectForm.title,
                description: projectForm.description,
                tech: projectForm.tech
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t),
                link: projectForm.link,
                image: projectForm.image || "/placeholder.svg",
                duration: projectForm.duration,
                role: projectForm.role,
            };

            let updatedProjects;
            if (editingProjectIndex !== null) {
                updatedProjects = [...selectedProgrammer.recentProjects];
                updatedProjects[editingProjectIndex] = newProject;
            } else {
                updatedProjects = [
                    ...selectedProgrammer.recentProjects,
                    newProject,
                ];
            }

            const response = await fetch(
                `/api/programmers/${selectedProgrammer._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ recentProjects: updatedProjects }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save project");
            }

            toast({
                title: "Success!",
                description: `Project ${
                    editingProjectIndex !== null ? "updated" : "added"
                } successfully`,
            });

            setProjectDialogOpen(false);
            fetchProgrammers(currentPage);

            const updatedProgrammer = {
                ...selectedProgrammer,
                recentProjects: updatedProjects,
            };
            setSelectedProgrammer(updatedProgrammer);
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to save project",
                variant: "destructive",
            });
        }
    };

    const handleDeleteProject = async (index: number) => {
        if (!selectedProgrammer) return;

        try {
            const updatedProjects = selectedProgrammer.recentProjects.filter(
                (_, i) => i !== index
            );

            const response = await fetch(
                `/api/programmers/${selectedProgrammer._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ recentProjects: updatedProjects }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete project");
            }

            toast({
                title: "Success!",
                description: "Project deleted successfully",
            });

            fetchProgrammers(currentPage);

            const updatedProgrammer = {
                ...selectedProgrammer,
                recentProjects: updatedProjects,
            };
            setSelectedProgrammer(updatedProgrammer);
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete project",
                variant: "destructive",
            });
        }
    };

    // Testimonials Functions
    const handleAddTestimonial = () => {
        setTestimonialForm({
            name: "",
            role: "",
            company: "",
            text: "",
            rating: "5",
        });
        setEditingTestimonialIndex(null);
        setTestimonialDialogOpen(true);
    };

    const handleEditTestimonial = (index: number) => {
        if (!selectedProgrammer) return;
        const testimonial = selectedProgrammer.testimonials[index];
        setTestimonialForm({
            name: testimonial.name,
            role: testimonial.role,
            company: testimonial.company,
            text: testimonial.text,
            rating: testimonial.rating.toString(),
        });
        setEditingTestimonialIndex(index);
        setTestimonialDialogOpen(true);
    };

    const handleSaveTestimonial = async () => {
        if (
            !selectedProgrammer ||
            !testimonialForm.name ||
            !testimonialForm.text
        ) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        try {
            const newTestimonial = {
                name: testimonialForm.name,
                role: testimonialForm.role,
                company: testimonialForm.company,
                text: testimonialForm.text,
                rating: parseInt(testimonialForm.rating),
            };

            let updatedTestimonials;
            if (editingTestimonialIndex !== null) {
                updatedTestimonials = [...selectedProgrammer.testimonials];
                updatedTestimonials[editingTestimonialIndex] = newTestimonial;
            } else {
                updatedTestimonials = [
                    ...selectedProgrammer.testimonials,
                    newTestimonial,
                ];
            }

            const response = await fetch(
                `/api/programmers/${selectedProgrammer._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ testimonials: updatedTestimonials }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save testimonial");
            }

            toast({
                title: "Success!",
                description: `Testimonial ${
                    editingTestimonialIndex !== null ? "updated" : "added"
                } successfully`,
            });

            setTestimonialDialogOpen(false);
            fetchProgrammers(currentPage);

            const updatedProgrammer = {
                ...selectedProgrammer,
                testimonials: updatedTestimonials,
            };
            setSelectedProgrammer(updatedProgrammer);
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to save testimonial",
                variant: "destructive",
            });
        }
    };

    const handleDeleteTestimonial = async (index: number) => {
        if (!selectedProgrammer) return;

        try {
            const updatedTestimonials = selectedProgrammer.testimonials.filter(
                (_, i) => i !== index
            );

            const response = await fetch(
                `/api/programmers/${selectedProgrammer._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ testimonials: updatedTestimonials }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete testimonial");
            }

            toast({
                title: "Success!",
                description: "Testimonial deleted successfully",
            });

            fetchProgrammers(currentPage);

            const updatedProgrammer = {
                ...selectedProgrammer,
                testimonials: updatedTestimonials,
            };
            setSelectedProgrammer(updatedProgrammer);
        } catch (err) {
            toast({
                title: "Error",
                description:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete testimonial",
                variant: "destructive",
            });
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
                                setInputMode(value as "form" | "json" | "cv")
                            }
                        >
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="form">
                                    Form Input
                                </TabsTrigger>
                                <TabsTrigger value="json">
                                    JSON Input
                                </TabsTrigger>
                                <TabsTrigger value="cv">Upload CV</TabsTrigger>
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

                                <div className="flex items-center justify-between space-y-2">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="isPublished">
                                            Publish to Public Page
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Make this programmer visible on
                                            /programmers
                                        </p>
                                    </div>
                                    <Switch
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onCheckedChange={(checked) =>
                                            setFormData({
                                                ...formData,
                                                isPublished: checked,
                                            })
                                        }
                                    />
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

                                <div className="grid grid-cols-3 gap-4">
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
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin">
                                            LinkedIn
                                        </Label>
                                        <Input
                                            id="linkedin"
                                            placeholder="username"
                                            value={formData.linkedin}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    linkedin: e.target.value,
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

                                {/* Parsed Nested Data Info */}
                                {(parsedNestedData.skills.length > 0 ||
                                    parsedNestedData.recentProjects.length >
                                        0 ||
                                    parsedNestedData.testimonials.length >
                                        0) && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-sm text-green-900 mb-2">
                                            ✅ Additional Data Extracted from
                                            CV:
                                        </h4>
                                        <div className="space-y-1 text-sm text-green-800">
                                            {parsedNestedData.skills.length >
                                                0 && (
                                                <div>
                                                    •{" "}
                                                    <strong>
                                                        {
                                                            parsedNestedData
                                                                .skills.length
                                                        }
                                                    </strong>{" "}
                                                    Skills
                                                </div>
                                            )}
                                            {parsedNestedData.recentProjects
                                                .length > 0 && (
                                                <div>
                                                    •{" "}
                                                    <strong>
                                                        {
                                                            parsedNestedData
                                                                .recentProjects
                                                                .length
                                                        }
                                                    </strong>{" "}
                                                    Recent Projects
                                                </div>
                                            )}
                                            {parsedNestedData.testimonials
                                                .length > 0 && (
                                                <div>
                                                    •{" "}
                                                    <strong>
                                                        {
                                                            parsedNestedData
                                                                .testimonials
                                                                .length
                                                        }
                                                    </strong>{" "}
                                                    Testimonials
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-green-700 mt-2">
                                            These will be automatically saved
                                            with the programmer.
                                        </p>
                                    </div>
                                )}
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

                            <TabsContent value="cv" className="space-y-4 mt-4">
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <div className="space-y-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg
                                                    className="w-12 h-12 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                                <h3 className="font-semibold text-lg">
                                                    Upload CV PDF
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Upload a PDF resume and let
                                                    AI extract the information
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <input
                                                    id="cv-upload"
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={
                                                        handleCVFileChange
                                                    }
                                                    className="hidden"
                                                />
                                                <label htmlFor="cv-upload">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    "cv-upload"
                                                                )
                                                                ?.click()
                                                        }
                                                        disabled={isParsing}
                                                    >
                                                        Choose PDF File
                                                    </Button>
                                                </label>

                                                {cvFile && (
                                                    <div className="flex items-center justify-center gap-2 mt-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            {cvFile.name} (
                                                            {Math.round(
                                                                cvFile.size /
                                                                    1024
                                                            )}{" "}
                                                            KB)
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={
                                                                handleClearCV
                                                            }
                                                            disabled={isParsing}
                                                        >
                                                            ✕
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                Maximum file size: 5MB
                                            </p>
                                        </div>
                                    </div>

                                    {cvFile && (
                                        <div className="flex justify-center">
                                            <Button
                                                onClick={handleParseCV}
                                                disabled={isParsing}
                                                className="retro-button"
                                            >
                                                {isParsing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Parsing CV with AI...
                                                    </>
                                                ) : (
                                                    <>🤖 Parse CV with AI</>
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {cvParseError && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">
                                                <strong>Error:</strong>{" "}
                                                {cvParseError}
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-sm text-blue-900 mb-2">
                                            How it works:
                                        </h4>
                                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                            <li>Upload a PDF CV/Resume</li>
                                            <li>
                                                AI will extract and parse the
                                                information
                                            </li>
                                            <li>
                                                Review the extracted data in the
                                                Form tab
                                            </li>
                                            <li>
                                                Edit if needed and save the
                                                programmer
                                            </li>
                                        </ol>
                                    </div>
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

            <Card className="retro-card overflow-visible">
                <CardHeader>
                    <CardTitle>All Programmers</CardTitle>
                </CardHeader>
                <CardContent className="overflow-visible">
                    {programmers.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-visible">
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
                                            <TableHead className="w-[100px] text-center">
                                                Status
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
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant={
                                                                programmer.isPublished
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            size="sm"
                                                            onClick={() =>
                                                                handleTogglePublished(
                                                                    programmer._id,
                                                                    programmer.isPublished
                                                                )
                                                            }
                                                        >
                                                            {programmer.isPublished
                                                                ? "Published"
                                                                : "Not Published"}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1 flex-wrap">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/programmers/${programmer.slug}`}
                                                                    target="_blank"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-1" />
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
                                                                <Edit className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>

                                                            {/* Manage Buttons - Direct Access */}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                                onClick={() =>
                                                                    handleOpenManageDialog(
                                                                        programmer,
                                                                        "skills"
                                                                    )
                                                                }
                                                                title="Manage Skills"
                                                            >
                                                                <Award className="h-4 w-4 mr-1" />
                                                                Skills (
                                                                {programmer
                                                                    .skills
                                                                    ?.length ||
                                                                    0}
                                                                )
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                                onClick={() =>
                                                                    handleOpenManageDialog(
                                                                        programmer,
                                                                        "certifications"
                                                                    )
                                                                }
                                                                title="Manage Certifications"
                                                            >
                                                                <Award className="h-4 w-4 mr-1" />
                                                                Certs (
                                                                {programmer
                                                                    .certifications
                                                                    ?.length ||
                                                                    0}
                                                                )
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                                onClick={() =>
                                                                    handleOpenManageDialog(
                                                                        programmer,
                                                                        "projects"
                                                                    )
                                                                }
                                                                title="Manage Projects"
                                                            >
                                                                <Briefcase className="h-4 w-4 mr-1" />
                                                                Projects (
                                                                {programmer
                                                                    .recentProjects
                                                                    ?.length ||
                                                                    0}
                                                                )
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                                onClick={() =>
                                                                    handleOpenManageDialog(
                                                                        programmer,
                                                                        "testimonials"
                                                                    )
                                                                }
                                                                title="Manage Testimonials"
                                                            >
                                                                <MessageSquare className="h-4 w-4 mr-1" />
                                                                Reviews (
                                                                {programmer
                                                                    .testimonials
                                                                    ?.length ||
                                                                    0}
                                                                )
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
                                                            href={`/programmers/${programmer.slug}`}
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

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                                                        onClick={() =>
                                                            handleOpenManageDialog(
                                                                programmer,
                                                                "skills"
                                                            )
                                                        }
                                                    >
                                                        <Award className="h-4 w-4 mr-2" />
                                                        Skills (
                                                        {programmer.skills
                                                            ?.length || 0}
                                                        )
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                                                        onClick={() =>
                                                            handleOpenManageDialog(
                                                                programmer,
                                                                "certifications"
                                                            )
                                                        }
                                                    >
                                                        <Award className="h-4 w-4 mr-2" />
                                                        Certs (
                                                        {programmer
                                                            .certifications
                                                            ?.length || 0}
                                                        )
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                                                        onClick={() =>
                                                            handleOpenManageDialog(
                                                                programmer,
                                                                "projects"
                                                            )
                                                        }
                                                    >
                                                        <Briefcase className="h-4 w-4 mr-2" />
                                                        Projects (
                                                        {programmer
                                                            .recentProjects
                                                            ?.length || 0}
                                                        )
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                                                        onClick={() =>
                                                            handleOpenManageDialog(
                                                                programmer,
                                                                "testimonials"
                                                            )
                                                        }
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Reviews (
                                                        {programmer.testimonials
                                                            ?.length || 0}
                                                        )
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

            {/* Nested Data Management Dialog */}
            <Dialog
                open={manageDialogOpen}
                onOpenChange={(open) => {
                    setManageDialogOpen(open);
                    if (!open) {
                        setSelectedProgrammer(null);
                        setManageType(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Manage{" "}
                            {manageType === "skills"
                                ? "Skills"
                                : manageType === "certifications"
                                ? "Certifications"
                                : manageType === "projects"
                                ? "Recent Projects"
                                : "Testimonials"}{" "}
                            - {selectedProgrammer?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Add, edit, or remove items from this programmer's
                            profile
                        </DialogDescription>
                    </DialogHeader>

                    {/* Skills Management */}
                    {manageType === "skills" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Skills</h3>
                                <Button onClick={handleAddSkill} size="sm">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Skill
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {selectedProgrammer?.skills?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No skills yet
                                    </p>
                                ) : (
                                    selectedProgrammer?.skills?.map(
                                        (skill, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        {skill.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Level: {skill.level}%
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${skill.level}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditSkill(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteSkill(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Certifications Management */}
                    {manageType === "certifications" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">
                                    Certifications
                                </h3>
                                <Button
                                    onClick={handleAddCertification}
                                    size="sm"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Certification
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {selectedProgrammer?.certifications?.length ===
                                0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No certifications yet
                                    </p>
                                ) : (
                                    selectedProgrammer?.certifications?.map(
                                        (cert, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        {cert}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteCertification(
                                                            index
                                                        )
                                                    }
                                                    className="text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recent Projects Management */}
                    {manageType === "projects" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">
                                    Recent Projects
                                </h3>
                                <Button onClick={handleAddProject} size="sm">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Project
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {selectedProgrammer?.recentProjects?.length ===
                                0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No projects yet
                                    </p>
                                ) : (
                                    selectedProgrammer?.recentProjects?.map(
                                        (project, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        {project.title}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {project.description}
                                                    </div>
                                                    <div className="flex gap-2 mt-2 flex-wrap">
                                                        {project.tech.map(
                                                            (tech) => (
                                                                <Badge
                                                                    key={tech}
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {tech}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {project.role} •{" "}
                                                        {project.duration}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditProject(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteProject(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Testimonials Management */}
                    {manageType === "testimonials" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Testimonials</h3>
                                <Button
                                    onClick={handleAddTestimonial}
                                    size="sm"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Testimonial
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {selectedProgrammer?.testimonials?.length ===
                                0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No testimonials yet
                                    </p>
                                ) : (
                                    selectedProgrammer?.testimonials?.map(
                                        (testimonial, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium">
                                                            {testimonial.name}
                                                        </div>
                                                        <div className="flex">
                                                            {Array.from({
                                                                length: testimonial.rating,
                                                            }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className="h-3 w-3 text-yellow-500 fill-current"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {testimonial.role} at{" "}
                                                        {testimonial.company}
                                                    </div>
                                                    <div className="text-sm mt-1">
                                                        "{testimonial.text}"
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditTestimonial(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteTestimonial(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Skill Dialog */}
            <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingSkillIndex !== null
                                ? "Edit Skill"
                                : "Add Skill"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Skill Name *</Label>
                            <Input
                                placeholder="e.g., React, Python, AWS"
                                value={skillForm.name}
                                onChange={(e) =>
                                    setSkillForm({
                                        ...skillForm,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Level (0-100) * - {skillForm.level}%</Label>
                            <Input
                                type="range"
                                min="0"
                                max="100"
                                value={skillForm.level}
                                onChange={(e) =>
                                    setSkillForm({
                                        ...skillForm,
                                        level: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSkillDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveSkill}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Certification Dialog */}
            <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Certification</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Certification Name *</Label>
                            <Input
                                placeholder="e.g., AWS Certified Solutions Architect"
                                value={certForm}
                                onChange={(e) => setCertForm(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCertDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveCertification}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Project Dialog */}
            <Dialog
                open={projectDialogOpen}
                onOpenChange={setProjectDialogOpen}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProjectIndex !== null
                                ? "Edit Project"
                                : "Add Project"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Title *</Label>
                                <Input
                                    placeholder="Project title"
                                    value={projectForm.title}
                                    onChange={(e) =>
                                        setProjectForm({
                                            ...projectForm,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role *</Label>
                                <Input
                                    placeholder="e.g., Lead Developer"
                                    value={projectForm.role}
                                    onChange={(e) =>
                                        setProjectForm({
                                            ...projectForm,
                                            role: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description *</Label>
                            <Textarea
                                placeholder="Project description"
                                value={projectForm.description}
                                onChange={(e) =>
                                    setProjectForm({
                                        ...projectForm,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Technologies (comma-separated) *</Label>
                            <Input
                                placeholder="React, Node.js, MongoDB"
                                value={projectForm.tech}
                                onChange={(e) =>
                                    setProjectForm({
                                        ...projectForm,
                                        tech: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Duration *</Label>
                                <Input
                                    placeholder="e.g., 3 months"
                                    value={projectForm.duration}
                                    onChange={(e) =>
                                        setProjectForm({
                                            ...projectForm,
                                            duration: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Link</Label>
                                <Input
                                    placeholder="https://project-url.com"
                                    value={projectForm.link}
                                    onChange={(e) =>
                                        setProjectForm({
                                            ...projectForm,
                                            link: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                                placeholder="https://image-url.com/image.jpg"
                                value={projectForm.image}
                                onChange={(e) =>
                                    setProjectForm({
                                        ...projectForm,
                                        image: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setProjectDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveProject}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Testimonial Dialog */}
            <Dialog
                open={testimonialDialogOpen}
                onOpenChange={setTestimonialDialogOpen}
            >
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTestimonialIndex !== null
                                ? "Edit Testimonial"
                                : "Add Testimonial"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name *</Label>
                                <Input
                                    placeholder="Client name"
                                    value={testimonialForm.name}
                                    onChange={(e) =>
                                        setTestimonialForm({
                                            ...testimonialForm,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role *</Label>
                                <Input
                                    placeholder="e.g., CEO"
                                    value={testimonialForm.role}
                                    onChange={(e) =>
                                        setTestimonialForm({
                                            ...testimonialForm,
                                            role: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Company *</Label>
                            <Input
                                placeholder="Company name"
                                value={testimonialForm.company}
                                onChange={(e) =>
                                    setTestimonialForm({
                                        ...testimonialForm,
                                        company: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Testimonial Text *</Label>
                            <Textarea
                                placeholder="What they said about you..."
                                value={testimonialForm.text}
                                onChange={(e) =>
                                    setTestimonialForm({
                                        ...testimonialForm,
                                        text: e.target.value,
                                    })
                                }
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Rating (1-5) *</Label>
                            <Select
                                value={testimonialForm.rating}
                                onValueChange={(value) =>
                                    setTestimonialForm({
                                        ...testimonialForm,
                                        rating: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="1">1 Star</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setTestimonialDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTestimonial}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
