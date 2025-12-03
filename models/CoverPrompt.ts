import mongoose, { Schema, Document } from "mongoose";

export interface ICoverPrompt extends Document {
    contentId: string;
    category: string;
    prompt: any; // Flexible structure
    createdAt: Date;
    updatedAt: Date;
}

const CoverPromptSchema = new Schema<ICoverPrompt>(
    {
        contentId: { type: String, required: true, index: true },
        category: { type: String, required: true, index: true },
        prompt: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

const CoverPrompt =
    mongoose.models.CoverPrompt ||
    mongoose.model<ICoverPrompt>("CoverPrompt", CoverPromptSchema);

export default CoverPrompt;
