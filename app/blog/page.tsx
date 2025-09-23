"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"
import { Search, Calendar, Clock, Eye, Heart, ArrowRight } from "lucide-react"

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development: What's Coming in 2025",
    excerpt:
      "Explore the latest trends and technologies that will shape web development in the coming year, from AI integration to new frameworks.",
    content: "Full article content here...",
    author: {
      name: "Sarah Chen",
      avatar: "/professional-woman-developer.png",
      bio: "Senior Frontend Engineer at TechCorp",
    },
    publishedAt: "2024-12-10",
    readTime: "8 min read",
    category: "Web Development",
    tags: ["React", "AI", "Future Tech"],
    image: "/blog-future-web-dev.jpg",
    likes: 234,
    views: 3420,
    featured: true,
  },
  {
    id: 2,
    title: "Building Scalable APIs with Node.js and TypeScript",
    excerpt:
      "Learn best practices for creating robust, maintainable APIs that can handle enterprise-level traffic and complexity.",
    content: "Full article content here...",
    author: {
      name: "Michael Rodriguez",
      avatar: "/professional-man-developer.jpg",
      bio: "Backend Architect at StartupXYZ",
    },
    publishedAt: "2024-12-08",
    readTime: "12 min read",
    category: "Backend Development",
    tags: ["Node.js", "TypeScript", "API Design"],
    image: "/blog-nodejs-api.jpg",
    likes: 189,
    views: 2890,
    featured: false,
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt:
      "A comprehensive guide to understanding the differences between CSS Grid and Flexbox, with practical examples and use cases.",
    content: "Full article content here...",
    author: {
      name: "Emily Johnson",
      avatar: "/professional-woman-designer.jpg",
      bio: "UI/UX Designer & Frontend Developer",
    },
    publishedAt: "2024-12-05",
    readTime: "6 min read",
    category: "CSS & Design",
    tags: ["CSS", "Grid", "Flexbox"],
    image: "/blog-css-grid-flexbox.jpg",
    likes: 156,
    views: 2340,
    featured: false,
  },
  {
    id: 4,
    title: "Getting Started with Machine Learning for Web Developers",
    excerpt:
      "Demystify machine learning concepts and learn how to integrate AI features into your web applications using modern tools.",
    content: "Full article content here...",
    author: {
      name: "David Kim",
      avatar: "/professional-asian-developer.jpg",
      bio: "AI Engineer & Full Stack Developer",
    },
    publishedAt: "2024-12-03",
    readTime: "15 min read",
    category: "AI & Machine Learning",
    tags: ["Machine Learning", "AI", "JavaScript"],
    image: "/blog-ml-web-dev.jpg",
    likes: 298,
    views: 4120,
    featured: true,
  },
  {
    id: 5,
    title: "Database Design Patterns for Modern Applications",
    excerpt:
      "Explore essential database design patterns that will help you build efficient, scalable data architectures for your applications.",
    content: "Full article content here...",
    author: {
      name: "Lisa Wang",
      avatar: "/professional-woman-engineer.jpg",
      bio: "Database Architect & Backend Engineer",
    },
    publishedAt: "2024-12-01",
    readTime: "10 min read",
    category: "Database",
    tags: ["Database", "SQL", "Architecture"],
    image: "/blog-database-patterns.jpg",
    likes: 167,
    views: 2560,
    featured: false,
  },
]

const categories = [
  "All",
  "Web Development",
  "Backend Development",
  "CSS & Design",
  "AI & Machine Learning",
  "Database",
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  const filteredPosts = blogPosts
    .filter(
      (post) =>
        (selectedCategory === "All" || post.category === selectedCategory) &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "oldest":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        case "popular":
          return b.views - a.views
        case "liked":
          return b.likes - a.likes
        default:
          return 0
      }
    })

  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto text-center">
          <h1 className="font-heading text-6xl md:text-8xl mb-6 text-balance">
            Developer <span className="text-primary">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Insights, tutorials, and stories from the world of software development. Learn from experienced developers
            and stay up-to-date with the latest trends.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{blogPosts.length}+</div>
              <div>Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{categories.length - 1}</div>
              <div>Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div>Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="font-heading text-4xl mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="retro-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={post.image || "/placeholder.svg?height=300&width=600&query=blog article"}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span>•</span>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="font-heading text-2xl mb-2">
                      <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-sm">{post.author.name}</div>
                          <div className="text-xs text-muted-foreground">{post.author.bio}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.views}
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

      {/* Search and Filter */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 retro-input"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 retro-input">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 retro-input">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="liked">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-4xl">{selectedCategory === "All" ? "All Articles" : selectedCategory}</h2>
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="retro-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={post.image || "/placeholder.svg?height=200&width=400&query=blog article"}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-card text-card-foreground border border-border">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="font-heading text-xl leading-tight">
                    <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.author.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="text-xs font-medium">{post.author.name}</div>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="font-heading text-2xl mb-4">No articles found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search terms or category filter.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <Card className="retro-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-heading text-3xl">Stay Updated</CardTitle>
              <CardDescription className="text-base">
                Get the latest articles and insights delivered to your inbox weekly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input placeholder="Enter your email" type="email" className="retro-input flex-1" />
                <Button className="retro-button bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">No spam, unsubscribe at any time.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
