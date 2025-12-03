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

const VideoSlideSchema = new mongoose.Schema({
    tipe_slide: {
        type: String,
        enum: [
            "VIDEO_COVER",
            "VIDEO_POINT",
            "VIDEO_QUESTION",
            "VIDEO_ANSWER",
            "VIDEO_LIST",
            "VIDEO_QUOTE",
            "VIDEO_TRANSITION",
            "VIDEO_CLOSING",
        ],
        required: true,
    },
    judul_slide: { type: String, required: true },
    sub_judul_slide: { type: String },
    konten_slide: { type: String },
    list_items: [{ type: String }],
    background_color: { type: String },
    text_color: { type: String },
    prompt_untuk_image: { type: String },
    saved_image_url: { type: String },
    saved_slide_url: { type: String }, // URL untuk screenshot slide yang sudah disimpan
});

const CarouselDataSchema = new mongoose.Schema({
    slides: [SlideSchema],
    caption: { type: String, required: true },
    hashtags: [{ type: String }],
});

const VideoScriptSchema = new mongoose.Schema(
    {
        parts: mongoose.Schema.Types.Mixed,
        reason: mongoose.Schema.Types.Mixed,
        tips: mongoose.Schema.Types.Mixed,
        script: mongoose.Schema.Types.Mixed,
        estimatedDuration: mongoose.Schema.Types.Mixed,
        keyPoints: mongoose.Schema.Types.Mixed,
        videoPrompts: mongoose.Schema.Types.Mixed,
        part1: mongoose.Schema.Types.Mixed,
        part2: mongoose.Schema.Types.Mixed,
    },
    { strict: false }
);

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
        coverPrompt: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
        },
        cover_image_url: {
            type: String,
            required: false,
        },
        videoSlides: {
            type: [VideoSlideSchema],
            required: false, // Optional, akan diisi ketika user generate video slides
        },
        videoSlidesUpdatedAt: {
            type: Date,
            required: false, // Optional, timestamp ketika video slides terakhir di-update
        },
    },
    {
        timestamps: true,
    }
);

const Tutorial =
    mongoose.models.Tutorial || mongoose.model("Tutorial", TutorialSchema);

export default Tutorial;
