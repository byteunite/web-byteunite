"use client";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { BlogArticle } from "@/lib/blog-utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogPostPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "riddles";
    const [post, setPost] = useState<BlogArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        fetch(`/api/blog/${params.id}?category=${category}`, {
            next: { revalidate: 60 },
        })
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

    const nextSlide = () => {
        setCurrentSlide((prev) =>
            prev === post.slides.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? post.slides.length - 1 : prev - 1
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <section className="py-4 md:py-8 px-3 md:px-4">
                <div className="container mx-auto max-w-4xl bg-white md:p-8 p-4 rounded-lg shadow">
                    <a
                        href="/blog"
                        className="text-primary mb-3 md:mb-4 inline-block text-sm md:text-base hover:underline"
                    >
                        ← Back to Blog
                    </a>
                    <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                        {post.excerpt}
                    </p>
                    {(post.coverImage || post.images[0]) && (
                        <img
                            src={post.coverImage || post.images[0]}
                            alt={post.title}
                            className="w-full object-cover rounded-lg mb-8 hidden"
                        />
                    )}
                    <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                        <MarkdownRenderer content={post.content} />
                    </div>
                    {post.images.length > 1 && (
                        <div className="mt-6 md:mt-8">
                            <h3 className="font-heading text-xl sm:text-2xl md:text-3xl mb-3 md:mb-4">
                                Visual Gallery
                            </h3>
                            {/* Mobile Slider */}
                            <div className="relative md:hidden">
                                <div className="overflow-hidden rounded-lg">
                                    <div
                                        className="flex transition-transform duration-300 ease-in-out"
                                        style={{
                                            transform: `translateX(-${
                                                currentSlide * 100
                                            }%)`,
                                        }}
                                    >
                                        {post.slides.map((image, index) => (
                                            <div
                                                key={index}
                                                className="min-w-full"
                                            >
                                                <img
                                                    src={
                                                        image.saved_slide_url ||
                                                        image.saved_image_url
                                                    }
                                                    alt={`Slide ${index + 1}`}
                                                    className="w-full h-auto object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Navigation Buttons */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                                    aria-label="Previous slide"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                                    aria-label="Next slide"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                {/* Dots Indicator */}
                                <div className="flex justify-center gap-2 mt-3">
                                    {post.slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentSlide(index)
                                            }
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                index === currentSlide
                                                    ? "bg-primary w-6"
                                                    : "bg-gray-300"
                                            }`}
                                            aria-label={`Go to slide ${
                                                index + 1
                                            }`}
                                        />
                                    ))}
                                </div>
                                {/* Slide Counter */}
                                <p className="text-center text-sm text-muted-foreground mt-2">
                                    {currentSlide + 1} / {post.slides.length}
                                </p>
                            </div>
                            {/* Desktop Grid */}
                            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {post.slides.map((image, index) => (
                                    <img
                                        key={index}
                                        src={
                                            image.saved_slide_url ||
                                            image.saved_image_url
                                        }
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-6 md:mt-8 p-4 md:p-6 bg-muted rounded-lg">
                        <h4 className="font-heading text-base sm:text-lg md:text-xl mb-2">
                            View Original Template
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 md:mb-4">
                            See this content as interactive slides
                        </p>
                        <a
                            href={`/template/${post.sourceId}?data=${post.sourceCategory}`}
                            className="text-primary font-semibold text-sm md:text-base hover:underline"
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
