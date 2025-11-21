import { NextResponse } from "next/server";
import { fetchAllBlogArticles } from "@/lib/blog-utils";

/**
 * GET /api/blog
 * Fetch all blog articles from various categories
 * Query params:
 * - page: page number (default: 1)
 * - limit: items per page (default: 10)
 * - category: filter by category (riddles, sites, topics, tutorials)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category") || undefined;

        const { articles, total } = await fetchAllBlogArticles({
            page,
            limit,
            category,
        });

        return NextResponse.json({
            success: true,
            data: articles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET Blog Articles Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
