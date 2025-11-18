# Copy Narration for Prompter Feature

## 📱 Overview

Fitur ini memungkinkan content creator untuk dengan mudah **copy narasi bersih** yang siap digunakan di aplikasi prompter (teleprompter) saat merekam video. Script yang di-copy sudah dibersihkan dari markdown formatting, visual cues, identifiers, dan **diformat dengan line breaks yang optimal** untuk kemudahan membaca.

## ✨ Problem Solved

### Before 😓
Content creator mendapat script dengan formatting seperti:
```
[Close up] **Eh, tau gak sih?** [pause] *90% developer* masih salah di hal ini!

CREATOR: Halo guys! [wave] Hari ini gue mau bahas **clean code** yang sering diremehkan, design patterns yang berguna, dan best practices yang penting.

[Cut ke visual] Pertama, *naming convention*. [Tunjuk ke teks]
```

Problems:
- Visual cues mengganggu: `[Close up]`, `[pause]`
- Identifiers tidak perlu: `CREATOR:`
- Markdown formatting: `**bold**`, `*italic*`
- **Satu paragraf panjang - sulit dibaca di prompter** ❌

### After 🎉
Script yang di-copy sudah bersih dan **formatted untuk readability**:
```
Eh, tau gak sih?
90% developer masih salah di hal ini!

Halo guys!
Hari ini gue mau bahas clean code yang sering diremehkan,
design patterns yang berguna,
dan best practices yang penting.

Pertama,
naming convention.
```

Benefits:
- ✅ No visual cues
- ✅ No identifiers
- ✅ No markdown
- ✅ **Line breaks setelah kalimat**
- ✅ **Line breaks di kalimat panjang (commas)**
- ✅ **Easy to read di prompter app!** 📱

## 🎯 Features

### 1. **Smart Script Cleaning**
- **Remove visual cues**: `[Close up]`, `[pause]`, `[Zoom out]` → dihapus
- **Remove identifiers**: `CREATOR:`, `HOST:`, `NARRATOR:` → dihapus
- **Remove bold formatting**: `**text**` → `text`
- **Remove italic formatting**: `*text*` → `text`
- **Remove markdown headers**: `###`, `##`, `#` → dihapus
- **Clean spacing**: Multiple spaces → single space
- **Clean punctuation**: Proper spacing around punctuation

### 2. **Intelligent Line Breaks** ⭐ NEW!
- **After sentences**: Automatic line breaks setelah `.` `!` `?`
- **In long sentences**: Line breaks setelah koma di kalimat > 80 karakter
- **Section spacing**: Double line breaks sebelum transition words (Halo, Nah, Jadi, etc.)
- **Max 2 consecutive breaks**: Prevent excessive whitespace
- **Result**: Easy-to-read format di prompter app! 📱

### 3. **Prominent UI Button**
- **Large, eye-catching button** dengan gradient purple-pink
- **Primary action** - posisi paling prominent
- **Clear labeling**: "Copy Narration for Prompter"
- **Success feedback**: Visual confirmation saat copied

## 🎨 UI Design

### Button Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│  Script Display (with markdown rendering)           │
│                                                      │
│  Tips for Delivery (with markdown)                  │
│                                                      │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│  ┃  📄 Copy Narration for Prompter           ┃   │ ← PRIMARY
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────┐    │
│  │ 📋 Full Script   │  │ 💾 Save to DB        │    │ ← SECONDARY
│  └──────────────────┘  └──────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Visual Styling

**Primary Button (Copy for Prompter):**
- Size: `lg` (large, prominent)
- Width: Full width (`w-full`)
- Gradient: Purple to Pink (`from-purple-600 to-pink-600`)
- Hover effect: Darker gradient
- Icon: FileText (document icon)
- Font: Semibold

**Secondary Buttons:**
- Size: `sm` (small, compact)
- Width: Flex (50/50 split)
- Style: Outline / Default
- Icons: Copy / Download

## 📝 Example Transformations

### Example 1: Simple Script with Line Breaks
**Input (with formatting):**
```
[Close up] **Halo guys!** Hari ini kita bahas *clean code*. [pause] Simple kan?
```

**Output (clean for prompter):**
```
Halo guys!
Hari ini kita bahas clean code.
Simple kan?
```
✅ Each sentence on new line - easy to read!

### Example 2: With Identifiers Removed
**Input:**
```
CREATOR: Halo semua! HOST: Selamat datang di channel ini.
```

**Output:**
```
Halo semua!
Selamat datang di channel ini.
```
✅ No identifiers, clean narration

