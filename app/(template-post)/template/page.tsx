import RandomShape from "@/components/RandomShape";
import ClickableImage from "@/components/ClickableImage";
import CoverEditor from "@/components/CoverEditor";
import { Feather, UserPlus, Search } from "lucide-react";
import { ImageGenerator } from "@/components/ImageGenerator";

/**
 * Type definition untuk tipe slide yang tersedia
 */
type SlideType =
    | "COVER"
    | "MISTERI"
    | "CLOSING"
    | "SOLUSI"
    | "FINAL"
    | "WARNING_ANSWER";

/**
 * Interface untuk struktur data slide
 */
interface Slide {
    tipe_slide: SlideType;
    judul_slide: string;
    sub_judul_slide: string;
    konten_slide: string;
    prompt_untuk_image?: string; // Optional karena WARNING_ANSWER tidak memerlukan image
}

/**
 * Fungsi untuk menambahkan slide peringatan sebelum CLOSING dan SOLUSI
 *
 * Konsep:
 * - Slide "WARNING_ANSWER" akan disisipkan sebelum slide tipe "CLOSING" dan "SOLUSI"
 * - Slide ini berfungsi sebagai pembatas antara pertanyaan dan jawaban
 * - Memberikan kesempatan kepada viewer untuk berpikir sebelum melihat jawaban
 * - Design simple dengan pesan yang jelas
 *
 * @param slides - Array slide asli yang akan dimodifikasi
 * @returns Array slide baru dengan slide peringatan yang sudah disisipkan
 */
function insertWarningSlides(slides: Slide[]): Slide[] {
    const newSlides: Slide[] = [];

    slides.forEach((slide, index) => {
        // Cek apakah slide berikutnya adalah CLOSING atau SOLUSI
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
            });
        }
    });

    return newSlides;
}

