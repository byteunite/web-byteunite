import { GoogleGenAI } from "@google/genai";

// Inisialisasi Gemini AI client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

// Interface untuk hasil parsing CV
export interface ParsedProgrammerData {
    name: string;
    role: string;
    location: string;
    email: string;
    bio: string;
    fullBio: string;
    stack: string[];
    category: string;
    github: string;
    portfolio: string;
    linkedin: string;
    twitter: string;
    rating: number;
    projects: number;
    experience: string;
    availability: string;
    hourlyRate: string;
    joinedDate: string;
    languages: string[];
    certifications: string[];
    skills: Array<{
        name: string;
        level: number;
    }>;
    recentProjects: Array<{
        title: string;
        description: string;
        tech: string[];
        link: string;
        image: string;
        duration: string;
        role: string;
    }>;
    avatar: string;
}

/**
 * Parse CV text menggunakan Gemini AI dan ekstrak data programmer
 *
 * @param cvText - Teks yang diekstrak dari CV PDF
 * @returns Promise<ParsedProgrammerData> - Data programmer yang terstruktur
 */
export async function parseCVWithGemini(
    cvText: string
): Promise<ParsedProgrammerData> {
    // Membuat prompt yang terstruktur untuk Gemini
    const systemPrompt = `
Kamu adalah AI assistant yang ahli dalam menganalisis CV/Resume programmer dan mengekstrak informasi menjadi data terstruktur.

TUGAS UTAMA:
Analisis CV yang diberikan dan ekstrak semua informasi penting menjadi format JSON yang terstruktur sesuai dengan struktur database programmer.

ATURAN EKSTRAKSI:
1. Ekstrak SEMUA informasi yang tersedia di CV
2. Jika ada informasi yang tidak ada di CV, gunakan nilai default yang masuk akal
3. Untuk field yang tidak ada, gunakan placeholder atau nilai kosong yang sesuai
4. Pastikan data yang diekstrak akurat dan sesuai dengan konteks

FIELD YANG HARUS DIEKSTRAK:
1. **name** (string, REQUIRED): Nama lengkap programmer
2. **role** (string, REQUIRED): Job title/posisi (misal: "Senior Frontend Developer")
3. **location** (string, REQUIRED): Lokasi/domisili (misal: "Jakarta, Indonesia")
4. **email** (string, REQUIRED): Email address
5. **bio** (string, REQUIRED): Bio singkat (1-2 kalimat, max 150 karakter)
6. **fullBio** (string, REQUIRED): Bio lengkap yang mendeskripsikan pengalaman dan keahlian
7. **stack** (array of strings, REQUIRED): Teknologi yang dikuasai (misal: ["React", "Node.js", "MongoDB"])
8. **category** (string, REQUIRED): Kategori programmer, pilih salah satu:
   - "frontend" (untuk frontend developer)
   - "backend" (untuk backend developer)
   - "fullstack" (untuk full stack developer)
   - "mobile" (untuk mobile developer)
   - "devops" (untuk DevOps engineer)
   - "data" (untuk data scientist/engineer)
9. **github** (string): Username GitHub (hanya username, bukan URL)
10. **portfolio** (string): Website portfolio (URL lengkap atau domain)
11. **linkedin** (string): URL LinkedIn profile
12. **twitter** (string): Username Twitter/X
13. **rating** (number): Rating default 4.5 (range 0-5)
14. **projects** (number): Estimasi jumlah project yang pernah dikerjakan
15. **experience** (string): Pengalaman kerja (misal: "5+ years", "2-3 years")
16. **availability** (string): Status ketersediaan (misal: "Available for freelance", "Open to opportunities")
17. **hourlyRate** (string): Rate per jam (misal: "$50-80", "Rp 500k-800k")
18. **joinedDate** (string): Tanggal hari ini dalam format "Month Year" (misal: "December 2024")
19. **languages** (array of strings): Bahasa yang dikuasai (misal: ["English", "Indonesian"])
20. **certifications** (array of strings): Sertifikasi yang dimiliki
21. **skills** (array of objects): Array skill dengan format:
    - name (string): Nama skill
    - level (number): Level skill 0-100
22. **recentProjects** (array of objects): Project terbaru dengan format:
    - title (string): Nama project
    - description (string): Deskripsi project
    - tech (array of strings): Teknologi yang digunakan
    - link (string): Link project (gunakan "#" jika tidak ada)
    - image (string): URL gambar project (gunakan "/placeholder.svg" jika tidak ada)
    - duration (string): Durasi project (misal: "3 months", "6 weeks")
    - role (string): Role dalam project (misal: "Lead Developer", "Frontend Developer")
23. **avatar** (string): URL avatar (gunakan "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email sebagai default)

INSTRUKSI KHUSUS:
- Untuk **category**, analisis skill dan role untuk menentukan kategori yang paling sesuai
- Untuk **stack**, ekstrak semua teknologi, framework, dan tools yang disebutkan
- Untuk **skills**, konversi keahlian menjadi array dengan level estimasi berdasarkan pengalaman
- Untuk **recentProjects**, ekstrak project dari CV dan format sesuai struktur
- Untuk **bio**, buat ringkasan menarik dari pengalaman dan keahlian (1-2 kalimat)
- Untuk **fullBio**, buat deskripsi lengkap yang menggabungkan pengalaman, keahlian, dan pencapaian
- Jika tidak ada informasi tentang availability atau hourlyRate, gunakan nilai default yang masuk akal

OUTPUT FORMAT:
Kembalikan data dalam format JSON yang VALID dan dapat di-parse.
JANGAN menambahkan komentar atau teks di luar JSON.
Pastikan semua field REQUIRED terisi.
`;

    const userPrompt = `
Berikut adalah teks dari CV programmer yang perlu dianalisis:

---
${cvText}
---

Ekstrak semua informasi dari CV di atas dan kembalikan dalam format JSON yang sesuai dengan struktur database programmer.
`;

    try {
        // Generate response menggunakan Gemini
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                responseMimeType: "application/json",
                systemInstruction: systemPrompt,
                temperature: 0.3, // Lower temperature untuk hasil yang lebih konsisten
            },
        });

        // Ekstrak response text
        const responseText = result.text?.trim() || "";

        // Clean up response (remove markdown code blocks if present)
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith("```json")) {
            cleanedResponse = cleanedResponse
                .replace(/```json\n?/g, "")
                .replace(/```\n?$/g, "");
        } else if (cleanedResponse.startsWith("```")) {
            cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
        }

        // Parse JSON response
        const parsedData: ParsedProgrammerData = JSON.parse(cleanedResponse);

        // Validate required fields
        if (
            !parsedData.name ||
            !parsedData.role ||
            !parsedData.location ||
            !parsedData.email
        ) {
            throw new Error(
                "Missing required fields: name, role, location, or email"
            );
        }

        // Set default values for missing fields
        const today = new Date();
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const finalData: ParsedProgrammerData = {
            name: parsedData.name,
            role: parsedData.role,
            location: parsedData.location,
            email: parsedData.email,
            bio:
                parsedData.bio ||
                `Experienced ${parsedData.role} with expertise in modern technologies.`,
            fullBio:
                parsedData.fullBio ||
                `${parsedData.name} is a dedicated ${parsedData.role} with a passion for creating innovative solutions. With extensive experience in various technologies and a strong commitment to excellence, they bring value to every project.`,
            stack: parsedData.stack || [],
            category: parsedData.category || "fullstack",
            github: parsedData.github || "",
            portfolio: parsedData.portfolio || "",
            linkedin: parsedData.linkedin || "",
            twitter: parsedData.twitter || "",
            rating: parsedData.rating || 4.5,
            projects: parsedData.projects || 0,
            experience: parsedData.experience || "1+ years",
            availability: parsedData.availability || "Open to opportunities",
            hourlyRate: parsedData.hourlyRate || "Negotiable",
            joinedDate:
                parsedData.joinedDate ||
                `${monthNames[today.getMonth()]} ${today.getFullYear()}`,
            languages: parsedData.languages || ["English"],
            certifications: parsedData.certifications || [],
            skills: parsedData.skills || [],
            recentProjects: parsedData.recentProjects || [],
            avatar:
                parsedData.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    parsedData.email
                )}`,
        };

        return finalData;
    } catch (error) {
        console.error("Error parsing CV with Gemini:", error);
        throw new Error(
            `Failed to parse CV: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
