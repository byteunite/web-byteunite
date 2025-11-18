# Markdown Rendering dalam Video Script

## 🎨 Fitur Markdown Rendering

Component `DownloadSlidesButton` sekarang mendukung rendering markdown formatting untuk membuat script lebih mudah dibaca dan lebih menarik secara visual.

## ✨ Supported Formatting

### 1. **Bold Text** (`**text**`)
**Input dari AI:**
```
**Penting!** Jangan skip bagian ini.
```

**Rendered di UI:**
- **Penting!** akan tampil dengan font bold dan warna lebih gelap
- Class: `font-bold text-gray-900`

### 2. *Italic Text* (`*text*`)
**Input dari AI:**
```
*Tips:* Lakukan ini setiap hari untuk hasil maksimal.
```

**Rendered di UI:**
- *Tips:* akan tampil dengan font italic
- Class: `italic text-gray-700`

### 3. [Visual Cues] (`[text]`)
**Input dari AI:**
```
[Close up ke wajah] Halo guys! [Zoom out]
```

**Rendered di UI:**
- Visual cues tampil sebagai badges/pills
- Background: purple-100
- Text: purple-700
- Rounded corners dengan padding
- Class: `inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium`

## 📝 Contoh Lengkap

### Script dari AI
```
[Close up] **Eh, tau gak sih?** [pause] *90% developer* masih salah di hal ini!

Halo guys! Hari ini gue mau bahas tentang **clean code** yang sering diremehkan.

[Cut ke visual] Pertama, *naming convention*. Jangan asal kasih nama ya! [Tunjuk ke teks]

[Transition] Kedua, **function should do one thing**. One thing aja! Simple kan?

[Close up] Jadi intinya, *clean code = happy developer*.
```

### Rendered di UI

<img src="./docs/images/script-markdown-example.png" alt="Markdown Rendering Example" width="600"/>

Visual representation:
```
[Close up] Eh, tau gak sih? [pause] 90% developer masih salah di hal ini!
   ^^^^^     ^^^^^^^^^^^^           ^^^^^^^^^^
  purple      bold text            italic text
  badge

Halo guys! Hari ini gue mau bahas tentang clean code yang sering diremehkan.
                                               ^^^^^^^^^^
                                               bold text

[Cut ke visual] Pertama, naming convention. Jangan asal kasih nama ya! [Tunjuk ke teks]
^^^^^^^^^^^^^^            ^^^^^^^^^^^^^^^^^                            ^^^^^^^^^^^^^^^
purple badge              italic text                                 purple badge
```

## 🎯 Tips Section Rendering

### Input
```json
{
  "tips": [
    "**Speak natural**, jangan robotic - be yourself!",
    "*Practice* beberapa kali sebelum recording",
    "Gunakan **visual cues** untuk [shot variety]"
  ]
}
```

### Rendered Output
```
Tips for Delivery:

• Speak natural, jangan robotic - be yourself!
  ^^^^^^^^^^^^
  bold text

• Practice beberapa kali sebelum recording
  ^^^^^^^^
  italic text

• Gunakan visual cues untuk [shot variety]
          ^^^^^^^^^^^^        ^^^^^^^^^^^^^
          bold text           purple badge
```

## 🔧 Technical Implementation

### renderMarkdown Function
```typescript
function renderMarkdown(text: string): React.ReactNode {
    // Split by line breaks
    const lines = text.split('\n');
    
    // Regex untuk match patterns
    const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\])/g;
    
    // Process each pattern:
    // **text** → <strong className="font-bold text-gray-900">text</strong>
    // *text*   → <em className="italic text-gray-700">text</em>
    // [text]   → <span className="...purple badge...">text</span>
}
```

### Styling Classes

#### Bold Text
```css
font-bold text-gray-900
```
- Font weight: 700 (bold)
- Color: Dark gray (#111827)

#### Italic Text
```css
italic text-gray-700
```
- Font style: italic
- Color: Medium gray (#374151)

#### Visual Cues (Badges)
```css
inline-flex items-center px-2 py-0.5 rounded 
bg-purple-100 text-purple-700 text-xs font-medium
```
- Display: inline-flex
- Background: Light purple (#F3E8FF)
- Text: Dark purple (#7E22CE)
- Size: Extra small (12px)
- Font weight: 500 (medium)

## 💡 Usage Best Practices

### For AI Prompts
Pastikan prompt AI menghasilkan markdown formatting:

```typescript
const systemMessage = `
Output should include markdown formatting:
- Use **bold** for emphasis on important points
- Use *italic* for notes or secondary information
- Use [brackets] for visual cues and directions
`;
```

### For Script Writers
When manually creating scripts:

✅ **DO:**
- `**Hook kuat** di awal video`
- `*Tips:* Lakukan ini`
- `[Close up] untuk emphasis`

❌ **DON'T:**
- `***Triple asterisk***` (tidak supported)
- `__Underscore bold__` (gunakan asterisk)
- `{Curly brackets}` (gunakan square brackets)

## 🎬 Example Use Cases

### Hook Section
```
[Close up ke wajah] **Eh, tau gak sih?** [pause] *90% orang* gagal di hal ini!
```
- Visual cue badges untuk direction
- Bold untuk hook yang kuat
- Italic untuk statistik

### Tips Section
```
**Speak natural** - jangan robotic
*Practice* delivery sebelum recording
Gunakan [visual cues] untuk variety
```
- Bold untuk action items
- Italic untuk additional context
- Badges untuk technical terms

## 🚀 Benefits

1. **Better Readability**
   - Script lebih mudah di-scan
   - Important points stand out
   - Visual cues clearly marked

2. **Professional Look**
   - Clean, modern formatting
   - Consistent styling
   - Better UX

3. **Easier to Follow**
   - Content creators bisa quick-read
   - Visual cues jelas terpisah
   - Hierarchy information lebih jelas

## 📱 Responsive Design

Markdown rendering works seamlessly across:
- Desktop (large screens)
- Tablet (medium screens)
- Mobile (small screens)

Line breaks dan badges automatically wrap untuk maintain readability.

## 🔄 Future Enhancements

Potential additions:
- `~~Strikethrough~~` untuk deleted/changed content
- `> Blockquote` untuk important notes
- `- Bullet lists` untuk structured content
- `` `Code snippets` `` untuk technical terms

---

**Last Updated**: November 2024  
**Version**: 1.1.0
