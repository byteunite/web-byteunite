# Feature: CV Upload & AI Parsing untuk Programmer

## 📋 Overview

Fitur ini memungkinkan admin untuk dengan mudah menambahkan data programmer hanya dengan mengupload CV dalam format PDF. Sistem akan otomatis membaca teks dari CV dan menggunakan AI Gemini untuk mengekstrak data menjadi format yang terstruktur sesuai dengan database programmer.

## ✨ Fitur Utama

1. **Upload CV PDF** - Admin dapat mengupload file CV dalam format PDF (maksimal 5MB)
2. **Ekstraksi Teks Otomatis** - Sistem otomatis membaca teks dari PDF menggunakan `pdf-parse`
3. **AI-Powered Parsing** - Gemini AI menganalisis CV dan mengekstrak informasi penting
4. **Auto-Fill Form** - Data yang diekstrak otomatis mengisi form programmer
5. **Review & Edit** - Admin dapat mereview dan mengedit data sebelum menyimpan

## 🗂️ Struktur File

### 1. Library: `/lib/gemini-cv-parser.ts`

Service untuk parsing CV menggunakan Gemini AI.

**Fungsi Utama:**

-   `parseCVWithGemini(cvText: string): Promise<ParsedProgrammerData>`

**Input:** Teks yang diekstrak dari CV PDF

**Output:** Data programmer yang terstruktur dengan format:

```typescript
{
  name: string;
  role: string;
  location: string;
  email: string;
  bio: string;
  fullBio: string;
  stack: string[];
  category: "frontend" | "backend" | "fullstack" | "mobile" | "devops" | "data";
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
  skills: Array<{ name: string; level: number }>;
  recentProjects: Array<{...}>;
  avatar: string;
}
```

**AI Model:** `gemini-2.5-flash` dengan temperature 0.3 untuk hasil konsisten

### 2. API Endpoint: `/app/api/programmers/parse-cv/route.ts`

**Endpoint:** `POST /api/programmers/parse-cv`

**Request:**

-   Method: `POST`
-   Content-Type: `multipart/form-data`
-   Body: FormData dengan file PDF (`file` field)

**Validasi:**

-   File type: Hanya PDF (`application/pdf`)
-   File size: Maksimal 5MB
-   Text content: Minimal 100 karakter

**Response Success (200):**

```json
{
    "success": true,
    "message": "CV parsed successfully",
    "data": {
        /* ParsedProgrammerData */
    },
    "extractedText": "First 500 chars of CV text..."
}
```

**Response Error:**

-   400: Invalid file type, size, or empty text
-   500: Server error or AI parsing failure

### 3. UI Component: `/app/(protected)/list-programmers/page.tsx`

**Perubahan:**

1. Menambahkan state untuk CV upload:

    - `cvFile: File | null`
    - `isParsing: boolean`
    - `cvParseError: string | null`

2. Menambahkan tab baru "Upload CV" (total 3 tabs):

    - Form Input
    - JSON Input
    - **Upload CV** (NEW)

3. Fungsi baru:
    - `handleCVFileChange()` - Handle file selection
    - `handleParseCV()` - Upload dan parse CV dengan AI
    - `handleClearCV()` - Clear file selection

**Flow:**

1. User klik tab "Upload CV"
2. User pilih file PDF (drag & drop atau button)
3. User klik "Parse CV with AI"
4. System upload file ke API endpoint
5. API ekstrak teks dari PDF
6. Gemini AI parse teks menjadi data terstruktur
7. Data otomatis mengisi form
8. User switch ke tab "Form Input" untuk review
9. User edit jika perlu
10. User klik "Create Programmer"

## 🚀 Cara Penggunaan

### Untuk Admin:

