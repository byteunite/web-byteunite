"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useState } from "react"
import { Search, Users, Calendar, ArrowLeft, ExternalLink, Eye, Heart } from "lucide-react"
import { notFound } from "next/navigation"

// Mock data for category details
const categoryData = {
  frontend: {
    id: "frontend",
    title: "Frontend Development",
    description: "Build beautiful, interactive user interfaces with modern frameworks and technologies.",
    longDescription: `Frontend development focuses on creating the user-facing part of web applications. Frontend developers work with HTML, CSS, and JavaScript to build responsive, interactive, and visually appealing interfaces. Modern frontend development involves frameworks like React, Vue.js, and Angular, along with tools for styling, state management, and build optimization.

Key areas include responsive design, performance optimization, accessibility, and user experience design. Frontend developers collaborate closely with designers and backend developers to create seamless digital experiences.`,
    programmers: [
      {
        id: 1,
        name: "Sarah Chen",
        title: "Senior Frontend Engineer",
        company: "TechCorp",
        avatar: "/professional-woman-developer.png",
        skills: ["React", "TypeScript", "Tailwind CSS"],
        experience: "8+ years",
      },
      {
        id: 6,
        name: "James Wilson",
        title: "Frontend Developer",
        company: "StartupXYZ",
        avatar: "/professional-british-man-developer.jpg",
        skills: ["Vue.js", "JavaScript", "SCSS"],
        experience: "5+ years",
      },
    ],
    projects: [
      {
        id: 1,
        title: "E-commerce Dashboard",
        description: "Modern admin dashboard for online retailers with real-time analytics.",
        author: "Sarah Chen",
        stack: ["React", "TypeScript", "Tailwind CSS"],
        likes: 124,
        views: 2340,
        image: "/ecommerce-dashboard-screenshot.jpg",
      },
      {
        id: 5,
        title: "Component Library",
        description: "Reusable UI component library with Storybook documentation.",
        author: "James Wilson",
        stack: ["Vue.js", "Storybook", "Jest"],
        likes: 178,
        views: 2670,
        image: "/component-library-screenshot.jpg",
      },
    ],
    events: [
      {
        id: 1,
        title: "React 19 Deep Dive Workshop",
        date: "2024-12-15",
        time: "14:00",
        organizer: "Sarah Chen",
        attendees: 32,
        maxAttendees: 50,
        price: "Free",
      },
      {
        id: 6,
        title: "JavaScript Testing Masterclass",
        date: "2025-01-05",
        time: "13:00",
        organizer: "James Wilson",
        attendees: 28,
        maxAttendees: 40,
        price: "$49",
      },
    ],
    technologies: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "Tailwind CSS", "Next.js", "Nuxt.js"],
    resources: [
      { title: "React Documentation", url: "https://react.dev", type: "Official Docs" },
      { title: "Frontend Masters", url: "https://frontendmasters.com", type: "Learning Platform" },
      { title: "CSS-Tricks", url: "https://css-tricks.com", type: "Blog" },
    ],
  },
  // Add other categories as needed...
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const category = categoryData[params.category as keyof typeof categoryData]

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild>
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>
      </div>

      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">{category.title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{category.description}</p>

            {/* Stats */}
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{category.programmers.length}+</div>
                <div className="text-sm text-muted-foreground">Programmers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{category.projects.length}+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{category.events.length}+</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="programmers">Programmers</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-gray max-w-none">
                        <div className="whitespace-pre-line text-muted-foreground">{category.longDescription}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Popular Technologies */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Technologies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.technologies.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Get Started</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full" asChild>
                        <Link href="/register">Join Community</Link>
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/programmers?category=${category.id}`}>Find Programmers</Link>
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/events?category=${category.id}`}>Browse Events</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Programmers Tab */}
            <TabsContent value="programmers" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search programmers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.programmers.map((programmer) => (
                  <Card key={programmer.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={programmer.avatar || "/placeholder.svg?height=60&width=60"}
                          alt={programmer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            <Link href={`/programmers/${programmer.id}`} className="text-primary hover:underline">
                              {programmer.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">{programmer.title}</p>
                          <p className="text-sm text-muted-foreground">{programmer.company}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {programmer.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{programmer.experience}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" asChild>
                  <Link href={`/programmers?category=${category.id}`}>View All {category.title} Programmers</Link>
                </Button>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img
                        src={project.image || "/placeholder.svg?height=200&width=400"}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription>by {project.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{project.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" asChild>
                  <Link href={`/portfolio?category=${category.id}`}>View All {category.title} Projects</Link>
                </Button>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="space-y-4">
                {category.events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            <Link href={`/events/${event.id}`} className="text-primary hover:underline">
                              {event.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">by {event.organizer}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {event.attendees}/{event.maxAttendees}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-primary">{event.price}</div>
                          <Button size="sm" asChild>
                            <Link href={`/events/${event.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" asChild>
                  <Link href={`/events?category=${category.id}`}>View All {category.title} Events</Link>
                </Button>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.resources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={resource.url} target="_blank">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Resource
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
