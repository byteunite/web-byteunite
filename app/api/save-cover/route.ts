import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";
import Site from "@/models/Site";
import Topic from "@/models/Topic";
import Tutorial from "@/models/Tutorial";

type Category = "riddles" | "sites" | "topics" | "tutorials";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category, id, imageUrl } = body;

        if (!category || !id || !imageUrl) {
            return NextResponse.json(
                { error: "Missing parameters" },
                { status: 400 }
            );
        }

        const allowed: Category[] = ["riddles", "sites", "topics", "tutorials"];
        if (!allowed.includes(category)) {
            return NextResponse.json(
                { error: "Invalid category" },
                { status: 400 }
            );
        }

        if (typeof imageUrl !== "string") {
            return NextResponse.json(
                { error: "Invalid imageUrl" },
                { status: 400 }
            );
        }

        await dbConnect();

        let doc: any = null;

        switch (category) {
            case "riddles":
                doc = await Riddle.findById(id);
                break;
            case "sites":
                doc = await Site.findById(id);
                break;
            case "topics":
                doc = await Topic.findById(id);
                break;
            case "tutorials":
                doc = await Tutorial.findById(id);
                break;
        }

        if (!doc) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        doc.set("cover_image_url", imageUrl);
        await doc.save();

        return NextResponse.json({ success: true, data: { imageUrl } });
    } catch (err) {
        console.error("Error in save-cover:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
