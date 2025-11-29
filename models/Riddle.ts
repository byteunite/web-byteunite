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

// Interface untuk Video Slide
export interface IVideoSlide {
    tipe_slide:
        | "VIDEO_COVER"
        | "VIDEO_POINT"
        | "VIDEO_QUESTION"
        | "VIDEO_ANSWER"
        | "VIDEO_LIST"
        | "VIDEO_QUOTE"
        | "VIDEO_TRANSITION"
        | "VIDEO_CLOSING";
    judul_slide: string;
    sub_judul_slide?: string;
    konten_slide?: string;
    list_items?: string[];
    background_color?: string;
    text_color?: string;
    prompt_untuk_image?: string;
    saved_image_url?: string;
    saved_slide_url?: string; // URL untuk screenshot slide yang sudah disimpan
}

// Interface untuk Carousel Data (response dari AI)
export interface ICarouselData {
    slides: ISlide[];
    caption: string;
    hashtags: string[];
}

// Interface untuk Video Prompt
export interface IVideoPrompt {
    slideNumber: number;
    duration: string;
    prompt: string;
    visualStyle: string;
    cameraMovement: string;
    mood: string;
}

// Interface untuk Video Script Data (Single Part)
export interface IVideoScriptSinglePart {
    parts: 1;
    reason: string;
    script: string;
    estimatedDuration: string;
    keyPoints: string[];
    tips: string[];
    videoPrompts: IVideoPrompt[];
}

// Interface untuk Video Script Data (Multi Part)
export interface IVideoScriptMultiPart {
    parts: 2;
    reason: string;
    part1: {
        script: string;
        estimatedDuration: string;
        keyPoints: string[];
        cliffhanger: string;
        videoPrompts: IVideoPrompt[];
    };
    part2: {
        script: string;
        estimatedDuration: string;
        keyPoints: string[];
        connection: string;
        videoPrompts: IVideoPrompt[];
    };
    tips: string[];
}

// Union type untuk Video Script
export type IVideoScript =
    | IVideoScriptSinglePart
    | IVideoScriptMultiPart
    | {
          // Legacy format for backward compatibility
          script: string;
          estimatedDuration: string;
          tips: string[];
      };

// Interface untuk Riddle Document
export interface IRiddle extends Document {
    title: string;
    riddle: string;
    solution: string;
    carouselData: ICarouselData;
    videoScript?: IVideoScript; // Optional, script untuk video TikTok/Reels/Shorts
    videoSlides?: IVideoSlide[]; // Optional, slides untuk video format (TikTok/Reels/Shorts)
    videoSlidesUpdatedAt?: Date; // Timestamp ketika video slides terakhir di-update
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
            required: false,
        },
        saved_image_url: {
            type: String,
            required: false,
        },
        saved_slide_url: {
            type: String,
            required: false,
        },
    },
    { _id: false }
);

// Schema untuk Video Slide
const VideoSlideSchema = new Schema<IVideoSlide>(
    {
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
        judul_slide: {
            type: String,
            required: true,
        },
        sub_judul_slide: {
            type: String,
            required: false,
        },
        konten_slide: {
            type: String,
            required: false,
        },
        list_items: {
            type: [String],
            required: false,
        },
        background_color: {
            type: String,
            required: false,
        },
        text_color: {
            type: String,
            required: false,
        },
        prompt_untuk_image: {
            type: String,
            required: false,
        },
        saved_image_url: {
            type: String,
            required: false,
        },
        saved_slide_url: {
            type: String,
            required: false,
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

// Schema untuk Video Prompt
const VideoPromptSchema = new Schema<IVideoPrompt>(
    {
        slideNumber: {
            type: Number,
            required: false,
        },
        duration: {
            type: String,
            required: false,
        },
        prompt: {
            type: String,
            required: false,
        },
        visualStyle: {
            type: String,
            required: false,
        },
        cameraMovement: {
            type: String,
            required: false,
        },
        mood: {
            type: String,
            required: false,
        },
    },
    { _id: false, strict: false }
);

// Schema untuk Part dalam Multi-Part Video Script
const VideoScriptPartSchema = new Schema(
    {
        script: {
            type: String,
            required: false,
        },
        estimatedDuration: {
            type: String,
            required: false,
        },
        keyPoints: {
            type: [String],
            required: false,
        },
        cliffhanger: {
            type: String,
            required: false,
        },
        connection: {
            type: String,
            required: false,
        },
        videoPrompts: {
            type: Schema.Types.Mixed,
            required: false,
        },
    },
    { _id: false, strict: false }
);

// Schema untuk Video Script (flexible untuk support multiple formats)
// Using Mixed type for maximum flexibility
const VideoScriptSchema = new Schema(
    {
        parts: Schema.Types.Mixed,
        reason: Schema.Types.Mixed,
        tips: Schema.Types.Mixed,
        script: Schema.Types.Mixed,
        estimatedDuration: Schema.Types.Mixed,
        keyPoints: Schema.Types.Mixed,
        videoPrompts: Schema.Types.Mixed,
        part1: Schema.Types.Mixed,
        part2: Schema.Types.Mixed,
    },
    { _id: false, strict: false }
);

// Schema untuk Riddle
const RiddleSchema = new Schema<IRiddle>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        riddle: {
            type: String,
            required: [true, "Riddle is required"],
        },
        solution: {
            type: String,
            required: [true, "Solution is required"],
        },
        carouselData: {
            type: CarouselDataSchema,
            required: [true, "Carousel data is required"],
        },
        videoScript: {
            type: VideoScriptSchema,
            required: false, // Optional, akan diisi ketika user generate script
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
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Prevent model recompilation in development (Next.js hot reload)
const Riddle =
    mongoose.models.Riddle || mongoose.model<IRiddle>("Riddle", RiddleSchema);

export default Riddle;
