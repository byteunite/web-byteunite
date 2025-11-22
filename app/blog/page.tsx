"use client";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { BlogArticle } from "@/lib/blog-utils";

type CategoryFilter = "all" | "riddles" | "sites" | "topics" | "tutorials";

interface CategoryOption {
    value: CategoryFilter;
    label: string;
    icon: string;
}

const categories: CategoryOption[] = [
    { value: "all", label: "All Posts", icon: "📚" },
    { value: "riddles", label: "Riddles", icon: "🧩" },
    { value: "sites", label: "Web Dev", icon: "🌐" },
    { value: "topics", label: "Topics", icon: "💡" },
    { value: "tutorials", label: "Tutorials", icon: "📖" },
];

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState<BlogArticle[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

    useEffect(() => {
        fetch("/api/blog?limit=100")
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setBlogPosts(result.data);
                    setFilteredPosts(result.data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (activeCategory === "all") {
            setFilteredPosts(blogPosts);
        } else {
            const filtered = blogPosts.filter(
                (post) => post.sourceCategory === activeCategory
            );
            setFilteredPosts(filtered);
        }
    }, [activeCategory, blogPosts]);

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
            <section className="pt-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="font-heading text-6xl mb-6">Byte Blog</h1>
                    <p className="text-xl mb-8">
                        Showing {filteredPosts.length} of {blogPosts.length}{" "}
                        articles
                    </p>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() =>
                                    setActiveCategory(category.value)
                                }
                                className={`
                                    px-6 py-2.5 rounded-full font-medium text-sm
                                    transition-all duration-200 ease-in-out
                                    flex items-center gap-2 shadow-sm
                                    ${
                                        activeCategory === category.value
                                            ? "bg-orange-500 text-white scale-105 shadow-md"
                                            : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200"
                                    }
                                `}
                            >
                                <span>{category.icon}</span>
                                <span>{category.label}</span>
                                <span
                                    className={`
                                        ml-1 px-2 py-0.5 rounded-full text-xs
                                        ${
                                            activeCategory === category.value
                                                ? "bg-orange-600 text-white"
                                                : "bg-gray-100 text-gray-600"
                                        }
                                    `}
                                >
                                    {category.value === "all"
                                        ? blogPosts.length
                                        : blogPosts.filter(
                                              (post) =>
                                                  post.sourceCategory ===
                                                  category.value
                                          ).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No articles found in this category
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {filteredPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="border rounded bg-white flex flex-col border-gray-200 hover:shadow-lg transition-shadow duration-200"
                                >
                                    {post.coverImage && (
                                        <img
                                            src={
                                                post.coverImage ||
                                                post.images[0]
                                            }
                                            alt={post.title}
                                            className="w-full object-cover rounded mb-4"
                                        />
                                    )}

                                    <div className="p-4 flex flex-col flex-1">
                                        {/* Category Badge */}
                                        <div className="mb-2">
                                            <span className="inline-block px-3 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                                                {
                                                    categories.find(
                                                        (c) =>
                                                            c.value ===
                                                            post.sourceCategory
                                                    )?.icon
                                                }{" "}
                                                {post.category}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-xl mb-2">
                                            {post.title}
                                        </h3>
                                        <div
                                            className="text-sm mb-4 flex-1"
                                            dangerouslySetInnerHTML={{
                                                __html: post.excerpt || "",
                                            }}
                                        />
                                        <a
                                            href={`/blog/${post.id}?category=${post.sourceCategory}`}
                                            className="text-orange-500 hover:underline"
                                        >
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}
