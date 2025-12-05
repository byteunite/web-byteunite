import mongoose, { Schema, Document } from "mongoose";

// Interface untuk Skill
export interface ISkill {
    name: string;
    level: number;
}

// Interface untuk Recent Project
export interface IRecentProject {
    title: string;
    description: string;
    tech: string[];
    link: string;
    image: string;
    duration: string;
    role: string;
}

// Interface untuk Testimonial
export interface ITestimonial {
    name: string;
    role: string;
    company: string;
    text: string;
    rating: number;
}

// Interface untuk Programmer Document
export interface IProgrammer extends Document {
    name: string;
    role: string;
    location: string;
    bio: string;
    fullBio: string;
    stack: string[];
    category: string;
    avatar: string;
    github: string;
    portfolio: string;
    linkedin: string;
    twitter: string;
    email: string;
    rating: number;
    projects: number;
    joinedDate: string;
    experience: string;
    availability: string;
    hourlyRate: string;
    languages: string[];
    certifications: string[];
    skills: ISkill[];
    recentProjects: IRecentProject[];
    testimonials: ITestimonial[];
    createdAt: Date;
    updatedAt: Date;
}

// Schema untuk Skill
const SkillSchema = new Schema<ISkill>(
    {
        name: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    { _id: false }
);

// Schema untuk Recent Project
const RecentProjectSchema = new Schema<IRecentProject>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        tech: {
            type: [String],
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

// Schema untuk Testimonial
const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    { _id: false }
);

// Schema untuk Programmer
const ProgrammerSchema = new Schema<IProgrammer>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        bio: {
            type: String,
            required: [true, "Bio is required"],
        },
        fullBio: {
            type: String,
            required: [true, "Full bio is required"],
        },
        stack: {
            type: [String],
            required: true,
            default: [],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "frontend",
                "backend",
                "fullstack",
                "mobile",
                "devops",
                "data",
            ],
        },
        avatar: {
            type: String,
            required: [true, "Avatar is required"],
        },
        github: {
            type: String,
            required: false,
            default: "",
        },
        portfolio: {
            type: String,
            required: false,
            default: "",
        },
        linkedin: {
            type: String,
            required: false,
        },
        twitter: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        rating: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 5,
        },
        projects: {
            type: Number,
            required: true,
            default: 0,
        },
        joinedDate: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        availability: {
            type: String,
            required: true,
        },
        hourlyRate: {
            type: String,
            required: true,
        },
        languages: {
            type: [String],
            default: [],
        },
        certifications: {
            type: [String],
            default: [],
        },
        skills: {
            type: [SkillSchema],
            default: [],
        },
        recentProjects: {
            type: [RecentProjectSchema],
            default: [],
        },
        testimonials: {
            type: [TestimonialSchema],
            default: [],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Prevent model recompilation in development (Next.js hot reload)
const Programmer =
    mongoose.models.Programmer ||
    mongoose.model<IProgrammer>("Programmer", ProgrammerSchema);

export default Programmer;
