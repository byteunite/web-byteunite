import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema({
    tipe_slide: { type: String, required: true },
    judul_slide: { type: String, required: true },
    sub_judul_slide: { type: String, required: true },
    konten_slide: { type: String, required: true },
    prompt_untuk_image: { type: String },
    saved_image_url: { type: String },
    saved_slide_url: { type: String },
});

const CarouselDataSchema = new mongoose.Schema({
    slides: [SlideSchema],
    caption: { type: String, required: true },
    hashtags: [{ type: String }],
});

const VideoScriptSchema = new mongoose.Schema({
    script: { type: String, required: true },
    estimatedDuration: { type: String, required: true },
    tips: [{ type: String }],
});

const TutorialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: false,
            trim: true,
        },
        keywords: {
            type: [String],
            default: [],
        },
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        estimatedTime: {
            type: String,
            required: false,
        },
        carouselData: {
            type: CarouselDataSchema,
            required: true,
        },
        videoScript: {
            type: VideoScriptSchema,
            required: false, // Optional, akan diisi ketika user generate script
        },
    },
    {
        timestamps: true,
    }
);

const Tutorial =
    mongoose.models.Tutorial || mongoose.model("Tutorial", TutorialSchema);

export default Tutorial;
