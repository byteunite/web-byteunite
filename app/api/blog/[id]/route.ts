import { NextResponse } from "next/server";
import { fetchBlogArticle } from "@/lib/blog-utils";

/**
 * GET /api/blog/[id]
 * Fetch a single blog article by ID
 * Query params:
 * - category: source category (riddles, sites, topics, tutorials)
 */
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || "riddles";

        const article = await fetchBlogArticle(id, category);

        if (!article) {
            return NextResponse.json(
                { error: "Article not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: article,
        });
    } catch (error) {
        console.error("GET Blog Article by ID Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
