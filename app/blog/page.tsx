"use client";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { BlogArticle } from "@/lib/blog-utils";

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/blog?limit=100")
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setBlogPosts(result.data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

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

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="font-heading text-6xl mb-6">
                        Developer Blog
                    </h1>
                    <p className="text-xl mb-8">
                        Total: {blogPosts.length} articles
                    </p>
                </div>
            </section>
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {blogPosts.map((post) => (
                            <div
                                key={post.id}
                                className="border rounded p-4 bg-white"
                            >
                                {post.coverImage && (
                                    <img
                                        src={post.coverImage || post.images[0]}
                                        alt={post.title}
                                        className="w-full object-cover rounded mb-4"
                                    />
                                )}

                                <h3 className="font-bold text-xl mb-2">
                                    {post.title}
                                </h3>
                                <div
                                    className="text-sm mb-4"
                                    dangerouslySetInnerHTML={{
                                        __html: post.excerpt || "",
                                    }}
                                />
                                <a
                                    href={`/blog/${post.id}?category=${post.sourceCategory}`}
                                    className="text-primary"
                                >
                                    Read More
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