export default function TemplatePage() {
    const dummyData1: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri Pengatur Waktu Telur",
            sub_judul_slide: "Berapa Lama Telur Itu Direbus?",
            konten_slide:
                "Siap pecahkan misteri waktu memasak telur yang <em>sangat aneh</em> ini? Ada <strong>sesuatu yang tidak biasa</strong> dengan telur ini!",
            prompt_untuk_image:
                "A single egg, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Petunjuk Awal",
            sub_judul_slide: "Waktu Rebus yang Berbeda",
            konten_slide:
                "Biasanya, telur direbus matang dalam <strong>sekitar 10 menit</strong>. Namun, di beberapa <em>tempat misterius</em>, proses ini bisa memakan waktu <strong>hingga 40 menit</strong>.",
            prompt_untuk_image:
                "A kitchen timer, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Anomali Waktu",
            sub_judul_slide: "Perbedaan Mencolok",
            konten_slide:
                "<em>Mengapa</em> ada perbedaan <strong>waktu rebus yang begitu jauh</strong>? Apakah ada faktor <em>tersembunyi</em> yang memengaruhi proses sederhana ini?",
            prompt_untuk_image:
                "A boiling pot with a single egg inside, visible steam, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Saatnya Menebak!",
            sub_judul_slide: "Pecahkan Misterinya",
            konten_slide:
                "Menurutmu, <em>faktor apa</em> yang membuat beberapa telur membutuhkan <strong>waktu lebih lama</strong> untuk direbus hingga matang sempurna? Tulis tebakanmu di kolom komentar!",
            prompt_untuk_image:
                "A notepad and a pen, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Terungkap!",
            sub_judul_slide: "Fakta di Balik Waktu Rebus",
            konten_slide:
                "Jawabannya adalah: <strong><em>ukuran telur</em></strong>! Telur burung unta bisa seberat <strong>1 hingga 3 kilogram</strong> dan butuh <strong>45 menit hingga 2 jam</strong> untuk matang. Satu telur unta setara <em>dua lusin telur ayam</em>!",
            prompt_untuk_image:
                "An ostrich egg next to a regular chicken egg for comparison, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Misteri Terpecahkan!",
            sub_judul_slide: "Jangan Lewatkan Teka-teki Lainnya",
            konten_slide:
                "Bagaimana, <em>apakah kamu berhasil menebaknya</em>? Suka dengan teka-teki misteri seperti ini? <strong><em>Follow</em></strong> untuk misteri <strong>lebih seru</strong> setiap hari!",
            prompt_untuk_image:
                "A magnifying glass, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData3: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri: Dirampok?",
            sub_judul_slide: "Kasus Paling Aneh!",
            konten_slide:
                "<em>Bagaimana</em> seseorang tahu rumahnya dirampok jika <strong>tidak ada yang hilang</strong>? Mari kita pecahkan misteri ini!",
            prompt_untuk_image:
                "A small, minimalist house silhouette, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Laporan Aneh Ben",
            sub_judul_slide: "Tidak Ada yang Hilang?",
            konten_slide:
                "Ben memberitahu petugas bahwa rumahnya <strong>dirampok</strong> malam sebelumnya. Namun, saat ditanya apa yang hilang, Ben menjawab, 'Sejauh yang saya tahu, <em>tidak ada</em>.'",
            prompt_untuk_image:
                "A single house key, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Paradoks Perampokan",
            sub_judul_slide: "Bagaimana Ia Tahu?",
            konten_slide:
                "Petugas bingung. Jika <em>tidak ada barang</em> yang hilang, bagaimana Ben bisa <strong>begitu yakin</strong> bahwa rumahnya telah dirampok? <em>Apakah ada yang salah</em> dengan laporannya?",
            prompt_untuk_image:
                "A magnifying glass, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Waktunya Menebak!",
            sub_judul_slide: "Pikirkan Solusinya",
            konten_slide:
                "<em>Menurutmu</em>, apa yang sebenarnya terjadi pada Ben? <strong>Bagaimana</strong> dia tahu dia dirampok, padahal tidak ada barang yang dicuri dari 'rumahnya'?",
            prompt_untuk_image:
                "A notepad and a pen, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Jawabannya Terungkap!",
            sub_judul_slide: "Misteri Terpecahkan",
            konten_slide:
                "Jawabannya adalah: <strong><em>Rumah mobil</em></strong> Ben yang dicuri! Bukan rumah fisik, melainkan <strong>seluruh rumah mobilnya</strong> yang hilang beserta isinya!",
            prompt_untuk_image:
                "A motor home vehicle, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Suka Teka-teki Ini?",
            sub_judul_slide: "Ikuti Kami!",
            konten_slide:
                "<em>Follow</em> akun kami untuk teka-teki detektif dan misteri <strong>lebih seru</strong> setiap hari! Jangan lewatkan tantangan berikutnya!",
            prompt_untuk_image:
                "A smartphone displaying a magnifying glass icon on its screen, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData2: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Demi Kejahatan",
            sub_judul_slide: "Misteri Tengah Malam",
            konten_slide:
                "Apa yang mendorong <em>seorang perampok</em> untuk kembali ke <strong>rumah korban</strong>, tanpa niat buruk?",
            prompt_untuk_image:
                "A single lockpick set, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Aksi Aneh Perampok",
            sub_judul_slide: "Petunjuk 1: Tanpa Niat Buruk",
            konten_slide:
                "Seorang <strong>perampok</strong> masuk ke rumah orang asing <em>larut malam</em>. Dia tidak berencana mencuri apa pun, <em>ataupun</em> menyebabkan bahaya.",
            prompt_untuk_image:
                "A small flashlight beam illuminating, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Tindakan Misterius",
            sub_judul_slide: "Petunjuk 2: Bukan Perlindungan",
            konten_slide:
                "Dia <em>juga</em> tidak mencari <strong>perlindungan</strong>. Ada apa di balik <em>tindakan aneh</em> perampok ini?",
            prompt_untuk_image:
                "A single glass window pane, slightly ajar, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Apa Motifnya?",
            sub_judul_slide: "Saatnya Menebak!",
            konten_slide:
                "Perampok tanpa niat buruk, tidak mencari perlindungan. <em>Bisakah kamu</em> memecahkan <strong>misteri</strong> di balik <em>aksi tengah malam</em> ini?",
            prompt_untuk_image:
                "A small notepad and a pen, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Terungkap! Motif Sejati",
            sub_judul_slide: "Tindakan Penebusan",
            konten_slide:
                "Jawabannya adalah: Sang perampok <strong>kembali untuk mengembalikan</strong> barang-barang yang dia curi <em>sebelumnya malam itu</em>, karena <strong><em>dihantui rasa bersalah</em></strong>.",
            prompt_untuk_image:
                "A small, open cloth pouch with a few small items (like a ring or watch) spilling out, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Suka Teka-Teki Ini?",
            sub_judul_slide: "Ikuti Kami Sekarang!",
            konten_slide:
                "Bagaimana tebakanmu? <em>Follow</em> akun kami untuk <strong>misteri detektif seru</strong> lainnya setiap hari!",
            prompt_untuk_image:
                "A smartphone displaying a social media 'follow' button, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData4: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri: Ambil atau Tinggalkan",
            sub_judul_slide: "Perampok yang Gagal Merampok?",
            konten_slide:
                "Siap mengungkap kisah <em>aneh</em> seorang perampok yang <strong>tidak mengambil apa-apa</strong> dari target terakhirnya? Ada <em>apa sebenarnya</em>?",
            prompt_untuk_image:
                "A single black balaclava (ski mask), centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Petunjuk 1: Jejak Sang Perampok",
            sub_judul_slide: "Rentetan Perampokan Siang Hari",
            konten_slide:
                "Sepanjang hari, <strong>perampok profesional</strong> ini telah menggasak <em>banyak rumah</em>. Targetnya adalah barang berharga, dan ia selalu <strong>berhasil</strong>.",
            prompt_untuk_image:
                "A single small old-fashioned sack with a dollar sign on it, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Petunjuk 2: Rumah Terakhir yang Aneh",
            sub_judul_slide: "Masuk Lewat Pintu Belakang",
            konten_slide:
                "Di rumah terakhir, ia masuk melalui <strong>pintu belakang</strong>. Rumah ini <em>penuh barang berharga</em>, lebih banyak dari yang lain, dan <strong>tidak ada yang bisa menghentikannya</strong>. Tapi, <em>ia tidak mengambil apa-apa</em>.",
            prompt_untuk_image:
                "A single metal door key, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Saatnya Menebak!",
            sub_judul_slide: "Kenapa Ia Tidak Mengambil Apa-apa?",
            konten_slide:
                "Dengan <em>segala kesempatan</em> dan <strong>tanpa hambatan</strong>, mengapa perampok itu memutuskan untuk <strong><em>pergi dengan tangan kosong</em></strong> dari rumah terakhirnya?",
            prompt_untuk_image:
                "A single magnifying glass, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Terungkap: Alasan Sebenarnya!",
            sub_judul_slide: "Perampok Itu Tahu Rumah Ini...",
            konten_slide:
                "Jawabannya adalah: <strong><em>Rumah itu adalah rumahnya sendiri!</em></strong> Ia meminjam kunci dari pasangannya tanpa sadar, dan baru menyadari setelah masuk.",
            prompt_untuk_image:
                "A single small house model, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Berhasil Menebak?",
            sub_judul_slide: "Bagikan Hasilmu!",
            konten_slide:
                "Bagaimana, <em>apakah kamu berhasil</em> memecahkan misteri ini? Bagikan jawabanmu dan <strong>tantang temanmu</strong> untuk ikut menebak! 🚀",
            prompt_untuk_image:
                "A single human hand holding a smartphone displaying a social media feed, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData5: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri Brankas Bank",
            sub_judul_slide: "Aman tapi Tidak Sehat",
            konten_slide:
                "Seorang perampok bank <em>bekerja sepanjang malam</em>, tapi <strong>tidak berhenti</strong> saat pagi tiba. <em>Kenapa</em>?",
            prompt_untuk_image:
                "A bank vault door, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Petunjuk 1: Aksi di Kegelapan",
            sub_judul_slide: "Perampok Itu Terus Bekerja",
            konten_slide:
                "Dia <em>bekerja sepanjang malam</em>, mencoba membobol <strong>brankas bank</strong>. Waktu terasa mendesak, namun dia tak peduli.",
            prompt_untuk_image:
                "A flashlight beam shining on a metal safe, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Petunjuk 2: Pagi Menjelang",
            sub_judul_slide: "Karyawan Akan Segera Tiba",
            konten_slide:
                "Saat <strong>pagi mendekat</strong>, dia tahu <em>karyawan bank</em> akan segera tiba. Tapi dia <strong>tidak berhenti</strong>. Mengapa?",
            prompt_untuk_image:
                "A clock face showing early morning hours, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Waktunya Menebak!",
            sub_judul_slide: "Bisakah Kamu Memecahkan Misteri Ini?",
            konten_slide:
                "<em>Bagaimana mungkin</em> seorang perampok terus beraksi saat <strong>karyawan akan tiba</strong>? Apa yang <em>sebenarnya terjadi</em>?",
            prompt_untuk_image:
                "A notepad and pen, ready for writing, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Terpecahkan!",
            sub_judul_slide: "Identitas Perampok Terungkap",
            konten_slide:
                "Jawabannya adalah... Perampok itu adalah <strong><em>penjaga malam</em></strong> bank! Dia memiliki <strong>lebih banyak waktu</strong> untuk bekerja pada brankas itu di <strong>siang hari</strong>, saat bank kosong, daripada di malam hari.",
            prompt_untuk_image:
                "A security guard uniform hat, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Suka Teka-teki Ini?",
            sub_judul_slide: "Jangan Lewatkan Misteri Lainnya!",
            konten_slide:
                "Tertipu lagi, kan? 😂 Jangan lewatkan misteri <strong>lebih seru</strong> setiap hari! <em>Follow kami</em> untuk asah otak!",
            prompt_untuk_image:
                "A magnifying glass, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData6: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Bukan Kembar?",
            sub_judul_slide: "Misteri Kelahiran yang Aneh!",
            konten_slide:
                "Siap pecahkan teka-teki <em>kelahiran yang aneh</em> ini? Mereka <strong>sama dalam segalanya</strong>, tapi <em>bukan kembar</em>!",
            prompt_untuk_image:
                "A baby bottle, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Identitas Sama",
            sub_judul_slide: "Dua Anak, Satu Waktu",
            konten_slide:
                "Mereka lahir di <strong>rumah sakit yang sama</strong>, pada <em>jam, hari, dan tahun yang sama</em> persis.",
            prompt_untuk_image:
                "A small analog clock face, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Orang Tua Sama",
            sub_judul_slide: "Tapi Bukan Kembar Dua",
            konten_slide:
                "Memiliki <strong>ibu dan ayah yang sama</strong>. Namun, <em>teka-teki ini menyatakan</em> mereka <strong>bukan kembar</strong>.",
            prompt_untuk_image:
                "A simple, empty photo frame, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Saatnya Berpikir!",
            sub_judul_slide: "Bagaimana Ini Mungkin Terjadi?",
            konten_slide:
                "Dengan <strong>semua kesamaan</strong> itu, <em>bagaimana mungkin</em> mereka <strong>bukanlah kembar</strong>? Ayo, <em>pecahkan teka-teki</em> ini!",
            prompt_untuk_image:
                "A small notepad and a pen, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Jawabannya Adalah...",
            sub_judul_slide: "Mereka Bukan Kembar Dua!",
            konten_slide:
                "Ternyata, mereka adalah <strong><em>dua dari tiga anak</em></strong> yang lahir bersamaan. Mereka <strong>kembar tiga</strong>!",
            prompt_untuk_image:
                "Three small baby pacifiers, arranged in a small cluster, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Misteri Terpecahkan!",
            sub_judul_slide: "Lanjut Pecahkan Lainnya!",
            konten_slide:
                "<em>Gampang kan?</em> Jangan lupa <strong>follow</strong> untuk teka-teki <em>misteri menarik</em> lainnya setiap hari!",
            prompt_untuk_image:
                "A magnifying glass, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData7: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri Pria di Mercusuar",
            sub_judul_slide: "Tindakan Sederhana, Konsekuensi Tragis",
            konten_slide:
                "Sebuah <em>keputusan kecil</em> di malam hari berujung pada <strong>akhir yang tak terduga</strong> di pagi hari. Bisakah kamu pecahkan misteri ini?",
            prompt_untuk_image:
                "A lighthouse lamp, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Teka-Teki Pria & Lampu",
            sub_judul_slide: "Malam yang Gelap Gulita",
            konten_slide:
                "Seorang pria <strong>pulang ke rumah</strong>. Dia kemudian <em>mematikan lampu</em>, lalu pergi tidur. Sebuah tindakan yang <strong>biasa saja</strong>, bukan?",
            prompt_untuk_image:
                "A light switch (off position), centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Pagi yang Kelam",
            sub_judul_slide: "Mengapa Hidupnya Berakhir?",
            konten_slide:
                "Keesokan paginya, ia bangun, <strong>membaca koran</strong>, lalu... <em>mengakhiri hidupnya</em>. Apa yang terjadi <strong>semalam</strong> yang begitu mengubah segalanya?",
            prompt_untuk_image:
                "A folded newspaper, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Saatnya Berpikir Keras!",
            sub_judul_slide: "Hubungkan Titik-Titik Petunjuk",
            konten_slide:
                "<em>Tidak ada</em> tanda-tanda kejahatan, <em>tidak ada</em> ancaman. Hanya <strong>satu tindakan sederhana</strong>. Bisakah kamu menemukan <em>korelasi</em> antara mematikan lampu dan akhir hidupnya?",
            prompt_untuk_image:
                "A notepad and pen, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Terungkap: Pria dan Mercusuar",
            sub_judul_slide: "Konsekuensi Tragis dari Sebuah Tugas",
            konten_slide:
                "Pria itu adalah <strong>penjaga mercusuar</strong>. Ketika ia mematikan lampu, ia secara tidak langsung telah menyebabkan <strong>ratusan orang tewas</strong> di kapal yang karam. <em>Penyesalan</em> atas perbuatannya saat membaca berita itulah yang mendorongnya.",
            prompt_untuk_image:
                "A ship with a broken mast sinking into waves, depicted in a non-graphic, symbolic way, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Misteri Terpecahkan!",
            sub_judul_slide: "Bagaimana Menurutmu?",
            konten_slide:
                "Teka-teki ini menunjukkan bahwa <em>satu tindakan</em> bisa memiliki <strong>konsekuensi yang besar</strong>. Apakah kamu berhasil menebaknya? <em>Bagikan</em> pendapatmu di kolom komentar!",
            prompt_untuk_image:
                "A magnifying glass, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData8: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri Pria dan Mobil",
            sub_judul_slide: "Kisah Bangkrut yang Aneh",
            konten_slide:
                "Siapkah kamu pecahkan misteri <em>aneh</em> tentang seorang pria yang <strong>tiba-tiba bangkrut</strong> setelah sampai di hotel?",
            prompt_untuk_image:
                "A toy car, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Petunjuk 1: Perjalanan Tak Biasa",
            sub_judul_slide: "Mobil Didorong, Bukan Dikemudikan",
            konten_slide:
                "Pria ini <em>mendorong</em> mobilnya hingga ke sebuah <strong>hotel</strong>. Sebuah perjalanan yang sangat <em>tidak biasa</em>, bukan?",
            prompt_untuk_image:
                "A human hand pushing a toy car, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Petunjuk 2: Bangkrut Seketika",
            sub_judul_slide: "Apa yang Membuatnya Jatuh Miskin?",
            konten_slide:
                "Setibanya di hotel, pria itu <em>menyadar</em>i bahwa ia <strong>bangkrut</strong>. Hotel ini pasti sangat <em>mahal</em> atau ada yang lain?",
            prompt_untuk_image:
                "A miniature hotel building, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Mari Berpikir!",
            sub_judul_slide: "Pecahkan Misteri Ini Sekarang!",
            konten_slide:
                "Bisakah kamu menebak <em>apa</em> yang menyebabkan pria ini <strong>bangkrut</strong> setelah tiba di hotel, padahal ia <em>mendorong</em> mobilnya?",
            prompt_untuk_image:
                "A notepad and a pencil, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "TERPECAHKAN!",
            sub_judul_slide: "Ini Dia Jawabannya!",
            konten_slide:
                "Jawabannya adalah: Ini adalah permainan <strong><em>Monopoli</em></strong>! Pria itu mendorong <strong>pion mobilnya</strong> di atas papan permainan dan mendarat di properti hotel orang lain, sehingga ia harus membayar sewa dan <strong>bangkrut</strong>.",
            prompt_untuk_image:
                "A Monopoly car token, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Misteri Berakhir!",
            sub_judul_slide: "Tantang Temanmu!",
            konten_slide:
                "Bagaimana? Terkejut dengan jawabannya? Jangan lupa <em>share</em> teka-teki ini dan <strong>tantang temanmu</strong> untuk memecahkannya! 💡",
            prompt_untuk_image:
                "A magnifying glass, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData9: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri Pernikahan Tak Terduga",
            sub_judul_slide: "Pria Ini Menikahi 20 Wanita, Tapi...",
            konten_slide:
                "Siap pecahkan teka-teki <em>aneh</em> tentang seorang pria yang <strong>menikahi banyak wanita</strong> tanpa didakwa poligami? Ada <strong>sesuatu yang tidak terduga</strong> di balik ini!",
            prompt_untuk_image:
                "A wedding ring, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Fakta Mengejutkan",
            sub_judul_slide: "Dua Puluh Pernikahan",
            konten_slide:
                "Seorang <strong>pria</strong> di desanya telah <em>resmi menikahkan</em> <strong>dua puluh wanita</strong>. Ini bukan gosip, ini fakta yang <strong>terdokumentasi</strong>!",
            prompt_untuk_image:
                "A small village church, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Tidak Ada Tuduhan Poligami",
            sub_judul_slide: "Hukum Tidak Berlaku?",
            konten_slide:
                "Meskipun 'menikahi' begitu banyak wanita, pria ini <em>tidak pernah</em> didakwa dengan <strong>poligami</strong>. <em>Bagaimana ini bisa terjadi</em> di desa kecil yang <strong>taat hukum</strong>?",
            prompt_untuk_image:
                "A closed law book, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Saatnya Berpikir Keras!",
            sub_judul_slide: "Mampukah Kamu Memecahkannya?",
            konten_slide:
                "Semua petunjuk ada di sana. <em>Pikirkan</em> baik-baik tentang <strong>peran</strong> pria ini dan <strong>konteks</strong> 'menikahkan'. <em>Apa yang kamu lewatkan</em>?",
            prompt_untuk_image:
                "A magnifying glass, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "TERUNGKAP!",
            sub_judul_slide: "Inilah Jawabannya",
            konten_slide:
                "Rahasia di balik teka-teki ini adalah: pria itu adalah seorang <strong><em>imam</em></strong>! Ia menikahkan <strong>dua puluh wanita itu</strong> dengan <em>pasangan mereka</em>, <strong>bukan dirinya sendiri</strong>. Tugasnya adalah menyatukan dua insan dalam pernikahan.",
            prompt_untuk_image:
                "A priest's collar, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Teka-Teki Selesai!",
            sub_judul_slide: "Misteri Terpecahkan!",
            konten_slide:
                "Bagaimana, <em>apakah kamu berhasil menebaknya</em>? Jangan lupa <strong>like</strong>, <strong>share</strong>, dan <strong>follow</strong> untuk teka-teki <em>seru</em> lainnya setiap hari!",
            prompt_untuk_image:
                "A hand giving a 'thumbs up' gesture, representing a like, centered, small size (max 1/3 of space), dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData10: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri Pria di Lantai 12",
            sub_judul_slide: "Teka-teki Lift Aneh",
            konten_slide:
                "Ada yang <em>aneh</em> dengan cara pria ini naik lift. Bisakah kamu pecahkan <strong>logikanya</strong>?",
            prompt_untuk_image:
                "A single male person standing in front of an elevator door, looking up. The person appears small in scale, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Rutinitas Pagi",
            sub_judul_slide: "Turun Tanpa Kendala",
            konten_slide:
                "Setiap pagi, ia <strong>turun</strong> dari lantai 12 dengan lift, pergi bekerja <em>tanpa masalah</em> sedikit pun.",
            prompt_untuk_image:
                "An elevator button panel with the number '1' clearly pressed, indicating descent. Complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Naik yang Berbeda",
            sub_judul_slide: "Kondisi Aneh Saat Pulang",
            konten_slide:
                "Saat pulang, jika <em>sendirian</em> dan <em>tidak hujan</em>, ia hanya bisa sampai <strong>lantai 10</strong>, lalu naik tangga ke-12. Tapi jika ada orang lain atau hujan, ia bisa langsung ke <strong>lantai 12</strong>.",
            prompt_untuk_image:
                "An elevator button panel with the number '10' clearly pressed, and a small rain umbrella leaning against the panel. Complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Apa Rahasianya?",
            sub_judul_slide: "Temukan Jawabannya!",
            konten_slide:
                "Mengapa pria itu <em>kadang-kadang</em> tidak bisa mencapai lantai <strong>apartemennya</strong> dengan lift? Pikirkan baik-baik!",
            prompt_untuk_image:
                "A magnifying glass focusing on an elevator button panel. Complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Terpecahkan!",
            sub_judul_slide: "Kunci Jawabannya Adalah...",
            konten_slide:
                "Pria itu adalah seorang <strong><em>kerdil</em></strong>! Ia tidak bisa mencapai tombol lantai 12 sendiri, kecuali jika orang lain menekannya atau ia menggunakan <strong>payungnya</strong> saat hujan.",
            prompt_untuk_image:
                "A hand holding an umbrella handle, using its tip to press the '12' button on an elevator panel. Complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Misteri Terpecahkan!",
            sub_judul_slide: "Suka Teka-teki Ini?",
            konten_slide:
                "Bagaimana, apakah kamu berhasil menebaknya? <em>Follow</em> kami untuk <strong>misteri seru lainnya</strong> setiap hari! 🕵️‍♂️",
            prompt_untuk_image:
                "A smartphone with a 'Follow' button displayed on its screen, and a small magnifying glass beside it. Complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF).",
        },
    ];

    const dummyData: Slide[] = [
        {
            tipe_slide: "COVER" as const,
            judul_slide: "Misteri Rumah Unik",
            sub_judul_slide: "Semua Jendela Menghadap Utara?",
            konten_slide:
                "Siap memecahkan teka-teki <em>rumah paling aneh</em> yang pernah ada? <strong>Semua jendela</strong> menghadap ke <strong>satu arah</strong>!",
            prompt_untuk_image:
                "A small, simple house model, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF), no borders, no frames, clean isolation.",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Rumah Persegi",
            sub_judul_slide: "Membangun Impian yang Aneh",
            konten_slide:
                "Sepasang suami istri ingin membangun rumah <strong>persegi</strong>. Ini dia <em>petunjuk pertama</em>!",
            prompt_untuk_image:
                "A carpenter's square, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF), no borders, no frames, clean isolation.",
        },
        {
            tipe_slide: "MISTERI",
            judul_slide: "Jendela Menghadap Utara",
            sub_judul_slide: "Setiap Dinding, Setiap Jendela",
            konten_slide:
                "Di <strong>setiap dinding</strong> rumah, akan ada <strong>jendela</strong>. Dan <em>setiap jendela itu</em> akan <strong>menghadap ke utara</strong>. <em>Bagaimana ini mungkin</em>?",
            prompt_untuk_image:
                "A compass pointing North, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF), no borders, no frames, clean isolation.",
        },
        {
            tipe_slide: "CLOSING",
            judul_slide: "Waktunya Berpikir!",
            sub_judul_slide: "Pecahkan Misteri Arah Jendela Ini",
            konten_slide:
                "Bisakah kamu menebak <em>bagaimana</em> sebuah rumah persegi bisa memiliki <strong>semua jendela</strong> menghadap ke <strong>utara</strong>? 💡 <em>Pikirkan baik-baik</em>!",
            prompt_untuk_image:
                "A notepad with a pen, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF), no borders, no frames, clean isolation.",
        },
        {
            tipe_slide: "SOLUSI",
            judul_slide: "Terungkap!",
            sub_judul_slide: "Lokasi Kunci Segalanya",
            konten_slide:
                "Jawabannya adalah: Rumah itu terletak di <strong><em>Kutub Selatan</em></strong>! Dari sana, <strong>semua arah adalah Utara</strong>.",
            prompt_untuk_image:
                "A globe showing the South Pole, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF), no borders, no frames, clean isolation.",
        },
        {
            tipe_slide: "FINAL",
            judul_slide: "Misteri Terpecahkan!",
            sub_judul_slide: "Suka Teka-Teki Ini?",
            konten_slide:
                "Suka dengan teka-teki logika seperti ini? Jangan lewatkan misteri <strong>lebih seru</strong> setiap hari! <em>Follow</em> untuk tantangan otak lainnya!",
            prompt_untuk_image:
                "A magnifying glass, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background (#FFFFFF), no borders, no frames, clean isolation.",
        },
    ];

    const scale = 2.5;

    // Terapkan fungsi insertWarningSlides untuk menambahkan slide peringatan
    const processedData = insertWarningSlides(dummyData);

    const postCount = processedData.length; // Gunakan processedData yang sudah ditambahkan warning slides
    const width = 1080 / scale;
    const height = 1350 / scale;
    const widthTotal = width * postCount;
    const primaryColors = ["#b94750", "#ccaa3a", "#f37047"];
    const randomPrimaryColor =
        primaryColors[Math.floor(Math.random() * primaryColors.length)];

    return (
        <div className="bg-black min-h-screen flex items-center justify-center overflow-auto w-full">
            <div
                className={`bg-white relative`}
                style={{
                    width: `${widthTotal}px`,
                    height: `${height}px`,
                }}
            >
                {/* looping devider based on postCount */}
                {processedData.map((post, index) => {
                    const flag = Math.round(Math.random() * 1) === 1;
                    return (
                        <div key={index}>
                            <div
                                className="border border-gray-100 h-full bg-gray-200 absolute top-0 z-99 mx-auto"
                                style={{
                                    left: `${((index + 1) * 1080) / scale}px`,
                                }}
                            ></div>
                            {post.tipe_slide !== "MISTERI" &&
                                post.tipe_slide !== "CLOSING" &&
                                post.tipe_slide !== "WARNING_ANSWER" && (
                                    <>
                                        <div
                                            className="absolute top-2 z-99 text-gray-500"
                                            style={{
                                                left: `${
                                                    (index * 1080) / scale
                                                }px`,
                                                width: `${width}px`,
                                                textAlign: "center",
                                            }}
                                        >
                                            <span className="text-xs">
                                                #ByteRiddle
                                            </span>
                                        </div>
                                        <div
                                            className="absolute bottom-2 z-99 text-gray-500"
                                            style={{
                                                left: `${
                                                    (index * 1080) / scale
                                                }px`,
                                                width: `${width}px`,
                                                textAlign: "center",
                                            }}
                                        >
                                            <span className="text-xs">
                                                @ByteUnite.dev
                                            </span>
                                        </div>
                                    </>
                                )}

                            <div
                                className="absolute bottom-2 z-99 text-gray-500"
                                style={{
                                    left: `${(index * 1080) / scale}px`,
                                    width: `${width}px`,
                                    textAlign: "center",
                                }}
                            >
                                <span className="text-xs absolute right-0 bottom-5 -rotate-90 opacity-50">
                                    page <b>{index + 1}</b>
                                </span>
                            </div>

                            {post.tipe_slide === "COVER" && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                            backgroundColor:
                                                index % 2 === 0
                                                    ? "#FFFFFF"
                                                    : "#F3F4F6",
                                        }}
                                        className="flex items-center justify-center overflow-hidden relative flex-col"
                                    >
                                        <CoverEditor
                                            prompt={`${post.prompt_untuk_image}&enhance=true`}
                                            width={width * 2}
                                            height={height * 2}
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                            alt={post.judul_slide}
                                        />
                                        <div className="z-10 px-10">
                                            <h5
                                                className="text-2xl bg-black text-white px-2 tracking-wide inline"
                                                style={{
                                                    backgroundColor:
                                                        randomPrimaryColor,
                                                }}
                                            >
                                                {post.judul_slide}
                                            </h5>
                                            <div className="z-10 w-3/5 leading-0">
                                                <span className="text-xs bg-white opacity-90 tracking-wide inline font-bold">
                                                    {post.sub_judul_slide}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="z-10 leading-5 mt-2 absolute bottom-15 w-2/3 text-center">
                                            <span
                                                className="text-xs bg-white opacity-80 tracking-wide inline text-gray-500"
                                                dangerouslySetInnerHTML={{
                                                    __html: `${" "}${
                                                        post.konten_slide
                                                    }${" "}`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {post.tipe_slide === "MISTERI" && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                        }}
                                        className="flex items-center justify-center overflow-visible relative flex-col bg-white"
                                    >
                                        {flag ? (
                                            <>
                                                <ClickableImage
                                                    prompt={
                                                        post.prompt_untuk_image ||
                                                        ""
                                                    }
                                                    width={width * 2}
                                                    height={height * 2}
                                                    className="absolute -top-15 -right-30 object-cover z-999 opacity-70 colorized"
                                                    style={{
                                                        filter: `brightness(1.05) contrast(1.3)`,
                                                        mixBlendMode:
                                                            "multiply",
                                                        width: `${
                                                            60 +
                                                            Math.ceil(
                                                                Math.random() *
                                                                    2
                                                            ) *
                                                                10
                                                        }%`,
                                                    }}
                                                    alt={post.judul_slide}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                {" "}
                                                <ClickableImage
                                                    prompt={
                                                        post.prompt_untuk_image ||
                                                        ""
                                                    }
                                                    width={width * 2}
                                                    height={height * 2}
                                                    className="absolute -bottom-15 -right-30 object-cover z-999 opacity-70"
                                                    style={{
                                                        filter: `brightness(1.05) contrast(1.3)`,
                                                        mixBlendMode:
                                                            "multiply",
                                                        width: `${
                                                            60 +
                                                            Math.ceil(
                                                                Math.random() *
                                                                    2
                                                            ) *
                                                                10
                                                        }%`,
                                                    }}
                                                    alt={post.judul_slide}
                                                />
                                            </>
                                        )}

                                        <div className="z-10 w-full h-full flex flex-col items-center justify-center -mt-10">
                                            <div className="m-auto w-64 relative">
                                                <div className="mb-1 z-10 relative">
                                                    <span className="bg-gray-600 text-white px-2 text-xs py-1 mb-1">
                                                        {post.judul_slide}
                                                    </span>
                                                </div>
                                                <h6 className="text-2xl text-gray-600 tracking-wide inline leading-6 z-10 relative">
                                                    {post.sub_judul_slide}
                                                </h6>
                                                <div className="z-10 w-full leading-5 mt-2">
                                                    <span
                                                        className="text-xs bg-white opacity-75 tracking-wide inline text-gray-500"
                                                        dangerouslySetInnerHTML={{
                                                            __html: post.konten_slide,
                                                        }}
                                                    />
                                                </div>
                                                {!flag ? (
                                                    <>
                                                        <RandomShape
                                                            fillColor={
                                                                randomPrimaryColor
                                                            }
                                                            strokeColor={
                                                                randomPrimaryColor
                                                            }
                                                            className="absolute -top-10 -left-10 w-32 h-32 opacity-30 z-0"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <RandomShape
                                                            fillColor={
                                                                "transparent"
                                                            }
                                                            strokeColor={
                                                                randomPrimaryColor
                                                            }
                                                            isBottom={true}
                                                            className="absolute -bottom-[70px] -left-[50px] w-32 h-32 opacity-30 z-0"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {(post.tipe_slide === "SOLUSI" ||
                                post.tipe_slide === "FINAL") && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                        }}
                                        className="flex items-center justify-center overflow-visible relative flex-col bg-white"
                                    >
                                        <div className="z-10 w-full h-full flex flex-col items-center justify-center">
                                            <div className="m-auto w-64">
                                                {/* circle with icon */}
                                                <div
                                                    className="rounded-full text-white w-14 h-14 flex items-center justify-center mb-4"
                                                    style={{
                                                        backgroundColor:
                                                            randomPrimaryColor,
                                                    }}
                                                >
                                                    {post.tipe_slide ===
                                                        "FINAL" && (
                                                        <UserPlus className="text-5xl" />
                                                    )}
                                                    {post.tipe_slide ===
                                                        "SOLUSI" && <Feather />}
                                                </div>
                                                <div className="mb-1">
                                                    <span
                                                        className={` text-white px-2 text-xs py-1 mb-1`}
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    >
                                                        {post.judul_slide}
                                                    </span>
                                                </div>
                                                <h5 className="text-2xl text-gray-600 tracking-wide inline leading-6">
                                                    {post.sub_judul_slide}
                                                </h5>
                                                <div className="z-10 w-full leading-5 mt-2">
                                                    <span
                                                        className="text-xs bg-white opacity-75 tracking-wide inline text-gray-500"
                                                        dangerouslySetInnerHTML={{
                                                            __html: post.konten_slide,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {post.tipe_slide === "CLOSING" && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                        }}
                                        className="flex items-center justify-center overflow-visible relative flex-col bg-white"
                                    >
                                        <div className="absolute h-1/2 top-0 left-0 right-0 flex justify-center z-40">
                                            <ClickableImage
                                                prompt={
                                                    post.prompt_untuk_image ||
                                                    ""
                                                }
                                                width={width}
                                                height={height}
                                                className="object-contain z-999 opacity-70 h-full"
                                                style={{
                                                    mixBlendMode: "multiply",
                                                    width: `${
                                                        60 +
                                                        Math.ceil(
                                                            Math.random() * 2
                                                        ) *
                                                            10
                                                    }%`,
                                                }}
                                                alt={post.judul_slide}
                                            />
                                        </div>
                                        <div className="z-50 w-full flex flex-col items-center justify-center">
                                            <div
                                                className="m-auto w-64 absolute bottom-20"
                                                style={{ zIndex: 99 }}
                                            >
                                                <div className="mb-1">
                                                    <span
                                                        className={` text-white px-2 text-xs py-1 mb-1`}
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    >
                                                        {post.judul_slide}
                                                    </span>
                                                </div>
                                                <h5 className="text-2xl text-gray-600 tracking-wide inline leading-6">
                                                    {post.sub_judul_slide}
                                                </h5>
                                                <div className="z-10 w-full leading-5 mt-2">
                                                    <span
                                                        className="text-xs bg-white opacity-75 tracking-wide inline text-gray-500"
                                                        dangerouslySetInnerHTML={{
                                                            __html: post.konten_slide,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* 
                                Layout untuk slide WARNING_ANSWER 
                                Design simple dengan:
                                - Background gradient dari primary color
                                - Icon peringatan besar di tengah
                                - Text center alignment
                                - Minimal distraction
                            */}
                            {post.tipe_slide === "WARNING_ANSWER" && (
                                <>
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                            left: `${(index * 1080) / scale}px`,
                                            position: "absolute",
                                            background: "white",
                                        }}
                                        className="flex items-center justify-center overflow-hidden relative flex-col"
                                    >
                                        {/* Icon warning besar sebagai focal point */}
                                        <div
                                            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                            style={{
                                                opacity: 0.2,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: randomPrimaryColor,
                                                }}
                                            >
                                                <Search className="w-[100px] h-[100px]" />
                                            </span>
                                        </div>

                                        {/* Content area */}
                                        <div className="z-10 w-full h-full flex flex-col items-center justify-center px-10 mt-5">
                                            <div className="text-center space-y-4">
                                                {/* Title dengan border styling */}
                                                <div
                                                    className="inline-block px-2 py-1"
                                                    style={{
                                                        backgroundColor:
                                                            randomPrimaryColor,
                                                    }}
                                                >
                                                    <span
                                                        className="text-sm font-bold tracking-wide"
                                                        style={{
                                                            color: "white",
                                                        }}
                                                    >
                                                        {post.judul_slide}
                                                    </span>
                                                </div>

                                                {/* Subtitle */}
                                                <div className="mt-6">
                                                    <p className="text-lg text-gray-700 font-semibold leading-5">
                                                        {post.sub_judul_slide}
                                                    </p>
                                                </div>

                                                {/* Content dengan box */}
                                                <div className="mt-4 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-lg max-w-xs mx-auto">
                                                    <p
                                                        className="text-sm text-gray-600"
                                                        dangerouslySetInnerHTML={{
                                                            __html: post.konten_slide,
                                                        }}
                                                    />
                                                </div>

                                                {/* Decorative line */}
                                                <div className="mt-8 flex items-center justify-center space-x-2">
                                                    <div
                                                        className="h-1 w-12 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="h-1 w-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="h-1 w-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    ></div>
                                                    <div
                                                        className="h-1 w-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                randomPrimaryColor,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            <style>{` 
                em, b, h6 { color: ${randomPrimaryColor};
                h6 { font-weight: bold; }
            } `}</style>
        </div>
    );
}
