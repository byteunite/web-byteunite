import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Github, ExternalLink, MapPin, Star, Mail, Linkedin, Twitter, Award, Code, Users, Clock } from "lucide-react"

const programmersData = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    location: "San Francisco, CA",
    bio: "Passionate about creating beautiful, accessible user interfaces with React and modern CSS. I love working on projects that make a real difference in people's lives.",
    fullBio:
      "I'm a senior frontend developer with 5+ years of experience building modern web applications. I specialize in React, TypeScript, and creating pixel-perfect, accessible user interfaces. My expertise includes performance optimization, responsive design, and building scalable component libraries. When I'm not coding, you can find me contributing to open source projects, mentoring junior developers, or speaking at tech conferences.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL", "Jest", "Storybook", "Figma"],
    category: "frontend",
    avatar: "/professional-woman-developer.png",
    github: "sarahchen",
    portfolio: "sarahchen.dev",
    linkedin: "sarahchen-dev",
    twitter: "sarahcodes",
    email: "sarah@example.com",
    rating: 4.9,
    projects: 12,
    joinedDate: "2022-03-15",
    experience: "5+ years",
    availability: "Available for freelance",
    hourlyRate: "$85-120",
    languages: ["English", "Mandarin", "Spanish"],
    certifications: ["AWS Certified Developer", "Google UX Design Certificate"],
    skills: [
      { name: "React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "CSS/SCSS", level: 88 },
      { name: "Node.js", level: 75 },
      { name: "GraphQL", level: 80 },
      { name: "Testing", level: 85 },
    ],
    recentProjects: [
      {
        title: "E-commerce Dashboard",
        description: "Modern admin dashboard for online retailers with real-time analytics and inventory management",
        tech: ["React", "TypeScript", "Tailwind", "Chart.js"],
        link: "https://github.com/sarahchen/ecommerce-dashboard",
        image: "/general-dashboard-interface.png",
        duration: "3 months",
        role: "Lead Frontend Developer",
      },
      {
        title: "Component Library",
        description: "Comprehensive design system with 50+ reusable components used across multiple products",
        tech: ["React", "Storybook", "CSS", "TypeScript"],
        link: "https://github.com/sarahchen/ui-components",
        image: "/component-library.png",
        duration: "6 months",
        role: "UI/UX Developer",
      },
      {
        title: "Mobile Banking App",
        description: "Secure and intuitive mobile banking interface with biometric authentication",
        tech: ["React Native", "Redux", "TypeScript"],
        link: "https://github.com/sarahchen/banking-app",
        image: "/mobile-banking-app.png",
        duration: "4 months",
        role: "Mobile Developer",
      },
    ],
    testimonials: [
      {
        name: "John Smith",
        role: "Product Manager",
        company: "TechCorp",
        text: "Sarah delivered exceptional work on our dashboard project. Her attention to detail and technical expertise made the difference.",
        rating: 5,
      },
      {
        name: "Maria Garcia",
        role: "CTO",
        company: "StartupXYZ",
        text: "Working with Sarah was a pleasure. She's not just a great developer but also brings valuable UX insights to the table.",
        rating: 5,
      },
    ],
  },
]

interface ProgrammerProfilePageProps {
  params: {
    id: string
  }
}

export default function ProgrammerProfilePage({ params }: ProgrammerProfilePageProps) {
  const programmer = programmersData.find((p) => p.id === Number.parseInt(params.id))

  if (!programmer) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background border-b-4 border-primary/20">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
              <div className="relative">
                <img
                  src={programmer.avatar || "/placeholder.svg"}
                  alt={programmer.name}
                  className="w-40 h-40 rounded-2xl border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 border-2 border-black">
                  <Star className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <h1 className="text-5xl font-black mb-3 text-balance">{programmer.name}</h1>
                  <p className="text-3xl text-secondary font-bold mb-2">{programmer.role}</p>
                  <div className="flex items-center justify-center lg:justify-start text-muted-foreground mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{programmer.location}</span>
                  </div>
                </div>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">{programmer.bio}</p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    asChild
                  >
                    <Link href={`mailto:${programmer.email}`}>
                      <Mail className="h-5 w-5 mr-2" />
                      Hire Me
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-transparent"
                    asChild
                  >
                    <Link href={`https://github.com/${programmer.github}`} target="_blank">
                      <Github className="h-5 w-5 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-transparent"
                    asChild
                  >
                    <Link href={`https://${programmer.portfolio}`} target="_blank">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Portfolio
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-2xl font-black flex items-center">
                  <Users className="h-6 w-6 mr-3 text-primary" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed text-lg">{programmer.fullBio}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-2xl font-black flex items-center">
                  <Code className="h-6 w-6 mr-3 text-primary" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programmer.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-2xl font-black">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {programmer.stack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="text-base py-2 px-4 font-semibold border-2 border-black"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-2xl font-black">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                {programmer.recentProjects.map((project, index) => (
                  <div
                    key={index}
                    className="border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-lg border-2 border-black"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-black text-xl">{project.title}</h4>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={project.link} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-sm border-2 border-black">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {project.duration}
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            {project.role}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < programmer.recentProjects.length - 1 && <Separator className="mt-8" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-2xl font-black">Client Testimonials</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {programmer.testimonials.map((testimonial, index) => (
                  <div key={index} className="border-2 border-black rounded-lg p-6 bg-muted/30">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-primary fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic leading-relaxed">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-xl font-black">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-primary fill-current" />
                    <span className="font-bold">{programmer.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Projects</span>
                  <span className="font-bold">{programmer.projects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-bold">{programmer.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hourly Rate</span>
                  <span className="font-bold text-primary">{programmer.hourlyRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-bold">
                    {new Date(programmer.joinedDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-xl font-black">Availability</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Badge
                  variant="secondary"
                  className="w-full justify-center py-3 text-base font-semibold border-2 border-black"
                >
                  {programmer.availability}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-xl font-black">Languages</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {programmer.languages.map((language) => (
                    <Badge
                      key={language}
                      variant="outline"
                      className="w-full justify-center py-2 border-2 border-black"
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-xl font-black flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {programmer.certifications.map((cert) => (
                    <div key={cert} className="flex items-center p-3 border-2 border-black rounded-lg bg-muted/30">
                      <Award className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-xl font-black">Connect</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  asChild
                >
                  <Link href={`https://linkedin.com/in/${programmer.linkedin}`} target="_blank">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  asChild
                >
                  <Link href={`https://twitter.com/${programmer.twitter}`} target="_blank">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  asChild
                >
                  <Link href={`mailto:${programmer.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
