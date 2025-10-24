# Gemini Imagen API Usage Guide

## REST API Endpoint untuk Generate Image

Endpoint ini menggunakan Gemini's Imagen 3.0 untuk menghasilkan gambar berdasarkan text prompt.

### Endpoint

-   **URL**: `/api/route` (atau sesuaikan dengan struktur routing Anda)
-   **Method GET**: Menampilkan dokumentasi API
-   **Method POST**: Generate image

---

## POST - Generate Image

### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
    "prompt": "A single egg, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation",
    "numberOfImages": 1,
    "aspectRatio": "1:1"
}
```

**Parameters:**

-   `prompt` (required, string): Deskripsi detail gambar yang ingin di-generate
-   `numberOfImages` (optional, number): Jumlah gambar yang akan di-generate (1-4, default: 1)
-   `aspectRatio` (optional, string): Rasio aspek gambar. Pilihan: `"1:1"`, `"3:4"`, `"4:3"`, `"9:16"`, `"16:9"` (default: `"1:1"`)

### Response

**Success (200):**

```json
{
    "success": true,
    "prompt": "A single egg...",
    "numberOfImages": 1,
    "aspectRatio": "1:1",
    "images": [
        {
            "image": {
                // Gemini Image object
            }
        }
    ]
}
```

**Error (400):**

```json
{
    "error": "Prompt is required and must be a string"
}
```

**Error (500):**

```json
{
    "error": "Failed to generate image",
    "message": "Error details..."
}
```

---

## Contoh Penggunaan

### JavaScript/TypeScript (Frontend)

```typescript
async function generateImage() {
    const response = await fetch("/api/route", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: "A magnifying glass, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF",
            numberOfImages: 2,
            aspectRatio: "1:1",
        }),
    });

    const data = await response.json();

    if (data.success) {
        console.log("Generated images:", data.images);
        // Process images here
    } else {
        console.error("Error:", data.error);
    }
}
```

### cURL

```bash
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A kitchen timer, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF",
    "numberOfImages": 1,
    "aspectRatio": "1:1"
  }'
```

---

## Environment Variables

Pastikan `GEMINI_API_KEY` sudah di-set di file `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Tips Prompt untuk Hasil Terbaik

1. **Gunakan deskripsi yang detail dan spesifik**
2. **Sebutkan style visual yang diinginkan** (contoh: black and white photography, rasterize effect)
3. **Tentukan komposisi** (contoh: centered, small size, dominant white space)
4. **Spesifikasikan background** (contoh: pure white background #FFFFFF)
5. **Gunakan objek konkret**, hindari objek abstrak atau symbol

### Contoh Prompt yang Baik:

```
"A single egg, complete object with no cropping, full view, centered, small size, max 1/3 of space, dominant white space. Black and white photography with strong rasterize effect, prominent halftone dots, screen printing style, high contrast. Isolated on pure white background #FFFFFF, no borders, no frames, clean isolation"
```

### Contoh Prompt yang Kurang Baik:

```
"An egg" // Terlalu singkat dan tidak spesifik
```

---

## Batasan

-   Maximum 4 gambar per request
-   Aspect ratio terbatas pada pilihan yang tersedia
-   Memerlukan GEMINI_API_KEY yang valid
-   Biaya penggunaan sesuai dengan pricing Google AI

---

## Referensi

-   [Gemini Imagen Documentation](https://ai.google.dev/gemini-api/docs/imagen#javascript)
-   [Google GenAI SDK](https://github.com/google/generative-ai-js)