1. Buka halaman **Programmers Management** (`/list-programmers`)
2. Klik tombol **"Add New Programmer"**
3. Pilih tab **"Upload CV"**
4. Klik **"Choose PDF File"** atau drag & drop file PDF
5. Klik **"Parse CV with AI"** dan tunggu proses parsing (10-30 detik)
6. Setelah berhasil, sistem otomatis pindah ke tab **"Form Input"**
7. Review data yang telah diekstrak
8. Edit jika ada yang perlu diperbaiki
9. Klik **"Create Programmer"** untuk menyimpan

### Tips:

-   Gunakan CV dengan format yang jelas dan terstruktur
-   Pastikan CV berisi informasi lengkap (nama, role, email, lokasi minimal)
-   File PDF tidak boleh di-password atau berupa scan gambar saja
-   Jika parsing gagal, Anda tetap bisa input manual via tab "Form Input"

## 🛠️ Dependencies

**NPM Packages:**

-   `pdf-parse-fork@1.2.0` - Ekstraksi teks dari PDF (fork yang lebih kompatibel dengan ESM)
-   `@google/genai` - Gemini AI SDK (sudah ada)

**Install:**

```bash
pnpm add pdf-parse-fork
```

**Note:** Kami menggunakan `pdf-parse-fork` sebagai pengganti `pdf-parse` karena lebih kompatibel dengan ES Modules dan Next.js.

## 🔧 Environment Variables

Pastikan `GEMINI_API_KEY` sudah diset di `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📝 Prompt Engineering

AI Gemini menggunakan system instruction yang terstruktur untuk ekstraksi data:

**Key Points:**

1. Ekstrak SEMUA informasi yang tersedia di CV
2. Jika ada field yang tidak ada, gunakan nilai default yang masuk akal
3. Kategori programmer dipilih berdasarkan skill dan role
4. Skills dikonversi ke array dengan level estimasi
5. Output harus JSON yang valid tanpa markdown code blocks

**Temperature:** 0.3 (lebih rendah untuk hasil konsisten)

**Model:** gemini-2.5-flash (balance antara speed dan accuracy)

## 🐛 Error Handling

### PDF Parsing Errors:

-   Empty PDF atau scan-only image
-   Password-protected PDF
-   Corrupted PDF file
-   Text terlalu pendek (< 100 chars)

### AI Parsing Errors:

-   JSON invalid dari AI response
-   Missing required fields
-   API rate limit atau timeout
-   GEMINI_API_KEY tidak valid

**User-Friendly Messages:**
Semua error ditampilkan dengan toast notification yang jelas dan actionable.

## 🔐 Security

1. **File Validation:**

    - Type check: Hanya PDF
    - Size check: Max 5MB
    - Content check: Minimal text length

2. **API Security:**

    - Server-side validation
    - Proper error handling
    - No file storage (process in-memory)

3. **Data Sanitization:**
    - Trim whitespaces
    - Validate email format
    - Sanitize URLs
    - Default values untuk field kosong

## 🎯 Future Enhancements

1. **Multi-format Support:**

    - Support DOCX format
    - Support image-based CV (OCR)

2. **Batch Upload:**

    - Upload multiple CVs at once
    - Bulk import dengan review

3. **AI Improvements:**

    - Better skill level estimation
    - Automatic category detection
    - Extract more details (education, awards, etc.)

4. **UI/UX:**
    - Drag & drop zone
    - Upload progress indicator
    - Preview extracted text
    - Side-by-side comparison

## 📊 Testing

### Test Cases:

1. ✅ Upload valid PDF CV
2. ✅ Upload invalid file type (should reject)
3. ✅ Upload large file > 5MB (should reject)
4. ✅ Upload empty PDF (should reject)
5. ✅ Upload CV with minimal info (should use defaults)
6. ✅ Upload CV with complete info (should extract all)
7. ✅ Parse error handling
8. ✅ Form auto-fill after successful parse
9. ✅ Edit parsed data before save
10. ✅ Clear file selection

## 📞 Support

Jika ada masalah:

1. Cek console browser untuk error details
2. Cek server logs untuk API errors
3. Pastikan GEMINI_API_KEY valid
4. Pastikan CV PDF valid dan readable

---

**Created:** December 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
