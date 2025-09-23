"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, MapPin, Users, Clock, ExternalLink, ArrowLeft, Share2 } from "lucide-react"
import { notFound } from "next/navigation"

// Mock data for event details (in a real app, this would come from an API)
const eventDetails = {
  1: {
    id: 1,
    title: "React 19 Deep Dive Workshop",
    description:
      "Explore the latest features in React 19 including Server Components, Concurrent Features, and the new React Compiler. This comprehensive workshop will take you through hands-on exercises and real-world examples to help you understand and implement these cutting-edge features in your projects.",
    longDescription: `Join us for an intensive 3-hour workshop where we'll dive deep into React 19's revolutionary features. You'll learn about:

• Server Components and their impact on performance
• The new React Compiler and automatic optimization
• Concurrent Features for better user experience
• Migration strategies from older React versions
• Best practices and common pitfalls

This workshop is perfect for React developers who want to stay ahead of the curve and leverage the latest capabilities of the framework. We'll provide hands-on coding exercises, real-world examples, and plenty of time for Q&A.

Prerequisites: Basic knowledge of React and JavaScript. Familiarity with React Hooks is recommended.`,
    organizer: "Sarah Chen",
    organizerId: 1,
    organizerBio:
      "Senior Frontend Engineer at TechCorp with 8+ years of React experience. React core contributor and conference speaker.",
    organizerAvatar: "/professional-woman-developer.png",
    category: "frontend",
    type: "workshop",
    date: "2024-12-15",
    time: "14:00",
    duration: "3 hours",
    location: "Online",
    maxAttendees: 50,
    currentAttendees: 32,
    price: "Free",
    image: "/react-workshop-banner.jpg",
    registrationUrl: "https://eventbrite.com/react-19-workshop",
    featured: true,
    tags: ["React", "JavaScript", "Frontend", "Workshop"],
    agenda: [
      { time: "14:00 - 14:15", topic: "Welcome & Introduction" },
      { time: "14:15 - 15:00", topic: "Server Components Deep Dive" },
      { time: "15:00 - 15:15", topic: "Break" },
      { time: "15:15 - 16:00", topic: "React Compiler Overview" },
      { time: "16:00 - 16:45", topic: "Concurrent Features & Hands-on Lab" },
      { time: "16:45 - 17:00", topic: "Q&A & Wrap-up" },
    ],
    requirements: [
      "Computer with Node.js 18+ installed",
      "Code editor (VS Code recommended)",
      "Basic React knowledge",
      "Stable internet connection",
    ],
  },
}

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const event = eventDetails[Number.parseInt(params.id) as keyof typeof eventDetails]

  if (!event) {
    notFound()
  }

  const spotsRemaining = event.maxAttendees - event.currentAttendees
  const isAlmostFull = spotsRemaining <= 5

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          className="border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          asChild
        >
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Event Header */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative">
                <img
                  src={event.image || "/placeholder.svg?height=400&width=800&query=event banner"}
                  alt={event.title}
                  className="w-full h-64 md:h-80 object-cover rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                />
                {event.featured && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground border-2 border-black">
                    Featured
                  </Badge>
                )}
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground border-2 border-black">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
              </div>

              <div>
                <h1 className="text-4xl font-black mb-4 text-balance">{event.title}</h1>
                <div className="flex items-center space-x-4 text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {event.duration}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-2 border-black">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-lg text-muted-foreground mb-6">{event.description}</p>

                <div className="prose prose-gray max-w-none">
                  <h2 className="text-2xl font-black mb-4">About This Event</h2>
                  <div className="whitespace-pre-line text-muted-foreground">{event.longDescription}</div>
                </div>
              </div>

              {event.agenda && (
                <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="bg-primary/10">
                    <CardTitle className="font-black">Event Agenda</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-3 border-2 border-black rounded-lg bg-muted/30"
                        >
                          <div className="text-sm font-bold text-primary min-w-[100px] bg-primary/20 px-2 py-1 rounded border border-black">
                            {item.time}
                          </div>
                          <div className="text-sm text-muted-foreground font-medium">{item.topic}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {event.requirements && (
                <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="bg-primary/10">
                    <CardTitle className="font-black">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {event.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start p-3 border-2 border-black rounded-lg bg-muted/30">
                          <span className="text-primary mr-3 font-bold">•</span>
                          <span className="text-sm text-muted-foreground font-medium">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-primary/10">
                  <CardTitle className="text-2xl text-primary font-black">{event.price}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.currentAttendees}/{event.maxAttendees} attendees
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {isAlmostFull && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border-2 border-destructive">
                      Only {spotsRemaining} spots remaining!
                    </div>
                  )}
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    asChild
                  >
                    <Link href={event.registrationUrl} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Register Now
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-transparent"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Event
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-primary/10">
                  <CardTitle className="font-black">Event Organizer</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={event.organizerAvatar || "/placeholder.svg?height=60&width=60"}
                      alt={event.organizer}
                      className="w-12 h-12 rounded-full object-cover border-2 border-black"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">
                        <Link href={`/programmers/${event.organizerId}`} className="text-primary hover:underline">
                          {event.organizer}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.organizerBio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-primary/10">
                  <CardTitle className="font-black">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between p-2 border border-black rounded bg-muted/30">
                    <span className="text-sm text-muted-foreground font-medium">Category</span>
                    <Badge variant="outline" className="border-2 border-black">
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-black rounded bg-muted/30">
                    <span className="text-sm text-muted-foreground font-medium">Type</span>
                    <span className="text-sm font-bold">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-black rounded bg-muted/30">
                    <span className="text-sm text-muted-foreground font-medium">Duration</span>
                    <span className="text-sm font-bold">{event.duration}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border border-black rounded bg-muted/30">
                    <span className="text-sm text-muted-foreground font-medium">Location</span>
                    <span className="text-sm font-bold">{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
