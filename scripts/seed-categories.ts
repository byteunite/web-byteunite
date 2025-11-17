import mongoose from "mongoose";
import Category from "../models/Category";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// Sample data based on the original categories
const categoriesData = [
    {
        id: "frontend",
        title: "Frontend Development",
        description:
            "Build beautiful, interactive user interfaces with modern frameworks and technologies.",
        longDescription: `Frontend development focuses on creating the user-facing part of web applications. Frontend developers work with HTML, CSS, and JavaScript to build responsive, interactive, and visually appealing interfaces. Modern frontend development involves frameworks like React, Vue.js, and Angular, along with tools for styling, state management, and build optimization.

Key areas include responsive design, performance optimization, accessibility, and user experience design. Frontend developers collaborate closely with designers and backend developers to create seamless digital experiences.`,
        icon: "Globe",
        color: "bg-blue-500",
        programmersCount: 156,
        projectsCount: 89,
        eventsCount: 12,
        technologies: [
            "React",
            "Vue.js",
            "Angular",
            "TypeScript",
            "Tailwind CSS",
            "Next.js",
        ],
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&crop=center",
        programmers: [
            {
                name: "Sarah Chen",
                title: "Senior Frontend Engineer",
                company: "TechCorp",
                avatar: "/professional-woman-developer.png",
                skills: ["React", "TypeScript", "Tailwind CSS"],
                experience: "8+ years",
            },
            {
                name: "James Wilson",
                title: "Frontend Developer",
                company: "StartupXYZ",
                avatar: "/professional-british-man-developer.jpg",
                skills: ["Vue.js", "JavaScript", "SCSS"],
                experience: "5+ years",
            },
        ],
        projects: [
            {
                title: "E-commerce Dashboard",
                description:
                    "Modern admin dashboard for online retailers with real-time analytics.",
                author: "Sarah Chen",
                stack: ["React", "TypeScript", "Tailwind CSS"],
                likes: 124,
                views: 2340,
                image: "/ecommerce-dashboard-screenshot.jpg",
            },
            {
                title: "Component Library",
                description:
                    "Reusable UI component library with Storybook documentation.",
                author: "James Wilson",
                stack: ["Vue.js", "Storybook", "Jest"],
                likes: 178,
                views: 2670,
                image: "/component-library-screenshot.jpg",
            },
        ],
        events: [
            {
                title: "React 19 Deep Dive Workshop",
                date: "2024-12-15",
                time: "14:00",
                organizer: "Sarah Chen",
                attendees: 32,
                maxAttendees: 50,
                price: "Free",
            },
            {
                title: "JavaScript Testing Masterclass",
                date: "2025-01-05",
                time: "13:00",
                organizer: "James Wilson",
                attendees: 28,
                maxAttendees: 40,
                price: "$49",
            },
        ],
        resources: [
            {
                title: "React Documentation",
                url: "https://react.dev",
                type: "Official Docs",
            },
            {
                title: "Frontend Masters",
                url: "https://frontendmasters.com",
                type: "Learning Platform",
            },
            {
                title: "CSS-Tricks",
                url: "https://css-tricks.com",
                type: "Blog",
            },
        ],
    },
    {
        id: "backend",
        title: "Backend Development",
        description:
            "Create robust server-side applications, APIs, and database architectures.",
        longDescription: `Backend development involves building the server-side logic, databases, and APIs that power web applications. Backend developers work with languages like Node.js, Python, Java, and Go to create scalable, secure, and efficient systems.

Key responsibilities include database design, API development, authentication, security, and server management. Backend developers ensure data integrity, optimize performance, and create the foundation that frontend applications rely on.`,
        icon: "Database",
        color: "bg-green-500",
        programmersCount: 134,
        projectsCount: 76,
        eventsCount: 8,
        technologies: [
            "Node.js",
            "Python",
            "Java",
            "Go",
            "PostgreSQL",
            "MongoDB",
        ],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&crop=center",
        programmers: [
            {
                name: "Michael Rodriguez",
                title: "Backend Architect",
                company: "CloudScale Inc",
                avatar: "/professional-man-developer.png",
                skills: ["Node.js", "PostgreSQL", "Microservices"],
                experience: "10+ years",
            },
            {
                name: "Emily Johnson",
                title: "Backend Developer",
                company: "DataFlow",
                avatar: "/professional-woman-developer-2.png",
                skills: ["Python", "Django", "MongoDB"],
                experience: "6+ years",
            },
        ],
        projects: [
            {
                title: "API Gateway Platform",
                description:
                    "High-performance API gateway handling millions of requests daily.",
                author: "Michael Rodriguez",
                stack: ["Node.js", "Redis", "Docker"],
                likes: 201,
                views: 3450,
                image: "/api-gateway-screenshot.jpg",
            },
            {
                title: "Data Analytics Pipeline",
                description: "Real-time data processing and analytics system.",
                author: "Emily Johnson",
                stack: ["Python", "Apache Kafka", "MongoDB"],
                likes: 167,
                views: 2890,
                image: "/analytics-pipeline-screenshot.jpg",
            },
        ],
        events: [
            {
                title: "Microservices Architecture Workshop",
                date: "2024-12-20",
                time: "15:00",
                organizer: "Michael Rodriguez",
                attendees: 45,
                maxAttendees: 60,
                price: "$79",
            },
            {
                title: "Python for Backend Development",
                date: "2025-01-10",
                time: "14:00",
                organizer: "Emily Johnson",
                attendees: 38,
                maxAttendees: 50,
                price: "Free",
            },
        ],
        resources: [
            {
                title: "Node.js Documentation",
                url: "https://nodejs.org/docs",
                type: "Official Docs",
            },
            {
                title: "Django Documentation",
                url: "https://docs.djangoproject.com",
                type: "Official Docs",
            },
            {
                title: "System Design Primer",
                url: "https://github.com/donnemartin/system-design-primer",
                type: "GitHub Repo",
            },
        ],
    },
    {
        id: "mobile",
        title: "Mobile Development",
        description:
            "Develop native and cross-platform mobile applications for iOS and Android.",
        longDescription: `Mobile development encompasses creating applications for mobile devices using native or cross-platform technologies. Mobile developers build apps for iOS and Android, focusing on user experience, performance, and device-specific features.

Modern mobile development includes frameworks like React Native and Flutter for cross-platform development, as well as native development with Swift/Kotlin. Key considerations include responsive design, offline functionality, push notifications, and platform-specific guidelines.`,
        icon: "Smartphone",
        color: "bg-purple-500",
        programmersCount: 98,
        projectsCount: 54,
        eventsCount: 6,
        technologies: [
            "React Native",
            "Flutter",
            "Swift",
            "Kotlin",
            "Xamarin",
            "Ionic",
        ],
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&crop=center",
        programmers: [
            {
                name: "David Kim",
                title: "Mobile App Developer",
                company: "AppWorks",
                avatar: "/professional-asian-developer.png",
                skills: ["React Native", "TypeScript", "Firebase"],
                experience: "7+ years",
            },
            {
                name: "Lisa Anderson",
                title: "iOS Developer",
                company: "Mobile Solutions",
                avatar: "/professional-woman-developer-3.png",
                skills: ["Swift", "SwiftUI", "Core Data"],
                experience: "9+ years",
            },
        ],
        projects: [
            {
                title: "Fitness Tracking App",
                description:
                    "Cross-platform fitness app with real-time activity tracking.",
                author: "David Kim",
                stack: ["React Native", "Firebase", "Redux"],
                likes: 312,
                views: 5670,
                image: "/fitness-app-screenshot.jpg",
            },
            {
                title: "E-commerce iOS App",
                description: "Native iOS shopping app with AR product preview.",
                author: "Lisa Anderson",
                stack: ["Swift", "ARKit", "Core Data"],
                likes: 289,
                views: 4230,
                image: "/ecommerce-ios-screenshot.jpg",
            },
        ],
        events: [
            {
                title: "React Native Best Practices",
                date: "2024-12-18",
                time: "16:00",
                organizer: "David Kim",
                attendees: 52,
                maxAttendees: 70,
                price: "$59",
            },
            {
                title: "SwiftUI Workshop",
                date: "2025-01-15",
                time: "15:00",
                organizer: "Lisa Anderson",
                attendees: 41,
                maxAttendees: 55,
                price: "$69",
            },
        ],
        resources: [
            {
                title: "React Native Documentation",
                url: "https://reactnative.dev",
                type: "Official Docs",
            },
            {
                title: "Swift Documentation",
                url: "https://swift.org/documentation",
                type: "Official Docs",
            },
            {
                title: "Flutter Documentation",
                url: "https://flutter.dev/docs",
                type: "Official Docs",
            },
        ],
    },
    {
        id: "fullstack",
        title: "Full Stack Development",
        description:
            "Master both frontend and backend technologies to build complete applications.",
        longDescription: `Full stack development combines frontend and backend skills to build complete web applications. Full stack developers are proficient in both client-side and server-side technologies, able to handle everything from database design to user interface.

Popular stacks include MERN (MongoDB, Express, React, Node), MEAN, Django, and others. Full stack developers understand the entire application lifecycle, from planning and design to deployment and maintenance.`,
        icon: "Code",
        color: "bg-orange-500",
        programmersCount: 87,
        projectsCount: 43,
        eventsCount: 9,
        technologies: [
            "MERN",
            "MEAN",
            "Django",
            "Rails",
            "Laravel",
            "Spring Boot",
        ],
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&crop=center",
        programmers: [
            {
                name: "Alex Turner",
                title: "Full Stack Engineer",
                company: "WebDev Pro",
                avatar: "/professional-developer-4.png",
                skills: ["React", "Node.js", "MongoDB"],
                experience: "8+ years",
            },
            {
                name: "Maria Garcia",
                title: "Full Stack Developer",
                company: "TechStack Inc",
                avatar: "/professional-woman-developer-4.png",
                skills: ["Vue.js", "Django", "PostgreSQL"],
                experience: "6+ years",
            },
        ],
        projects: [
            {
                title: "Social Media Platform",
                description:
                    "Full-featured social platform with real-time messaging.",
                author: "Alex Turner",
                stack: ["React", "Node.js", "MongoDB", "Socket.io"],
                likes: 425,
                views: 7890,
                image: "/social-platform-screenshot.jpg",
            },
            {
                title: "Project Management Tool",
                description:
                    "Collaborative project management with Kanban boards.",
                author: "Maria Garcia",
                stack: ["Vue.js", "Django", "PostgreSQL", "Redis"],
                likes: 356,
                views: 6120,
                image: "/project-management-screenshot.jpg",
            },
        ],
        events: [
            {
                title: "Building MERN Stack Apps",
                date: "2024-12-22",
                time: "14:00",
                organizer: "Alex Turner",
                attendees: 67,
                maxAttendees: 80,
                price: "$89",
            },
            {
                title: "Full Stack Development Bootcamp",
                date: "2025-01-20",
                time: "10:00",
                organizer: "Maria Garcia",
                attendees: 95,
                maxAttendees: 100,
                price: "$199",
            },
        ],
        resources: [
            {
                title: "MERN Stack Tutorial",
                url: "https://www.mongodb.com/mern-stack",
                type: "Tutorial",
            },
            {
                title: "Full Stack Open",
                url: "https://fullstackopen.com",
                type: "Course",
            },
            {
                title: "The Odin Project",
                url: "https://www.theodinproject.com",
                type: "Learning Platform",
            },
        ],
    },
    {
        id: "devops",
        title: "DevOps & Cloud",
        description:
            "Streamline development workflows with automation, deployment, and cloud infrastructure.",
        longDescription: `DevOps combines development and operations to improve collaboration and productivity. DevOps engineers focus on automation, continuous integration/deployment, infrastructure as code, and cloud services.

Key technologies include Docker, Kubernetes, Jenkins, and cloud platforms like AWS, Azure, and GCP. DevOps practices help teams deploy faster, more reliably, and at scale.`,
        icon: "Cloud",
        color: "bg-cyan-500",
        programmersCount: 72,
        projectsCount: 38,
        eventsCount: 7,
        technologies: [
            "Docker",
            "Kubernetes",
            "AWS",
            "Azure",
            "Jenkins",
            "Terraform",
        ],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&crop=center",
        programmers: [
            {
                name: "Robert Chen",
                title: "DevOps Engineer",
                company: "CloudOps",
                avatar: "/professional-developer-5.png",
                skills: ["Kubernetes", "AWS", "Terraform"],
                experience: "9+ years",
            },
            {
                name: "Jennifer Lee",
                title: "Cloud Architect",
                company: "Enterprise Cloud",
                avatar: "/professional-woman-developer-5.png",
                skills: ["Azure", "Docker", "Jenkins"],
                experience: "11+ years",
            },
        ],
        projects: [
            {
                title: "CI/CD Pipeline Platform",
                description: "Automated deployment pipeline for microservices.",
                author: "Robert Chen",
                stack: ["Jenkins", "Docker", "Kubernetes", "AWS"],
                likes: 234,
                views: 4560,
                image: "/cicd-pipeline-screenshot.jpg",
            },
            {
                title: "Infrastructure as Code",
                description: "Terraform modules for cloud infrastructure.",
                author: "Jennifer Lee",
                stack: ["Terraform", "Azure", "Ansible"],
                likes: 198,
                views: 3780,
                image: "/infrastructure-screenshot.jpg",
            },
        ],
        events: [
            {
                title: "Kubernetes in Production",
                date: "2024-12-28",
                time: "15:00",
                organizer: "Robert Chen",
                attendees: 58,
                maxAttendees: 70,
                price: "$99",
            },
            {
                title: "Cloud Architecture Patterns",
                date: "2025-01-25",
                time: "14:00",
                organizer: "Jennifer Lee",
                attendees: 63,
                maxAttendees: 75,
                price: "$119",
            },
        ],
        resources: [
            {
                title: "Kubernetes Documentation",
                url: "https://kubernetes.io/docs",
                type: "Official Docs",
            },
            {
                title: "AWS Training",
                url: "https://aws.amazon.com/training",
                type: "Learning Platform",
            },
            {
                title: "DevOps Roadmap",
                url: "https://roadmap.sh/devops",
                type: "Guide",
            },
        ],
    },
    {
        id: "data",
        title: "Data Science & AI",
        description:
            "Analyze data, build machine learning models, and create intelligent applications.",
        longDescription: `Data Science and AI involve extracting insights from data and building intelligent systems. Data scientists and ML engineers work with statistical analysis, machine learning algorithms, and deep learning frameworks.

Key areas include data analysis, predictive modeling, natural language processing, computer vision, and neural networks. Popular tools include Python, TensorFlow, PyTorch, and various data manipulation libraries.`,
        icon: "Brain",
        color: "bg-pink-500",
        programmersCount: 64,
        projectsCount: 29,
        eventsCount: 5,
        technologies: [
            "Python",
            "R",
            "TensorFlow",
            "PyTorch",
            "Pandas",
            "Jupyter",
        ],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center",
        programmers: [
            {
                name: "Dr. Amanda White",
                title: "Data Scientist",
                company: "AI Labs",
                avatar: "/professional-woman-developer-6.png",
                skills: ["Python", "TensorFlow", "Pandas"],
                experience: "12+ years",
            },
            {
                name: "Kevin Park",
                title: "ML Engineer",
                company: "DeepTech",
                avatar: "/professional-developer-6.png",
                skills: ["PyTorch", "Computer Vision", "NLP"],
                experience: "7+ years",
            },
        ],
        projects: [
            {
                title: "Predictive Analytics Engine",
                description:
                    "ML model for sales forecasting and trend analysis.",
                author: "Dr. Amanda White",
                stack: ["Python", "Scikit-learn", "Pandas", "TensorFlow"],
                likes: 412,
                views: 8230,
                image: "/analytics-engine-screenshot.jpg",
            },
            {
                title: "Computer Vision System",
                description: "Real-time object detection and classification.",
                author: "Kevin Park",
                stack: ["PyTorch", "OpenCV", "YOLO"],
                likes: 387,
                views: 7540,
                image: "/computer-vision-screenshot.jpg",
            },
        ],
        events: [
            {
                title: "Machine Learning Fundamentals",
                date: "2025-01-08",
                time: "16:00",
                organizer: "Dr. Amanda White",
                attendees: 78,
                maxAttendees: 90,
                price: "$149",
            },
            {
                title: "Deep Learning with PyTorch",
                date: "2025-01-30",
                time: "15:00",
                organizer: "Kevin Park",
                attendees: 71,
                maxAttendees: 85,
                price: "$169",
            },
        ],
        resources: [
            {
                title: "TensorFlow Documentation",
                url: "https://www.tensorflow.org/learn",
                type: "Official Docs",
            },
            {
                title: "Fast.ai",
                url: "https://www.fast.ai",
                type: "Course",
            },
            {
                title: "Kaggle Learn",
                url: "https://www.kaggle.com/learn",
                type: "Learning Platform",
            },
        ],
    },
];

async function seedCategories() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI!, {
            dbName: "byteunite",
        });
        console.log("Connected to MongoDB");

        // Clear existing categories
        console.log("Clearing existing categories...");
        await Category.deleteMany({});
        console.log("Existing categories cleared");

        // Insert new categories
        console.log("Inserting new categories...");
        const result = await Category.insertMany(categoriesData);
        console.log(`Successfully inserted ${result.length} categories`);

        console.log("\nSeeded categories:");
        result.forEach((cat) => {
            console.log(`- ${cat.title} (ID: ${cat.id})`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
}

seedCategories();