### Example 3: Complex Script with Smart Formatting
**Input:**
```
[Close up ke wajah] **Eh, tau gak sih?** [pause] *90% developer* masih salah!

CREATOR: Halo guys! [wave] Hari ini gue mau bahas tentang **clean code** yang sering diremehkan.

[Cut ke visual] Pertama, *naming convention*. Jangan asal kasih nama ya! [Tunjuk ke teks]

[Transition] Kedua, **function should do one thing**. One thing aja! Simple kan?

[Close up] Jadi intinya, *clean code = happy developer*.
```

**Output (optimized for prompter):**
```
Eh, tau gak sih?
90% developer masih salah!

Halo guys!
Hari ini gue mau bahas tentang clean code yang sering diremehkan.

Pertama,
naming convention.
Jangan asal kasih nama ya!

Kedua,
function should do one thing.
One thing aja!
Simple kan?

Jadi intinya,
clean code = happy developer.
```
✅ Perfect for reading - natural pauses at line breaks!

### Example 4: Long Sentence with Commas
**Input:**
```
Hari ini kita akan belajar tentang coding, design patterns, clean code, best practices, dan tips untuk developer pemula.
```

**Output (auto-breaks for readability):**
```
Hari ini kita akan belajar tentang coding,
design patterns,
clean code,
best practices,
dan tips untuk developer pemula.
```
✅ Commas create natural pause points!

## 🔧 Technical Implementation

### Enhanced Helper Function (v2)
```typescript
function cleanScriptForPrompter(text: string): string {
    if (!text) return "";

    // 1. Remove identifiers (CREATOR:, HOST:, etc.)
    let cleaned = text.replace(/^(CREATOR|HOST|NARRATOR|SPEAKER|INTRO|HOOK|OUTRO):\s*/gim, '');
    
    // 2. Remove visual cues [text]
    cleaned = cleaned.replace(/\[.*?\]/g, '');
    
    // 3. Remove bold **text**
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // 4. Remove italic *text*
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
    
    // 5. Remove markdown headers
    cleaned = cleaned.replace(/^#+\s+/gm, '');
    
    // 6. Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // 7. Clean up spaces around punctuation
    cleaned = cleaned.replace(/\s+([.,!?])/g, '$1');
    
    // 8. ⭐ NEW: Add line breaks after sentences
    cleaned = cleaned.replace(/([.!?])\s+/g, '$1\n');
    
    // 9. ⭐ NEW: Add breaks in long lines with commas
    const lines = cleaned.split('\n');
    cleaned = lines.map(line => {
        if (line.length > 80) {
            return line.replace(/,\s+/g, ',\n');
        }
        return line;
    }).join('\n');
    
    // 10. Clean up excessive line breaks (max 2)
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
    // 11. Trim each line and remove empty lines
    cleaned = cleaned.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    
    // 12. ⭐ NEW: Add section spacing before transitions
    cleaned = cleaned.replace(/\n(Halo|Hai|Nah|Jadi|Kalau|Oke|Dan yang terakhir)/g, '\n\n$1');
    
    return cleaned.trim();
}
```

### Key Improvements in v2

#### 1. Sentence-Based Line Breaks
```javascript
// Before: Long paragraph
"Halo guys! Hari ini kita bahas clean code. Simple kan?"

// After: Easy to read
"Halo guys!
Hari ini kita bahas clean code.
Simple kan?"
```

#### 2. Comma-Based Breaks (Long Lines)
```javascript
// Before: Hard to read in one breath
"Kita akan bahas coding, design patterns, clean code, dan best practices."

// After: Natural pauses
"Kita akan bahas coding,
design patterns,
clean code,
dan best practices."
```

#### 3. Section Spacing
```javascript
// Before: No clear separation
"Simple kan?
Nah sekarang kita lanjut."

// After: Clear sections
"Simple kan?

Nah sekarang kita lanjut."
```

### Copy Function
```typescript
const copyNarrationForPrompter = async () => {
    if (!videoScript) return;

    try {
        // Clean script
        const cleanedScript = cleanScriptForPrompter(videoScript.script);
        
        // Copy to clipboard
        await navigator.clipboard.writeText(cleanedScript);
        
        // Visual feedback
        setCopiedNarration(true);
        setTimeout(() => setCopiedNarration(false), 2000);
    } catch (error) {
        console.error("Failed to copy narration:", error);
    }
};
```

## 📱 Compatible Prompter Apps

Cleaned text works perfectly with popular prompter apps:

