import { Slide } from "@/app/(template-post)/template/[id]/slide-components/types";

/**
 * Interface untuk Blog Article yang di-generate dari slide data
 */
export interface BlogArticle {
    id: string;
    title: string;
    excerpt: string;
    content: string; // Markdown formatted content
    author: {
        name: string;
        avatar: string;
        bio: string;
    };
    publishedAt: string;
    readTime: string;
    category: string;
    tags: string[];
    images: string[]; // Array of image URLs from slides
    coverImage?: string; // Main cover image
    likes: number;
    views: number;
    featured: boolean;
    sourceId: string; // Original content ID
    sourceCategory: string; // riddles, sites, topics, tutorials
    slides: Slide[]; // Original slides data
}

/**
 * Menghitung estimasi waktu baca berdasarkan jumlah kata
 */
function calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

/**
 * Generate excerpt dari content (ambil 150-200 karakter pertama)
 */
function generateExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content.replace(/[#*_`\[\]]/g, "").trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
}

/**
 * Mengambil semua image URLs dari slides
 */
function extractImageUrls(slides: Slide[]): string[] {
    const images: string[] = [];
    slides.forEach((slide) => {
        if (slide.saved_image_url) {
            images.push(slide.saved_image_url);
        }
        if (slide.saved_slide_url) {
            images.push(slide.saved_slide_url);
        }
    });
    return images;
}

/**
 * Mapping category ke human-readable name
 */
function getCategoryDisplayName(category: string): string {
    const categoryMap: Record<string, string> = {
        riddles: "Programming Riddles",
        sites: "Web Development",
        topics: "Tech Topics",
        tutorials: "Tutorials",
    };
    return categoryMap[category] || "Technology";
}

/**
 * Generate tags dari category dan slide content
 */
function generateTags(category: string, slides: Slide[]): string[] {
    const baseTags: Record<string, string[]> = {
        riddles: ["Programming", "Logic", "Problem Solving"],
        sites: ["Web Development", "Frontend", "UI/UX"],
        topics: ["Technology", "Learning", "Insights"],
        tutorials: ["Tutorial", "How-to", "Guide"],
    };

    const tags = baseTags[category] || ["Technology"];

    // Tambahkan tags dari judul slides jika relevan
    slides.forEach((slide) => {
        const title = slide.judul_slide.toLowerCase();
        if (title.includes("react")) tags.push("React");
        if (title.includes("javascript")) tags.push("JavaScript");
        if (title.includes("typescript")) tags.push("TypeScript");
        if (title.includes("css")) tags.push("CSS");
        if (title.includes("node")) tags.push("Node.js");
        if (title.includes("api")) tags.push("API");
    });

    // Remove duplicates dan limit to 5 tags
    return [...new Set(tags)].slice(0, 5);
}

/**
 * Convert slides ke markdown article content
 * Struktur article:
 * - Introduction (dari slide pertama)
 * - Body sections (dari slides tengah)
 * - Conclusion (dari slide terakhir)
 */
export function convertSlidesToArticle(
    slides: Slide[],
    category: string
): string {
    let markdown = "";

    slides.forEach((slide, index) => {
        const { tipe_slide, judul_slide, sub_judul_slide, konten_slide } =
            slide;

        // Skip WARNING_ANSWER slides
        if (tipe_slide === "WARNING_ANSWER") return;

        // Add heading based on slide type
        if (index === 0) {
            // First slide - Introduction
            markdown += `# ${judul_slide}\n\n`;
            if (sub_judul_slide) {
                markdown += `**${sub_judul_slide}**\n\n`;
            }
        } else {
            // Other slides - sections
            markdown += `## ${judul_slide}\n\n`;
            if (sub_judul_slide) {
                markdown += `*${sub_judul_slide}*\n\n`;
            }
        }

        // Add content - konten_slide bisa berisi markdown
        if (konten_slide) {
            markdown += `${konten_slide}\n\n`;
        }

        // Add separator between sections (except last slide)
        if (index < slides.length - 1) {
            markdown += `---\n\n`;
        }
    });

    return markdown.trim();
}

/**
 * Generate default author based on category
 */
function getDefaultAuthor(category: string): BlogArticle["author"] {
    const authors: Record<string, BlogArticle["author"]> = {
        riddles: {
            name: "ByteUnite Team",
            avatar: "/author-programmer.png",
            bio: "Expert programmers who love challenging riddles and problem-solving",
        },
        sites: {
            name: "ByteUnite Web Team",
            avatar: "/author-web-dev.png",
            bio: "Frontend developers passionate about modern web technologies",
        },
        topics: {
            name: "ByteUnite Educators",
            avatar: "/author-educator.png",
            bio: "Tech educators dedicated to sharing knowledge and insights",
        },
        tutorials: {
            name: "ByteUnite Tutors",
            avatar: "/author-tutor.png",
            bio: "Experienced tutors creating comprehensive learning materials",
        },
    };

    return (
        authors[category] || {
            name: "ByteUnite Dev",
            avatar: "/author-default.png",
            bio: "Developer community sharing knowledge and experiences",
        }
    );
}

/**
 * Convert data dari API (riddles, sites, topics, tutorials) menjadi BlogArticle
 */
export function convertToBlogArticle(
    data: any,
    category: string
): BlogArticle | null {
    if (!data || !data.carouselData || !data.carouselData.slides) {
        return null;
    }

    const slides: Slide[] = data.carouselData.slides;
    const images = extractImageUrls(slides);
    const content = convertSlidesToArticle(slides, category);
    const title = data.title || slides[0]?.judul_slide || "Untitled Article";

    return {
        id: data._id || data.id,
        title,
        excerpt: generateExcerpt(content),
        content,
        author: getDefaultAuthor(category),
        publishedAt: data.createdAt || new Date().toISOString(),
        readTime: calculateReadTime(content),
        category: getCategoryDisplayName(category),
        tags: generateTags(category, slides),
        images,
        coverImage: slides[0].saved_slide_url || images[0] || undefined,
        likes: Math.floor(Math.random() * 300) + 50, // Random for now
        views: Math.floor(Math.random() * 5000) + 500, // Random for now
        featured: Math.random() > 0.7, // 30% chance of being featured
        sourceId: data._id || data.id,
        sourceCategory: category,
        slides,
    };
}

/**
 * Fetch semua blog articles dari berbagai kategori
 */
export async function fetchAllBlogArticles(options?: {
    page?: number;
    limit?: number;
    category?: string;
}): Promise<{ articles: BlogArticle[]; total: number }> {
    const { page = 1, limit = 10, category } = options || {};

    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // Categories to fetch from
        const categories = category
            ? [category]
            : ["riddles", "sites", "topics", "tutorials"];

        // Fetch semua categories secara paralel menggunakan Promise.all
        const fetchPromises = categories.map((cat) =>
            fetch(`${baseUrl}/api/${cat}?page=1&limit=100`, {
                cache: "no-store",
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return null;
                })
                .then((result) => {
                    if (!result) return [];

                    const items = result.data || [];
                    const articles: BlogArticle[] = [];

                    items.forEach((item: any) => {
                        const article = convertToBlogArticle(item, cat);
                        if (article) {
                            articles.push(article);
                        }
                    });

                    return articles;
                })
                .catch((error) => {
                    console.error(`Error fetching ${cat}:`, error);
                    return [];
                })
        );

        // Tunggu semua fetch selesai secara paralel
        const results = await Promise.all(fetchPromises);

        // Gabungkan semua articles dari berbagai kategori
        const allArticles: BlogArticle[] = results.flat();

        // Sort by date (newest first)
        allArticles.sort(
            (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
        );

        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedArticles = allArticles.slice(start, end);

        return {
            articles: paginatedArticles,
            total: allArticles.length,
        };
    } catch (error) {
        console.error("Error fetching blog articles:", error);
        return { articles: [], total: 0 };
    }
}

/**
 * Fetch single blog article by ID and category
 */
export async function fetchBlogArticle(
    id: string,
    category: string
): Promise<BlogArticle | null> {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/${category}/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const result = await response.json();
        return convertToBlogArticle(result.data, category);
    } catch (error) {
        console.error("Error fetching blog article:", error);
        return null;
    }
}
