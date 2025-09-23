"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, Eye, Heart, Share2, ArrowLeft, User, MessageCircle, Bookmark } from "lucide-react"

// Mock blog data (same as in listing page)
const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development: What's Coming in 2025",
    excerpt:
      "Explore the latest trends and technologies that will shape web development in the coming year, from AI integration to new frameworks.",
    content: `
# The Future of Web Development: What's Coming in 2025

The web development landscape is evolving at an unprecedented pace. As we look ahead to 2025, several key trends and technologies are emerging that will fundamentally change how we build and interact with web applications.

## AI Integration Becomes Mainstream

Artificial Intelligence is no longer a futuristic concept—it's becoming an integral part of modern web development. From AI-powered code completion to intelligent user interfaces that adapt to user behavior, we're seeing a shift towards more intelligent web applications.

### Key AI Developments:
- **AI-Assisted Development**: Tools like GitHub Copilot and ChatGPT are revolutionizing how developers write code
- **Intelligent UX**: Personalized user experiences powered by machine learning
- **Automated Testing**: AI-driven testing tools that can predict and prevent bugs

## The Rise of Edge Computing

Edge computing is bringing computation closer to users, resulting in faster, more responsive web applications. This trend is particularly important for:

- **Real-time Applications**: Gaming, video streaming, and collaborative tools
- **IoT Integration**: Smart devices and sensors connected to web platforms
- **Global Performance**: Reduced latency for users worldwide

## New Framework Innovations

The JavaScript ecosystem continues to evolve with new frameworks and improvements to existing ones:

### React Server Components
React Server Components are changing how we think about server-side rendering and client-side interactivity. This hybrid approach offers:
- Better performance through selective hydration
- Improved SEO capabilities
- Reduced bundle sizes

### Svelte and SvelteKit
Svelte's compile-time optimizations are gaining traction, offering:
- Smaller bundle sizes
- Better runtime performance
- Simplified state management

## WebAssembly (WASM) Expansion

WebAssembly is opening new possibilities for web applications:
- **High-Performance Computing**: Complex calculations in the browser
- **Cross-Platform Development**: Running native applications on the web
- **Language Diversity**: Using languages like Rust, Go, and C++ for web development

## Enhanced Developer Experience

The focus on developer experience continues to grow:

### Better Tooling
- **Vite**: Lightning-fast build tools
- **TypeScript**: Improved type safety and developer productivity
- **Modern DevTools**: Enhanced debugging and profiling capabilities

### Improved Deployment
- **Serverless Functions**: Simplified backend development
- **Edge Deployment**: Global distribution made easy
- **Container Orchestration**: Kubernetes and Docker integration

## Security and Privacy Focus

With increasing concerns about data privacy and security:
- **Zero-Trust Architecture**: Assuming no implicit trust in network security
- **Privacy-First Design**: Building applications with privacy by default
- **Advanced Authentication**: Biometric and multi-factor authentication

## Conclusion

The future of web development is bright and full of exciting possibilities. As developers, staying current with these trends will be crucial for building the next generation of web applications. The key is to embrace change while maintaining focus on user experience and performance.

What trends are you most excited about? Share your thoughts in the comments below!
    `,
    author: {
      name: "Sarah Chen",
      avatar: "/professional-woman-developer.png",
      bio: "Senior Frontend Engineer at TechCorp with 8+ years of experience in React and modern web technologies.",
    },
    publishedAt: "2024-12-10",
    readTime: "8 min read",
    category: "Web Development",
    tags: ["React", "AI", "Future Tech", "WebAssembly", "Edge Computing"],
    image: "/blog-future-web-dev.jpg",
    likes: 234,
    views: 3420,
    featured: true,
  },
  // Add other posts here...
]

// Related articles
const relatedArticles = [
  {
    id: 2,
    title: "Building Scalable APIs with Node.js and TypeScript",
    author: "Michael Rodriguez",
    readTime: "12 min read",
    image: "/blog-nodejs-api.jpg",
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox: When to Use Which",
    author: "Emily Johnson",
    readTime: "6 min read",
    image: "/blog-css-grid-flexbox.jpg",
  },
]

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.id === Number.parseInt(params.id))

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="font-heading text-4xl md:text-6xl mb-6 text-balance">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">{post.excerpt}</p>
          </div>

          {/* Author and Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.avatar || "/placeholder.svg?height=60&width=60"}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">{post.author.bio}</div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views}
              </div>
            </div>
          </div>

          {/* Article Image */}
          <div className="mb-8">
            <img
              src={post.image || "/placeholder.svg?height=400&width=800&query=blog article hero"}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg border-4 border-border"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="retro-card">
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-line leading-relaxed">{post.content}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <div className="mt-8">
                <h3 className="font-heading text-xl mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Article Actions */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="retro-button bg-transparent">
                    <Heart className="h-4 w-4 mr-2" />
                    {post.likes} Likes
                  </Button>
                  <Button variant="outline" className="retro-button bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="retro-button bg-transparent">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="retro-button bg-transparent">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Author Card */}
                <Card className="retro-card">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">About the Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={post.author.avatar || "/placeholder.svg?height=50&width=50"}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{post.author.name}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{post.author.bio}</p>
                    <Button variant="outline" size="sm" className="w-full retro-button bg-transparent">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Table of Contents */}
                <Card className="retro-card">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2 text-sm">
                      <a href="#ai-integration" className="block text-muted-foreground hover:text-primary">
                        AI Integration Becomes Mainstream
                      </a>
                      <a href="#edge-computing" className="block text-muted-foreground hover:text-primary">
                        The Rise of Edge Computing
                      </a>
                      <a href="#frameworks" className="block text-muted-foreground hover:text-primary">
                        New Framework Innovations
                      </a>
                      <a href="#webassembly" className="block text-muted-foreground hover:text-primary">
                        WebAssembly Expansion
                      </a>
                      <a href="#developer-experience" className="block text-muted-foreground hover:text-primary">
                        Enhanced Developer Experience
                      </a>
                      <a href="#security" className="block text-muted-foreground hover:text-primary">
                        Security and Privacy Focus
                      </a>
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-heading text-3xl mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((article) => (
              <Card key={article.id} className="retro-card hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={article.image || "/placeholder.svg?height=200&width=400&query=related blog article"}
                    alt={article.title}
                    className="w-full h-32 object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-lg leading-tight">
                    <Link href={`/blog/${article.id}`} className="hover:text-primary transition-colors">
                      {article.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>by {article.author}</div>
                    <div>{article.readTime}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
