import mongoose from "mongoose";
import Programmer from "../models/Programmer";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// Sample programmers data
const programmersData = [
    {
        name: "Sarah Chen",
        role: "Senior Frontend Developer",
        location: "San Francisco, CA",
        bio: "Passionate about creating beautiful, accessible user interfaces with React and modern CSS. I love working on projects that make a real difference in people's lives.",
        fullBio:
            "I'm a senior frontend developer with 5+ years of experience building modern web applications. I specialize in React, TypeScript, and creating pixel-perfect, accessible user interfaces. My expertise includes performance optimization, responsive design, and building scalable component libraries. When I'm not coding, you can find me contributing to open source projects, mentoring junior developers, or speaking at tech conferences.",
        stack: [
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Next.js",
            "GraphQL",
            "Jest",
            "Storybook",
            "Figma",
        ],
        category: "frontend",
        avatar: "/professional-woman-developer.png",
        github: "sarahchen",
        portfolio: "sarahchen.dev",
        linkedin: "sarahchen-dev",
        twitter: "sarahcodes",
        email: "sarah@example.com",
        rating: 4.9,
        projects: 12,
        joinedDate: "2022-03-15",
        experience: "5+ years",
        availability: "Available for freelance",
        hourlyRate: "$85-120",
        languages: ["English", "Mandarin", "Spanish"],
        certifications: [
            "AWS Certified Developer",
            "Google UX Design Certificate",
        ],
        skills: [
            { name: "React", level: 95 },
            { name: "TypeScript", level: 90 },
            { name: "CSS/SCSS", level: 88 },
            { name: "Node.js", level: 75 },
            { name: "GraphQL", level: 80 },
            { name: "Testing", level: 85 },
        ],
        recentProjects: [
            {
                title: "E-commerce Dashboard",
                description:
                    "Modern admin dashboard for online retailers with real-time analytics and inventory management",
                tech: ["React", "TypeScript", "Tailwind", "Chart.js"],
                link: "https://github.com/sarahchen/ecommerce-dashboard",
                image: "/general-dashboard-interface.png",
                duration: "3 months",
                role: "Lead Frontend Developer",
            },
            {
                title: "Component Library",
                description:
                    "Comprehensive design system with 50+ reusable components used across multiple products",
                tech: ["React", "Storybook", "CSS", "TypeScript"],
                link: "https://github.com/sarahchen/ui-components",
                image: "/component-library.png",
                duration: "6 months",
                role: "UI/UX Developer",
            },
            {
                title: "Mobile Banking App",
                description:
                    "Secure and intuitive mobile banking interface with biometric authentication",
                tech: ["React Native", "Redux", "TypeScript"],
                link: "https://github.com/sarahchen/banking-app",
                image: "/mobile-banking-app.png",
                duration: "4 months",
                role: "Mobile Developer",
            },
        ],
        testimonials: [
            {
                name: "John Smith",
                role: "Product Manager",
                company: "TechCorp",
                text: "Sarah delivered exceptional work on our dashboard project. Her attention to detail and technical expertise made the difference.",
                rating: 5,
            },
            {
                name: "Maria Garcia",
                role: "CTO",
                company: "StartupXYZ",
                text: "Working with Sarah was a pleasure. She's not just a great developer but also brings valuable UX insights to the table.",
                rating: 5,
            },
        ],
    },
    {
        name: "Marcus Rodriguez",
        role: "Full Stack Engineer",
        location: "Austin, TX",
        bio: "Building scalable web applications with modern technologies and best practices.",
        fullBio:
            "I'm a full stack engineer with 7+ years of experience in building enterprise-level applications. My expertise spans from frontend frameworks like React and Vue to backend technologies including Node.js, Python, and cloud infrastructure. I'm passionate about clean code, system architecture, and mentoring teams to deliver high-quality software.",
        stack: [
            "Node.js",
            "Python",
            "PostgreSQL",
            "Docker",
            "AWS",
            "React",
            "GraphQL",
        ],
        category: "fullstack",
        avatar: "/professional-man-developer.png",
        github: "marcusdev",
        portfolio: "marcus.codes",
        linkedin: "marcusrodriguez",
        twitter: "marcuscodes",
        email: "marcus@example.com",
        rating: 4.8,
        projects: 18,
        joinedDate: "2021-06-20",
        experience: "7+ years",
        availability: "Open to opportunities",
        hourlyRate: "$95-140",
        languages: ["English", "Spanish"],
        certifications: [
            "AWS Solutions Architect",
            "MongoDB Certified Developer",
        ],
        skills: [
            { name: "Node.js", level: 92 },
            { name: "Python", level: 88 },
            { name: "React", level: 85 },
            { name: "PostgreSQL", level: 90 },
            { name: "Docker", level: 87 },
            { name: "AWS", level: 83 },
        ],
        recentProjects: [
            {
                title: "Social Media Platform",
                description:
                    "Full-featured social platform with real-time messaging and feeds",
                tech: ["React", "Node.js", "MongoDB", "Socket.io", "Redis"],
                link: "https://github.com/marcusdev/social-platform",
                image: "/social-platform-screenshot.jpg",
                duration: "8 months",
                role: "Full Stack Lead",
            },
            {
                title: "E-commerce API",
                description:
                    "RESTful API for multi-vendor marketplace with payment integration",
                tech: ["Node.js", "PostgreSQL", "Stripe", "Redis"],
                link: "https://github.com/marcusdev/ecommerce-api",
                image: "/api-documentation.png",
                duration: "5 months",
                role: "Backend Architect",
            },
        ],
        testimonials: [
            {
                name: "Lisa Anderson",
                role: "Engineering Manager",
                company: "TechStart",
                text: "Marcus consistently delivers high-quality code and has a deep understanding of both frontend and backend systems.",
                rating: 5,
            },
        ],
    },
    {
        name: "Aisha Patel",
        role: "Mobile Developer",
        location: "Toronto, ON",
        bio: "Creating native and cross-platform mobile experiences that users love.",
        fullBio:
            "As a mobile developer with 6+ years of experience, I specialize in building high-performance native iOS and Android applications. I'm proficient in Swift, Kotlin, and React Native, with a strong focus on creating seamless user experiences. My passion lies in pushing the boundaries of mobile technology while maintaining clean, maintainable code.",
        stack: [
            "React Native",
            "Swift",
            "Kotlin",
            "Flutter",
            "Firebase",
            "TypeScript",
        ],
        category: "mobile",
        avatar: "/professional-woman-mobile-developer.jpg",
        github: "aishapatel",
        portfolio: "aisha.app",
        linkedin: "aishapatel-mobile",
        twitter: "aishabuilds",
        email: "aisha@example.com",
        rating: 4.9,
        projects: 15,
        joinedDate: "2021-09-10",
        experience: "6+ years",
        availability: "Available for contract work",
        hourlyRate: "$90-130",
        languages: ["English", "Hindi", "French"],
        certifications: [
            "Google Associate Android Developer",
            "iOS App Development Specialist",
        ],
        skills: [
            { name: "React Native", level: 93 },
            { name: "Swift", level: 88 },
            { name: "Kotlin", level: 85 },
            { name: "Flutter", level: 80 },
            { name: "Firebase", level: 87 },
            { name: "Mobile UX", level: 90 },
        ],
        recentProjects: [
            {
                title: "Fitness Tracking App",
                description:
                    "Cross-platform fitness app with real-time activity tracking and social features",
                tech: ["React Native", "Firebase", "Redux", "TypeScript"],
                link: "https://github.com/aishapatel/fitness-tracker",
                image: "/fitness-app-screenshot.jpg",
                duration: "6 months",
                role: "Lead Mobile Developer",
            },
            {
                title: "Food Delivery iOS App",
                description:
                    "Native iOS app for food delivery with real-time tracking",
                tech: ["Swift", "SwiftUI", "Core Location", "MapKit"],
                link: "https://github.com/aishapatel/food-delivery-ios",
                image: "/food-delivery-app.png",
                duration: "4 months",
                role: "iOS Developer",
            },
        ],
        testimonials: [
            {
                name: "Robert Chen",
                role: "Product Owner",
                company: "FitTech",
                text: "Aisha built an amazing mobile app that exceeded our expectations. Her expertise in React Native is outstanding.",
                rating: 5,
            },
        ],
    },
    {
        name: "David Kim",
        role: "Backend Developer",
        location: "Seattle, WA",
        bio: "Designing robust APIs and distributed systems for high-scale applications.",
        fullBio:
            "I'm a backend developer specializing in building scalable microservices and distributed systems. With 8+ years of experience, I've worked on high-traffic applications serving millions of users. My expertise includes API design, database optimization, message queues, and cloud infrastructure. I'm passionate about performance, reliability, and clean architecture.",
        stack: ["Go", "Kubernetes", "Redis", "MongoDB", "gRPC", "PostgreSQL"],
        category: "backend",
        avatar: "/professional-asian-man-developer.jpg",
        github: "davidkim",
        portfolio: "davidkim.dev",
        linkedin: "davidkim-backend",
        twitter: "davidbuilds",
        email: "david@example.com",
        rating: 4.7,
        projects: 22,
        joinedDate: "2020-04-15",
        experience: "8+ years",
        availability: "Currently employed, open to consulting",
        hourlyRate: "$100-150",
        languages: ["English", "Korean"],
        certifications: [
            "Kubernetes Certified Application Developer",
            "AWS Solutions Architect Professional",
        ],
        skills: [
            { name: "Go", level: 94 },
            { name: "Kubernetes", level: 90 },
            { name: "Redis", level: 88 },
            { name: "MongoDB", level: 85 },
            { name: "PostgreSQL", level: 87 },
            { name: "Microservices", level: 92 },
        ],
        recentProjects: [
            {
                title: "Distributed Cache System",
                description:
                    "High-performance distributed caching layer for e-commerce platform",
                tech: ["Go", "Redis", "Kubernetes", "gRPC"],
                link: "https://github.com/davidkim/distributed-cache",
                image: "/distributed-system.png",
                duration: "7 months",
                role: "Backend Architect",
            },
            {
                title: "API Gateway",
                description:
                    "Microservices gateway handling 10M+ requests per day",
                tech: ["Go", "Docker", "Kubernetes", "Istio"],
                link: "https://github.com/davidkim/api-gateway",
                image: "/api-gateway-screenshot.jpg",
                duration: "5 months",
                role: "Principal Engineer",
            },
        ],
        testimonials: [
            {
                name: "Jennifer Lee",
                role: "CTO",
                company: "CloudScale",
                text: "David's expertise in distributed systems helped us scale our platform to millions of users. Highly recommended!",
                rating: 5,
            },
        ],
    },
    {
        name: "Elena Volkov",
        role: "DevOps Engineer",
        location: "Berlin, Germany",
        bio: "Automating infrastructure and improving developer experience through CI/CD.",
        fullBio:
            "As a DevOps engineer with 7+ years of experience, I specialize in building reliable infrastructure and streamlining deployment pipelines. I'm proficient in Infrastructure as Code, container orchestration, and cloud platforms. My goal is to empower development teams with robust, automated systems that enable rapid, reliable deployments.",
        stack: ["Terraform", "Jenkins", "Docker", "AWS", "Ansible", "Python"],
        category: "devops",
        avatar: "/professional-woman-devops-engineer.jpg",
        github: "elenavolkov",
        portfolio: "elena.cloud",
        linkedin: "elenavolkov-devops",
        twitter: "elenadevops",
        email: "elena@example.com",
        rating: 4.8,
        projects: 9,
        joinedDate: "2021-11-05",
        experience: "7+ years",
        availability: "Available for freelance",
        hourlyRate: "$95-135",
        languages: ["English", "German", "Russian"],
        certifications: [
            "AWS Certified DevOps Engineer",
            "Certified Kubernetes Administrator",
            "HashiCorp Terraform Associate",
        ],
        skills: [
            { name: "Terraform", level: 92 },
            { name: "Kubernetes", level: 89 },
            { name: "Docker", level: 93 },
            { name: "AWS", level: 90 },
            { name: "CI/CD", level: 91 },
            { name: "Python", level: 82 },
        ],
        recentProjects: [
            {
                title: "Infrastructure as Code Platform",
                description:
                    "Terraform modules for multi-cloud infrastructure provisioning",
                tech: ["Terraform", "AWS", "Azure", "Python"],
                link: "https://github.com/elenavolkov/iac-platform",
                image: "/infrastructure-screenshot.jpg",
                duration: "8 months",
                role: "DevOps Lead",
            },
            {
                title: "CI/CD Pipeline",
                description:
                    "Automated deployment pipeline with zero-downtime releases",
                tech: ["Jenkins", "Docker", "Kubernetes", "Helm"],
                link: "https://github.com/elenavolkov/cicd-pipeline",
                image: "/cicd-pipeline-screenshot.jpg",
                duration: "4 months",
                role: "DevOps Engineer",
            },
        ],
        testimonials: [
            {
                name: "Michael Schmidt",
                role: "VP Engineering",
                company: "TechGlobal",
                text: "Elena transformed our deployment process, reducing deployment time by 70%. Her expertise is invaluable.",
                rating: 5,
            },
        ],
    },
    {
        name: "James Wilson",
        role: "Frontend Architect",
        location: "London, UK",
        bio: "Leading frontend teams and establishing scalable architecture patterns.",
        fullBio:
            "I'm a frontend architect with 10+ years of experience building large-scale web applications. I specialize in creating maintainable, performant frontend architectures and leading engineering teams. My expertise includes modern JavaScript frameworks, design systems, and frontend performance optimization. I'm passionate about developer experience and building tools that empower teams.",
        stack: [
            "Vue.js",
            "Nuxt.js",
            "GraphQL",
            "Storybook",
            "Webpack",
            "TypeScript",
        ],
        category: "frontend",
        avatar: "/professional-british-man-developer.jpg",
        github: "jameswilson",
        portfolio: "jameswilson.tech",
        linkedin: "jameswilson-frontend",
        twitter: "jamesbuilds",
        email: "james@example.com",
        rating: 4.9,
        projects: 25,
        joinedDate: "2020-01-10",
        experience: "10+ years",
        availability: "Available for consulting",
        hourlyRate: "$110-160",
        languages: ["English", "French"],
        certifications: [
            "Vue.js Certified Developer",
            "Frontend Masters Expert",
        ],
        skills: [
            { name: "Vue.js", level: 96 },
            { name: "Nuxt.js", level: 94 },
            { name: "GraphQL", level: 89 },
            { name: "TypeScript", level: 91 },
            { name: "Webpack", level: 87 },
            { name: "Architecture", level: 93 },
        ],
        recentProjects: [
            {
                title: "Design System",
                description:
                    "Enterprise design system with 100+ components and comprehensive documentation",
                tech: ["Vue.js", "Storybook", "TypeScript", "Sass"],
                link: "https://github.com/jameswilson/design-system",
                image: "/component-library-screenshot.jpg",
                duration: "12 months",
                role: "Frontend Architect",
            },
            {
                title: "Admin Dashboard Platform",
                description:
                    "Customizable admin platform serving 500+ enterprises",
                tech: ["Nuxt.js", "GraphQL", "Vuex", "TypeScript"],
                link: "https://github.com/jameswilson/admin-platform",
                image: "/ecommerce-dashboard-screenshot.jpg",
                duration: "10 months",
                role: "Technical Lead",
            },
        ],
        testimonials: [
            {
                name: "Sophie Martin",
                role: "Head of Product",
                company: "DesignCo",
                text: "James built our design system from scratch. His architectural decisions have stood the test of time and scale.",
                rating: 5,
            },
            {
                name: "Thomas Brown",
                role: "Engineering Director",
                company: "EnterpriseSoft",
                text: "Working with James elevated our entire frontend practice. His mentorship has been invaluable to our team.",
                rating: 5,
            },
        ],
    },
];

async function seedProgrammers() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI!, {
            dbName: "byteunite",
        });
        console.log("Connected to MongoDB");

        // Clear existing programmers
        console.log("Clearing existing programmers...");
        await Programmer.deleteMany({});
        console.log("Existing programmers cleared");

        // Insert new programmers
        console.log("Inserting new programmers...");
        const result = await Programmer.insertMany(programmersData);
        console.log(`Successfully inserted ${result.length} programmers`);

        console.log("\nSeeded programmers:");
        result.forEach((prog) => {
            console.log(`- ${prog.name} (${prog.role})`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error seeding programmers:", error);
        process.exit(1);
    }
}

seedProgrammers();
