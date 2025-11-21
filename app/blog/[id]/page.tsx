"use client";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { BlogArticle } from "@/lib/blog-utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function BlogPostPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "riddles";
    const [post, setPost] = useState<BlogArticle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/blog/${params.id}?category=${category}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    console.log("Fetched post:", result.data);
                    setPost(result.data);
                }
                setLoading(false);
            })
            .catch(() => {
                setPost(null);
                setLoading(false);
            });
    }, [params.id, category]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <p>Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-4xl bg-white md:p-8 p-4 rounded-lg shadow">
                    <a href="/blog" className="text-primary mb-4 inline-block">
                        ← Back to Blog
                    </a>
                    <h1 className="font-heading text-4xl md:text-6xl mb-6">
                        {post.title}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        {post.excerpt}
                    </p>
                    {(post.coverImage || post.images[0]) && (
                        <img
                            src={post.coverImage || post.images[0]}
                            alt={post.title}
                            className="w-full object-cover rounded-lg mb-8 hidden"
                        />
                    )}
                    <div className="prose max-w-none">
                        <MarkdownRenderer content={post.content} />
                    </div>
                    {post.images.length > 1 && (
                        <div className="mt-8">
                            <h3 className="font-heading text-2xl mb-4">
                                Visual Gallery
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {post.slides.map((image, index) => (
                                    <img
                                        key={index}
                                        src={
                                            image.saved_slide_url ||
                                            image.saved_image_url
                                        }
                                        alt={`Slide ${index + 1}`}
                                        className="w-full object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-8 p-6 bg-muted rounded-lg">
                        <h4 className="font-heading text-lg mb-2">
                            View Original Template
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            See this content as interactive slides
                        </p>
                        <a
                            href={`/template/${post.sourceId}?data=${post.sourceCategory}`}
                            className="text-primary font-semibold"
                        >
                            View Slides →
                        </a>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
