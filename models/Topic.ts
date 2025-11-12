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

const TopicSchema = new mongoose.Schema(
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
        carouselData: {
            type: CarouselDataSchema,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);

export default Topic;
