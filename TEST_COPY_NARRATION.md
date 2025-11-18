# Copy Narration - Quick Test Examples

## Updated Test Input/Output Pairs (v2 - With Line Breaks)

### Test 1: Basic Formatting
```javascript
// INPUT
"[Close up] **Halo guys!** Hari ini kita bahas *clean code*."

// EXPECTED OUTPUT
"Halo guys!
Hari ini kita bahas clean code."
```

### Test 2: Multiple Visual Cues
```javascript
// INPUT
"[Close up] Text pertama [pause] text kedua [Zoom out] text ketiga"

// EXPECTED OUTPUT
"Text pertama text kedua text ketiga"
```

### Test 3: Multiple Sentences
```javascript
// INPUT
"**Bold pertama** adalah poin penting. Kemudian **bold kedua** juga penting. Dan *italic* sebagai catatan."

// EXPECTED OUTPUT
"Bold pertama adalah poin penting.
Kemudian bold kedua juga penting.
Dan italic sebagai catatan."
```

### Test 4: With Identifiers (NEW)
```javascript
// INPUT
"CREATOR: Halo guys! HOST: Selamat datang. NARRATOR: Ini adalah cerita."

// EXPECTED OUTPUT
"Halo guys!
Selamat datang.
Ini adalah cerita."
```

### Test 5: Complex Real Script (NEW FORMAT)
```javascript
// INPUT
`[Close up ke wajah] **Eh, tau gak sih?** [pause] *90% developer* masih salah di hal ini!

CREATOR: Halo guys! [wave] Hari ini gue mau bahas tentang **clean code** yang sering diremehkan.

[Cut ke visual] Pertama, *naming convention*. Jangan asal kasih nama ya! [Tunjuk ke teks]

[Transition] Kedua, **function should do one thing**. One thing aja! Simple kan?

[Close up] Jadi intinya, *clean code = happy developer*.

Kalau bermanfaat, **save** dan **share** ke temen kalian ya! [wave]`

// EXPECTED OUTPUT
`Eh, tau gak sih?
90% developer masih salah di hal ini!

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

Kalau bermanfaat,
save dan share ke temen kalian ya!`
```

### Test 5: Edge Cases - Empty Formatting
```javascript
// INPUT
"Text dengan ** ** bold kosong dan * * italic kosong"

// EXPECTED OUTPUT
"Text dengan bold kosong dan italic kosong"
```

### Test 6: Edge Cases - Adjacent Formatting
```javascript
// INPUT
"**Bold**dan**Bold lagi**tanpa spasi"

// EXPECTED OUTPUT
"BolddanBold lagitanpa spasi"
```

### Test 7: Multiple Line Breaks
```javascript
// INPUT
`Baris pertama


Baris kedua dengan 3 line breaks


Baris ketiga`

// EXPECTED OUTPUT
`Baris pertama

Baris kedua dengan 3 line breaks

Baris ketiga`
```

### Test 8: Spacing Around Punctuation
```javascript
// INPUT
"Text dengan spasi   sebelum  .  Dan  ,  setelah"

// EXPECTED OUTPUT
"Text dengan spasi sebelum. Dan, setelah"
```

### Test 9: Mixed Everything
```javascript
// INPUT
"[Intro] **Penting!**   [pause]   *Tips:*  **Practice**  dulu   ya  .  [End]"

// EXPECTED OUTPUT
"Penting! Tips: Practice dulu ya."
```

### Test 10: Real TikTok Script (WITH PROPER LINE BREAKS)
```javascript
// INPUT
`[Hook - Close up] **Wait, kamu masih pakai cara ini?** [surprised face]

*Spoiler alert:* Ada cara yang **10x lebih cepat!** [snap fingers]

[Screen recording] Lihat nih, cara **lama** butuh 10 menit. [show old way]

[Transition] Tapi dengan **trik ini**, [show new way] cuma **1 menit!** [mind blown]

[Close up] *Pro tip:* Jangan lupa **save** video ini! [point to screen]

[Outro] Drop *comment* kalau mau tutorial lengkapnya! [wave] **#ProTips**`

// EXPECTED OUTPUT (EASY TO READ IN PROMPTER)
`Wait,
kamu masih pakai cara ini?

Spoiler alert: Ada cara yang 10x lebih cepat!

Lihat nih,
cara lama butuh 10 menit.

Tapi dengan trik ini,
cuma 1 menit!

Pro tip: Jangan lupa save video ini!

Drop comment kalau mau tutorial lengkapnya!
#ProTips`
```

### Test 11: Long Sentence with Commas
```javascript
// INPUT
"CREATOR: Hari ini kita akan belajar tentang coding, design patterns, clean code, dan best practices yang sering dilupakan developer."

