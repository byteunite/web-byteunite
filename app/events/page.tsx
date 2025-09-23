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
import {
    Search,
    Calendar,
    MapPin,
    Users,
    Clock,
    ExternalLink,
} from "lucide-react";

// Mock data for events
const eventsData = [
    {
        id: 1,
        title: "React 19 Deep Dive Workshop",
        description:
            "Explore the latest features in React 19 including Server Components, Concurrent Features, and the new React Compiler.",
        organizer: "Sarah Chen",
        organizerId: 1,
        category: "frontend",
        type: "workshop",
        date: "2024-12-15",
        time: "14:00",
        duration: "3 hours",
        location: "Online",
        maxAttendees: 50,
        currentAttendees: 32,
        price: "Free",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&auto=format",
        registrationUrl: "https://eventbrite.com/react-19-workshop",
        featured: true,
        tags: ["React", "JavaScript", "Frontend", "Workshop"],
    },
    {
        id: 2,
        title: "Node.js Performance Optimization",
        description:
            "Learn advanced techniques for optimizing Node.js applications, including memory management, clustering, and profiling.",
        organizer: "Marcus Rodriguez",
        organizerId: 2,
        category: "backend",
        type: "webinar",
        date: "2024-12-18",
        time: "18:00",
        duration: "2 hours",
        location: "Online",
        maxAttendees: 100,
        currentAttendees: 78,
        price: "$25",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&auto=format",
        registrationUrl: "https://zoom.us/webinar/nodejs-performance",
        featured: false,
        tags: ["Node.js", "Performance", "Backend", "Optimization"],
    },
    {
        id: 3,
        title: "Mobile App Development Bootcamp",
        description:
            "5-day intensive bootcamp covering React Native, Flutter, and native iOS/Android development fundamentals.",
        organizer: "Aisha Patel",
        organizerId: 3,
        category: "mobile",
        type: "bootcamp",
        date: "2024-12-20",
        time: "09:00",
        duration: "5 days",
        location: "San Francisco, CA",
        maxAttendees: 25,
        currentAttendees: 18,
        price: "$299",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop&auto=format",
        registrationUrl: "https://bootcamp.mobildev.com/register",
        featured: true,
        tags: ["React Native", "Flutter", "Mobile", "Bootcamp"],
    },
    {
        id: 4,
        title: "DevOps & Cloud Architecture Meetup",
        description:
            "Monthly meetup discussing latest trends in DevOps, cloud architecture, and infrastructure automation.",
        organizer: "Elena Volkov",
        organizerId: 5,
        category: "backend",
        type: "meetup",
        date: "2024-12-22",
        time: "19:00",
        duration: "2 hours",
        location: "New York, NY",
        maxAttendees: 80,
        currentAttendees: 45,
        price: "Free",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&auto=format",
        registrationUrl: "https://meetup.com/devops-nyc/events/123456",
        featured: false,
        tags: ["DevOps", "Cloud", "AWS", "Kubernetes"],
    },
    {
        id: 5,
        title: "AI & Machine Learning Conference",
        description:
            "Two-day conference featuring talks on AI, machine learning, and their applications in web development.",
        organizer: "David Kim",
        organizerId: 4,
        category: "fullstack",
        type: "conference",
        date: "2024-12-28",
        time: "09:00",
        duration: "2 days",
        location: "Austin, TX",
        maxAttendees: 200,
        currentAttendees: 156,
        price: "$149",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&auto=format",
        registrationUrl: "https://aiconf2024.com/register",
        featured: true,
        tags: ["AI", "Machine Learning", "Python", "Conference"],
    },
    {
        id: 6,
        title: "JavaScript Testing Masterclass",
        description:
            "Comprehensive workshop covering unit testing, integration testing, and E2E testing with modern JavaScript frameworks.",
        organizer: "James Wilson",
        organizerId: 6,
        category: "frontend",
        type: "workshop",
        date: "2025-01-05",
        time: "13:00",
        duration: "4 hours",
        location: "Online",
        maxAttendees: 40,
        currentAttendees: 28,
        price: "$49",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format",
        registrationUrl: "https://testing-masterclass.dev/register",
        featured: false,
        tags: ["Testing", "Jest", "Cypress", "JavaScript"],
    },
];

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("all");
    const [sortBy, setSortBy] = useState("date");

    // Get unique locations and types
    const allLocations = Array.from(
        new Set(eventsData.map((event) => event.location))
    ).sort();
    const allTypes = Array.from(
        new Set(eventsData.map((event) => event.type))
    ).sort();

    // Filter and sort events
    const filteredEvents = eventsData
        .filter((event) => {
            const matchesSearch =
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                event.organizer
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                event.tags.some((tag) =>
                    tag.toLowerCase().includes(searchTerm.toLowerCase())
                );

            const matchesCategory =
                selectedCategory === "all" ||
                event.category === selectedCategory;
            const matchesType =
                selectedType === "all" || event.type === selectedType;
            const matchesLocation =
                selectedLocation === "all" ||
                event.location === selectedLocation;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesType &&
                matchesLocation
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return (
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    );
                case "popularity":
                    return b.currentAttendees - a.currentAttendees;
                case "price":
                    const priceA =
                        a.price === "Free"
                            ? 0
                            : Number.parseInt(a.price.replace("$", ""));
                    const priceB =
                        b.price === "Free"
                            ? 0
                            : Number.parseInt(b.price.replace("$", ""));
                    return priceA - priceB;
                default:
                    return 0;
            }
        });

    const featuredEvents = eventsData.filter((event) => event.featured);
    const upcomingEvents = eventsData
        .filter((event) => new Date(event.date) > new Date())
        .slice(0, 3);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            {/* Header */}
            <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold mb-4">
                            Developer Events
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Join workshops, conferences, and meetups to level up
                            your programming skills and connect with fellow
                            developers.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search events, organizers, or topics..."
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
                                    <SelectItem value="fullstack">
                                        Full Stack
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={selectedType}
                                onValueChange={setSelectedType}
                            >
                                <SelectTrigger className="w-full lg:w-48">
                                    <SelectValue placeholder="Event Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Types
                                    </SelectItem>
                                    {allTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={selectedLocation}
                                onValueChange={setSelectedLocation}
                            >
                                <SelectTrigger className="w-full lg:w-48">
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Locations
                                    </SelectItem>
                                    {allLocations.map((location) => (
                                        <SelectItem
                                            key={location}
                                            value={location}
                                        >
                                            {location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full lg:w-48">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="popularity">
                                        Popularity
                                    </SelectItem>
                                    <SelectItem value="price">Price</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results count */}
                        <div className="text-center text-muted-foreground mb-8">
                            Showing {filteredEvents.length} event
                            {filteredEvents.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Events */}
            {searchTerm === "" &&
                selectedCategory === "all" &&
                selectedType === "all" &&
                selectedLocation === "all" && (
                    <section className="py-16 px-4 bg-muted/30">
                        <div className="container mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-12">
                                Featured Events
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredEvents.map((event) => (
                                    <Card
                                        key={event.id}
                                        className="pt-0 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    >
                                        <div className="relative">
                                            <img
                                                src={
                                                    event.image ||
                                                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&auto=format"
                                                }
                                                alt={event.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                                Featured
                                            </Badge>
                                            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                                                {event.type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    event.type.slice(1)}
                                            </Badge>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-xl">
                                                {event.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                by{" "}
                                                <Link
                                                    href={`/programmers/${event.organizerId}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {event.organizer}
                                                </Link>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {event.description}
                                            </p>

                                            {/* Event Details */}
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {new Date(
                                                        event.date
                                                    ).toLocaleDateString()}{" "}
                                                    at {event.time}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {event.duration}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {event.currentAttendees}/
                                                    {event.maxAttendees}{" "}
                                                    attendees
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {event.tags
                                                    .slice(0, 3)
                                                    .map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                {event.tags.length > 3 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +{event.tags.length - 3}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Price and Registration */}
                                            <div className="flex items-center justify-between">
                                                <div className="text-lg font-semibold text-primary">
                                                    {event.price}
                                                </div>
                                                <Button size="sm" asChild>
                                                    <Link
                                                        href={
                                                            event.registrationUrl
                                                        }
                                                        target="_blank"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        Register
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

            {/* All Events */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {searchTerm ||
                        selectedCategory !== "all" ||
                        selectedType !== "all" ||
                        selectedLocation !== "all"
                            ? "Search Results"
                            : "All Events"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Card
                                key={event.id}
                                className="pt-0 hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            event.image ||
                                            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&auto=format"
                                        }
                                        alt={event.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    {event.featured && (
                                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                            Featured
                                        </Badge>
                                    )}
                                    <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                                        {event.type.charAt(0).toUpperCase() +
                                            event.type.slice(1)}
                                    </Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        {event.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        by{" "}
                                        <Link
                                            href={`/programmers/${event.organizerId}`}
                                            className="text-primary hover:underline"
                                        >
                                            {event.organizer}
                                        </Link>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {event.description}
                                    </p>

                                    {/* Event Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {new Date(
                                                event.date
                                            ).toLocaleDateString()}{" "}
                                            at {event.time}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {event.duration}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {event.currentAttendees}/
                                            {event.maxAttendees} attendees
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.slice(0, 3).map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                        {event.tags.length > 3 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                +{event.tags.length - 3}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Price and Registration */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-semibold text-primary">
                                            {event.price}
                                        </div>
                                        <Button size="sm" asChild>
                                            <Link
                                                href={event.registrationUrl}
                                                target="_blank"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Register
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* No results */}
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-semibold mb-4">
                                No events found
                            </h3>
                            <p className="text-muted-foreground mb-8">
                                Try adjusting your search criteria or filters.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("all");
                                    setSelectedType("all");
                                    setSelectedLocation("all");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Upcoming Events Sidebar */}
            {searchTerm === "" &&
                selectedCategory === "all" &&
                selectedType === "all" &&
                selectedLocation === "all" && (
                    <section className="py-16 px-4 bg-muted/30">
                        <div className="container mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-12">
                                Coming Up Next
                            </h2>
                            <div className="max-w-4xl mx-auto space-y-6">
                                {upcomingEvents.map((event) => (
                                    <Card
                                        key={event.id}
                                        className="hover:shadow-lg transition-all duration-300"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <img
                                                    src={
                                                        event.image ||
                                                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=120&fit=crop&auto=format"
                                                    }
                                                    alt={event.title}
                                                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-xl font-semibold">
                                                                {event.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                by{" "}
                                                                <Link
                                                                    href={`/programmers/${event.organizerId}`}
                                                                    className="text-primary hover:underline"
                                                                >
                                                                    {
                                                                        event.organizer
                                                                    }
                                                                </Link>
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline">
                                                            {event.type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                event.type.slice(
                                                                    1
                                                                )}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {new Date(
                                                                event.date
                                                            ).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1" />
                                                            {event.location}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Users className="h-4 w-4 mr-1" />
                                                            {
                                                                event.currentAttendees
                                                            }
                                                            /
                                                            {event.maxAttendees}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-lg font-semibold text-primary">
                                                            {event.price}
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    event.registrationUrl
                                                                }
                                                                target="_blank"
                                                            >
                                                                Register Now
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

            {/* Call to Action */}
            <section className="py-16 px-4">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Host Your Own Event
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Share your knowledge and connect with the developer
                        community by organizing your own event.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/register">Join Community</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/login">Create Event</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
