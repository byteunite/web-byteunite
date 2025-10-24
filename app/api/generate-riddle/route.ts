import { generateRiddleCarousel } from "@/lib/gemini-riddle-generator";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Riddle from "@/models/Riddle";

/**
 * Fungsi untuk menambahkan slide peringatan sebelum SOLUSI
 *
 * Konsep:
 * - Slide "WARNING_ANSWER" akan disisipkan sebelum slide tipe "SOLUSI"
 * - Slide ini berfungsi sebagai pembatas antara pertanyaan dan jawaban
 * - Memberikan kesempatan kepada viewer untuk berpikir sebelum melihat jawaban
 *
 * @param slides - Array slide asli yang akan dimodifikasi
 * @returns Array slide baru dengan slide peringatan yang sudah disisipkan
 */
function insertWarningSlides(slides: any[]): any[] {
    const newSlides: any[] = [];

    slides.forEach((slide, index) => {
        // Cek apakah slide berikutnya adalah SOLUSI
        const nextSlide = slides[index + 1];

        // Tambahkan slide saat ini
        newSlides.push(slide);

        // Jika slide berikutnya adalah SOLUSI, sisipkan WARNING sebelum SOLUSI
        if (nextSlide && nextSlide.tipe_slide === "SOLUSI") {
            newSlides.push({
                tipe_slide: "WARNING_ANSWER",
                judul_slide: "🔍 Siap Lihat Jawaban?",
                sub_judul_slide: "Slide Berikutnya Mengungkap Jawabannya",
                konten_slide:
                    "Ini kesempatan terakhirmu untuk menebak! Swipe jika sudah siap... ➡️",
                prompt_untuk_image: "", // WARNING_ANSWER tidak memerlukan image
            });
        }
    });

    return newSlides;
}

export async function POST(request: Request) {
    try {
        const { title, riddle, solution } = await request.json();

        if (!title || !riddle || !solution) {
            return NextResponse.json(
                {
                    error: "Missing title, riddle, or solution in request body.",
                },
                { status: 400 }
            );
        }

        // Generate carousel data dari AI
        const carouselData = await generateRiddleCarousel(
            title,
            riddle,
            solution
        );

        // Tambahkan slide WARNING_ANSWER sebelum menyimpan ke database
        const slidesWithWarning = insertWarningSlides(carouselData.slides);
        carouselData.slides = slidesWithWarning;

        // Connect ke MongoDB
        await dbConnect();

        // Simpan data riddle beserta response AI ke database
        const newRiddle = await Riddle.create({
            title,
            riddle,
            solution,
            carouselData,
        });

        // Return response dengan data yang tersimpan
        return NextResponse.json({
            success: true,
            message: "Riddle berhasil disimpan ke database",
            data: {
                id: newRiddle._id,
                title: newRiddle.title,
                riddle: newRiddle.riddle,
                solution: newRiddle.solution,
                carouselData: newRiddle.carouselData,
                createdAt: newRiddle.createdAt,
            },
        });
    } catch (error) {
        // Menangani error dari fungsi generator atau parsing JSON
        console.error("API Error:", error);
        return NextResponse.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
