"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Code, Database, Smartphone, Globe, Cloud, Brain } from "lucide-react"

const categories = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Build beautiful, interactive user interfaces with modern frameworks and technologies.",
    icon: Globe,
    color: "bg-blue-500",
    programmers: 156,
    projects: 89,
    events: 12,
    technologies: ["React", "Vue.js", "Angular", "TypeScript", "Tailwind CSS", "Next.js"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&crop=center",
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Create robust server-side applications, APIs, and database architectures.",
    icon: Database,
    color: "bg-green-500",
    programmers: 134,
    projects: 76,
    events: 8,
    technologies: ["Node.js", "Python", "Java", "Go", "PostgreSQL", "MongoDB"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&crop=center",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description: "Develop native and cross-platform mobile applications for iOS and Android.",
    icon: Smartphone,
    color: "bg-purple-500",
    programmers: 98,
    projects: 54,
    events: 6,
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin", "Ionic"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&crop=center",
  },
  {
    id: "fullstack",
    title: "Full Stack Development",
    description: "Master both frontend and backend technologies to build complete applications.",
    icon: Code,
    color: "bg-orange-500",
    programmers: 87,
    projects: 43,
    events: 9,
    technologies: ["MERN", "MEAN", "Django", "Rails", "Laravel", "Spring Boot"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&crop=center",
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    description: "Streamline development workflows with automation, deployment, and cloud infrastructure.",
    icon: Cloud,
    color: "bg-cyan-500",
    programmers: 72,
    projects: 38,
    events: 7,
    technologies: ["Docker", "Kubernetes", "AWS", "Azure", "Jenkins", "Terraform"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&crop=center",
  },
  {
    id: "data",
    title: "Data Science & AI",
    description: "Analyze data, build machine learning models, and create intelligent applications.",
    icon: Brain,
    color: "bg-pink-500",
    programmers: 64,
    projects: 29,
    events: 5,
    technologies: ["Python", "R", "TensorFlow", "PyTorch", "Pandas", "Jupyter"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center",
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Programming Categories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore different areas of programming and connect with developers who share your interests and expertise.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.id} className="pt-0 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={category.image || `/placeholder.svg?height=200&width=400&query=${category.title} banner`}
                      alt={category.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div
                      className={`absolute top-4 left-4 w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{category.programmers}</div>
                        <div className="text-xs text-muted-foreground">Programmers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{category.projects}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{category.events}</div>
                        <div className="text-xs text-muted-foreground">Events</div>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Popular Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.technologies.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {category.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full" asChild>
                      <Link href={`/categories/${category.id}`}>Explore {category.title}</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find Your Specialty?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our community and help us expand into new programming areas and technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Join Community</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Suggest Category</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