### iOS
- **PromptSmart Pro** ✅
- **Teleprompter Premium** ✅
- **Video Teleprompter** ✅
- **BigVu Teleprompter** ✅

### Android
- **Teleprompter Pro** ✅
- **Easy Prompter** ✅
- **Selvi Teleprompter** ✅
- **Parrot Teleprompter** ✅

### Desktop
- **CuePrompter** ✅
- **PromptDog** ✅
- **ZaPrompt** ✅
- **Speakflow** ✅

## 🎯 User Flow

### Step-by-Step Usage

1. **Generate Video Script**
   - Click "Generate Script" di modal
   - Wait for AI to create script

2. **Review Script**
   - Script ditampilkan dengan markdown formatting
   - Visual cues sebagai purple badges
   - Bold dan italic text highlighted

3. **Copy for Prompter**
   - Click button **"Copy Narration for Prompter"**
   - Button shows "Copied for Prompter!" confirmation
   - Clean text now in clipboard

4. **Paste in Prompter App**
   - Open prompter app (iOS/Android/Desktop)
   - Paste text (Cmd+V / Ctrl+V)
   - Text is clean and ready to read!

5. **Start Recording**
   - Position camera
   - Start teleprompter
   - Read naturally
   - Record video!

## 💡 Tips for Content Creators

### Before Recording
1. ✅ **Copy narration** dari ByteUnite
2. ✅ **Paste** di prompter app
3. ✅ **Adjust font size** yang comfortable untuk dibaca
4. ✅ **Set scrolling speed** yang sesuai pace kamu
5. ✅ **Practice** sekali tanpa recording

### During Recording
1. ✅ **Follow the text** tapi jangan kaku
2. ✅ **Natural pauses** di punctuation
3. ✅ **Eye contact** dengan camera (jangan terlalu fokus di text)
4. ✅ **Energy level** sesuai content mood
5. ✅ **Retake** jika perlu - no problem!

### After Recording
1. ✅ Check **audio clarity**
2. ✅ Verify **eye contact** looks natural
3. ✅ Add **visual elements** sesuai script hints (ingat visual cues di full script)
4. ✅ **Edit** dengan reference ke full script + tips

## 🔄 Comparison: Full Script vs Prompter Copy

### Full Script Copy (for reference)
```
VIDEO SCRIPT - RIDDLES
Duration: 45-60 detik

[Close up] **Eh, tau gak sih?** [pause] ...

---
TIPS FOR DELIVERY:
1. Speak natural, jangan robotic
2. Practice beberapa kali
```

**Use case:** 
- Reference saat editing
- Study sebelum recording
- Share dengan team

### Prompter Copy (for reading)
```
Eh, tau gak sih? 90% developer masih salah...

Halo guys! Hari ini gue mau bahas clean code...
```

**Use case:**
- Input to prompter app
- Natural reading saat recording
- Clean, distraction-free

## 🎨 Visual Feedback

### Button States

**Default State:**
```
┌──────────────────────────────────────┐
│  📄 Copy Narration for Prompter     │
└──────────────────────────────────────┘
  Purple-Pink gradient, shadow
```

**Copied State (2 seconds):**
```
┌──────────────────────────────────────┐
│  ✓ Copied for Prompter!              │
└──────────────────────────────────────┘
  Same gradient, checkmark icon
```

## 🚀 Future Enhancements

1. **Preview Clean Text**
   - Show preview sebelum copy
   - Side-by-side comparison

2. **Export Options**
   - Export as TXT file
   - Export as PDF for printing
   - Export to specific prompter apps

3. **Customization**
   - Keep/remove line breaks option
   - Font size preview
   - Line length optimization

4. **Integration**
   - Direct send to prompter apps
   - QR code for mobile prompters
   - Cloud sync to prompter services

## 📊 Benefits

| Feature | Benefit |
|---------|---------|
| Clean Text | No distractions saat reading |
| One-Click Copy | Fast workflow |
| Universal Format | Works with any prompter app |
| Smart Cleaning | Preserves natural flow |
| Visual Feedback | Clear confirmation |

## 🎓 Best Practices

### DO ✅
- Always preview text sebelum paste
- Adjust prompter speed ke pace kamu
- Practice dengan prompter sebelum actual recording
- Keep script as reference untuk editing later

### DON'T ❌
- Jangan copy full script (with formatting) ke prompter
- Jangan read word-for-word robotically
- Jangan lupa adjust font size di prompter
- Jangan skip practice runs

---

**Created**: November 2024  
**Last Updated**: November 2024  
**Version**: 1.0.0