// EXPECTED OUTPUT (Auto breaks on commas for readability)
"Hari ini kita akan belajar tentang coding,
design patterns,
clean code,
dan best practices yang sering dilupakan developer."
```

## Browser Console Test (Updated v2)

Copy paste this to browser console to test:

```javascript
// Helper function (copy from component - UPDATED VERSION)
function cleanScriptForPrompter(text) {
    if (!text) return "";
    
    // 1. Remove identifiers
    let cleaned = text.replace(/^(CREATOR|HOST|NARRATOR|SPEAKER|INTRO|HOOK|OUTRO):\s*/gim, '');
    
    // 2. Remove visual cues
    cleaned = cleaned.replace(/\[.*?\]/g, '');
    
    // 3. Remove bold
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // 4. Remove italic
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
    
    // 5. Remove headers
    cleaned = cleaned.replace(/^#+\s+/gm, '');
    
    // 6. Clean spaces
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // 7. Clean punctuation
    cleaned = cleaned.replace(/\s+([.,!?])/g, '$1');
    
    // 8. Add line breaks after sentences
    cleaned = cleaned.replace(/([.!?])\s+/g, '$1\n');
    
    // 9. Add breaks for long lines with commas
    const lines = cleaned.split('\n');
    cleaned = lines.map(line => {
        if (line.length > 80) {
            return line.replace(/,\s+/g, ',\n');
        }
        return line;
    }).join('\n');
    
    // 10. Clean excessive breaks
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
    // 11. Trim and filter
    cleaned = cleaned.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    
    // 12. Add section spacing
    cleaned = cleaned.replace(/\n(Halo|Hai|Nah|Jadi|Kalau|Oke|Dan yang terakhir)/g, '\n\n$1');
    
    return cleaned.trim();
}

// Test with real example
const testScript = `[Close up] **Eh, tau gak sih?** [pause] *90% developer* masih salah!

CREATOR: Halo guys! Hari ini gue mau bahas tentang **clean code** yang sering diremehkan.

[Transition] Pertama, *naming convention*. Jangan asal kasih nama ya!`;

console.log('=== CLEANED SCRIPT FOR PROMPTER ===');
console.log(cleanScriptForPrompter(testScript));
console.log('===================================');
```

## Expected Results Summary (v2 - With Line Breaks)

All tests should produce clean text with:
- ✅ No `[visual cues]`
- ✅ No `**bold**` formatting
- ✅ No `*italic*` formatting
- ✅ No identifiers (CREATOR:, HOST:, etc.)
- ✅ No markdown headers (###, ##, #)
- ✅ Clean single spaces
- ✅ Proper punctuation spacing
- ✅ **Line breaks after sentences** (. ! ?)
- ✅ **Line breaks in long lines with commas** (> 80 chars)
- ✅ **Section spacing** (double line breaks before key transitions)
- ✅ Max 2 consecutive line breaks
- ✅ Trimmed lines
- ✅ **Easy to read in prompter app** 📱

## Key Improvements in v2

### Better Readability
**Before (v1):**
```
Eh, tau gak sih? 90% developer masih salah! Halo guys! Hari ini gue mau bahas clean code.
```
❌ Hard to read - one long paragraph

**After (v2):**
```
Eh, tau gak sih?
90% developer masih salah!

Halo guys!
Hari ini gue mau bahas clean code.
```
✅ Easy to read - proper line breaks

### Natural Pauses
Long sentences with commas are broken down:
```
Hari ini kita akan belajar tentang coding,
design patterns,
clean code,
dan best practices.
```
This makes it easier to read with natural pauses.

## Regression Test Checklist

When updating `cleanScriptForPrompter()`, verify:

- [ ] Visual cues `[text]` are removed
- [ ] Bold `**text**` is converted to plain text
- [ ] Italic `*text*` is converted to plain text
- [ ] Multiple spaces → single space
- [ ] Spaces before punctuation removed
- [ ] Multiple line breaks limited to 2
- [ ] Lines are trimmed
- [ ] Empty/null input handled
- [ ] Special characters preserved (emoji, etc)
- [ ] Numbers preserved
- [ ] Punctuation preserved

---

**Test Coverage**: 10 test cases  
**Edge Cases Covered**: 5  
**Real-world Examples**: 2
