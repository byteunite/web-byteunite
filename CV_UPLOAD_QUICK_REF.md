# Quick Reference: CV Upload & AI Parser

## 🚀 Quick Start

### Admin Flow (3 Steps):

1. **Upload** → Pilih PDF CV
2. **Parse** → Klik "Parse CV with AI"
3. **Review & Save** → Edit jika perlu, lalu Save

---

## 📋 API Reference

### Endpoint

```
POST /api/programmers/parse-cv
```

### Request

```javascript
const formData = new FormData();
formData.append("file", pdfFile);

const response = await fetch("/api/programmers/parse-cv", {
    method: "POST",
    body: formData,
});

const result = await response.json();
```

### Response

```javascript
{
  success: true,
  message: "CV parsed successfully",
  data: {
    name: "John Doe",
    role: "Senior Frontend Developer",
    email: "john@example.com",
    location: "Jakarta, Indonesia",
    bio: "Experienced developer...",
    stack: ["React", "TypeScript", "Node.js"],
    category: "frontend",
    // ... more fields
  },
  extractedText: "First 500 chars..."
}
```

---

## 🔧 Usage in Code

### Parse CV Function

```typescript
const handleParseCV = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/programmers/parse-cv", {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (result.success) {
        // Use result.data to populate form
        setFormData({
            name: result.data.name,
            role: result.data.role,
            // ... etc
        });
    }
};
```

### Direct Library Usage

```typescript
import { parseCVWithGemini } from "@/lib/gemini-cv-parser";

// After extracting text from PDF
const extractedText = "...CV text content...";
const parsedData = await parseCVWithGemini(extractedText);
```

---

## ⚙️ Configuration

### Environment Variable

```env
GEMINI_API_KEY=your_api_key_here
```

### File Constraints

-   **Type:** PDF only
-   **Size:** Max 5MB
-   **Content:** Min 100 characters

### AI Settings

-   **Model:** gemini-2.5-flash
-   **Temperature:** 0.3 (consistent results)
-   **Max Tokens:** Default (4096+)

---

## 🎨 UI Components

### Upload Button

```tsx
<input type="file" accept="application/pdf" onChange={handleCVFileChange} />
```

### Parse Button

```tsx
<Button onClick={handleParseCV} disabled={isParsing}>
    {isParsing ? "Parsing..." : "Parse CV with AI"}
</Button>
```

### Status Display

```tsx
{
    cvFile && (
        <span>
            {cvFile.name} ({Math.round(cvFile.size / 1024)} KB)
        </span>
    );
}
```

---

## ❌ Error Handling

### Common Errors & Solutions

| Error               | Cause          | Solution              |
| ------------------- | -------------- | --------------------- |
| "Invalid file type" | Not a PDF      | Upload PDF only       |
| "File too large"    | > 5MB          | Compress PDF          |
| "No readable text"  | Scan/Image PDF | Use text-based PDF    |
| "Text too short"    | < 100 chars    | Use detailed CV       |
| "AI parsing failed" | API error      | Retry or manual input |

### Error Display

```tsx
{
    cvParseError && (
        <div className="error">
            <strong>Error:</strong> {cvParseError}
        </div>
    );
}
```

---

## 📊 Extracted Data Structure

### Required Fields (Must Have)

-   ✅ name
-   ✅ role
-   ✅ email
-   ✅ location

### Optional Fields (Auto-filled if missing)

-   bio (default: generated from role)
-   stack (default: [])
-   category (default: "fullstack")
-   rating (default: 4.5)
-   projects (default: 0)
-   experience (default: "1+ years")
-   availability (default: "Open to opportunities")
-   hourlyRate (default: "Negotiable")

### Nested Data

```typescript
skills: Array<{
    name: string;
    level: number; // 0-100
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
```

---

## 🧪 Testing

### Test with cURL

```bash
curl -X POST http://localhost:3000/api/programmers/parse-cv \
  -F "file=@/path/to/cv.pdf"
```

### Manual Test Checklist

-   [ ] Upload valid PDF
-   [ ] Upload non-PDF (should reject)
-   [ ] Upload > 5MB (should reject)
-   [ ] Parse with complete CV
-   [ ] Parse with minimal CV
-   [ ] Review extracted data
-   [ ] Edit and save
-   [ ] Clear file selection

---

## 💡 Pro Tips

1. **Best CV Format:**

    - Clear sections (Education, Experience, Skills)
    - Contact info at top
    - Tech stack clearly listed
    - Project descriptions included

2. **Optimize Performance:**

    - Keep PDF < 2MB for faster upload
    - Use text-based PDFs (not scanned images)
    - Clear formatting without complex layouts

3. **After Parsing:**

    - Always review extracted data
    - Check email format
    - Verify category selection
    - Update avatar URL if needed

4. **Error Recovery:**
    - If parse fails, switch to "Form Input"
    - Use "JSON Input" for bulk data
    - Keep original CV for reference

---

## 🔗 Related Files

-   **Library:** `/lib/gemini-cv-parser.ts`
-   **API:** `/app/api/programmers/parse-cv/route.ts`
-   **UI:** `/app/(protected)/list-programmers/page.tsx`
-   **Model:** `/models/Programmer.ts`

---

## 📝 Code Snippets

### Validate PDF File

```typescript
const validatePDF = (file: File): boolean => {
    if (file.type !== "application/pdf") return false;
    if (file.size > 5 * 1024 * 1024) return false; // 5MB
    return true;
};
```

### Extract Text from PDF

```typescript
import pdfParse from "pdf-parse";

const extractText = async (buffer: Buffer): Promise<string> => {
    const data = await pdfParse(buffer);
    return data.text;
};
```

### Call Gemini AI

```typescript
const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        systemInstruction: systemPrompt,
        temperature: 0.3,
    },
});
```

---

**Last Updated:** December 2024  
**Quick Guide Version:** 1.0
