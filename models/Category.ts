import mongoose, { Schema, Document } from "mongoose";

// Interface untuk Programmer dalam Category
export interface IProgrammer {
    name: string;
    title: string;
    company: string;
    avatar: string;
    skills: string[];
    experience: string;
}

// Interface untuk Project dalam Category
export interface IProject {
    title: string;
    description: string;
    author: string;
    stack: string[];
    likes: number;
    views: number;
    image: string;
}

// Interface untuk Event dalam Category
export interface IEvent {
    title: string;
    date: string;
    time: string;
    organizer: string;
    attendees: number;
    maxAttendees: number;
    price: string;
}

// Interface untuk Resource dalam Category
export interface IResource {
    title: string;
    url: string;
    type: string;
}

// Interface untuk Category Document
export interface ICategory extends Document {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    icon: string;
    color: string;
    programmersCount: number;
    projectsCount: number;
    eventsCount: number;
    technologies: string[];
    image: string;
    programmers: IProgrammer[];
    projects: IProject[];
    events: IEvent[];
    resources: IResource[];
    createdAt: Date;
    updatedAt: Date;
}

// Schema untuk Programmer
const ProgrammerSchema = new Schema<IProgrammer>(
    {
        name: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

// Schema untuk Project
const ProjectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        stack: {
            type: [String],
            required: true,
        },
        likes: {
            type: Number,
            required: true,
            default: 0,
        },
        views: {
            type: Number,
            required: true,
            default: 0,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

// Schema untuk Event
const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        organizer: {
            type: String,
            required: true,
        },
        attendees: {
            type: Number,
            required: true,
            default: 0,
        },
        maxAttendees: {
            type: Number,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

// Schema untuk Resource
const ResourceSchema = new Schema<IResource>(
    {
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

// Schema untuk Category
const CategorySchema = new Schema<ICategory>(
    {
        id: {
            type: String,
            required: [true, "Category ID is required"],
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        longDescription: {
            type: String,
            required: [true, "Long description is required"],
        },
        icon: {
            type: String,
            required: [true, "Icon is required"],
        },
        color: {
            type: String,
            required: [true, "Color is required"],
        },
        programmersCount: {
            type: Number,
            required: true,
            default: 0,
        },
        projectsCount: {
            type: Number,
            required: true,
            default: 0,
        },
        eventsCount: {
            type: Number,
            required: true,
            default: 0,
        },
        technologies: {
            type: [String],
            required: true,
            default: [],
        },
        image: {
            type: String,
            required: [true, "Image is required"],
        },
        programmers: {
            type: [ProgrammerSchema],
            default: [],
        },
        projects: {
            type: [ProjectSchema],
            default: [],
        },
        events: {
            type: [EventSchema],
            default: [],
        },
        resources: {
            type: [ResourceSchema],
            default: [],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Prevent model recompilation in development (Next.js hot reload)
const Category =
    mongoose.models.Category ||
    mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
