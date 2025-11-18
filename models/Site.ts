import mongoose, { Schema, Document } from "mongoose";

// Interface untuk Slide
export interface ISlide {
    tipe_slide: string;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
    prompt_untuk_image?: string; // Optional karena WARNING_ANSWER tidak memerlukan image
    saved_image_url?: string; // URL gambar yang disimpan user (generated dari AI)
    saved_slide_url?: string; // URL screenshot slide lengkap yang disimpan user
}

// Interface untuk Carousel Data (response dari AI)
export interface ICarouselData {
    slides: ISlide[];
    caption: string;
    hashtags: string[];
}

// Interface untuk Video Script Data
export interface IVideoScript {
    script: string;
    estimatedDuration: string;
    tips: string[];
}

// Interface untuk Site Document
export interface ISite extends Document {
    title: string;
    description: string;
    link: string;
    category: string;
    thumbnails: string[];
    isFree: boolean;
    carouselData: ICarouselData;
    videoScript?: IVideoScript; // Optional, script untuk video TikTok/Reels/Shorts
    createdAt: Date;
    updatedAt: Date;
}

// Schema untuk Slide
const SlideSchema = new Schema<ISlide>(
    {
        tipe_slide: {
            type: String,
            required: true,
        },
        judul_slide: {
            type: String,
            required: true,
        },
        sub_judul_slide: {
            type: String,
            required: true,
        },
        konten_slide: {
            type: String,
            required: true,
        },
        prompt_untuk_image: {
            type: String,
            required: false, // Optional karena WARNING_ANSWER tidak memerlukan image
        },
        saved_image_url: {
            type: String,
            required: false, // Optional, URL gambar yang disimpan user (generated dari AI)
        },
        saved_slide_url: {
            type: String,
            required: false, // Optional, URL screenshot slide lengkap yang disimpan user
        },
    },
    { _id: false }
);

// Schema untuk Carousel Data
const CarouselDataSchema = new Schema<ICarouselData>(
    {
        slides: {
            type: [SlideSchema],
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        hashtags: {
            type: [String],
            required: true,
        },
    },
    { _id: false }
);

// Schema untuk Video Script
const VideoScriptSchema = new Schema<IVideoScript>(
    {
        script: {
            type: String,
            required: true,
        },
        estimatedDuration: {
            type: String,
            required: true,
        },
        tips: {
            type: [String],
            required: true,
        },
    },
    { _id: false }
);

// Schema untuk Site
const SiteSchema = new Schema<ISite>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        link: {
            type: String,
            required: [true, "Link is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        thumbnails: {
            type: [String],
            required: false,
            default: [],
        },
        isFree: {
            type: Boolean,
            required: [true, "isFree status is required"],
            default: false,
        },
        carouselData: {
            type: CarouselDataSchema,
            required: [true, "Carousel data is required"],
        },
        videoScript: {
            type: VideoScriptSchema,
            required: false, // Optional, akan diisi ketika user generate script
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Prevent model recompilation in development (Next.js hot reload)
const Site = mongoose.models.Site || mongoose.model<ISite>("Site", SiteSchema);

export default Site;
