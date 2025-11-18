// Test file untuk verify markdown rendering
// Jalankan di browser console atau sebagai component test

export const testMarkdownExamples = {
    // Test 1: Bold text
    bold: "Ini adalah **teks tebal** di dalam kalimat.",

    // Test 2: Italic text
    italic: "Ini adalah *teks miring* di dalam kalimat.",

    // Test 3: Visual cues
    visualCues: "[Close up] Lihat bagian ini [Zoom out]",

    // Test 4: Kombinasi semua
    combined:
        "[Close up] **Penting!** Ini adalah *tips* yang harus diikuti. [Transition]",

    // Test 5: Multiple formatting dalam satu baris
    multipleSame: "**Bold pertama** dan **bold kedua** dalam satu baris.",

    // Test 6: Line breaks
    multiLine: `**Hook pertama** di baris satu.
*Tips kedua* di baris dua.
[Visual cue] di baris tiga.`,

    // Test 7: Script lengkap realistis
    fullScript: `[Close up ke wajah] **Eh, tau gak sih?** [pause] *90% developer* masih salah di hal ini!

Halo guys! Hari ini gue mau bahas tentang **clean code** yang sering diremehkan.

[Cut ke visual] Pertama, *naming convention*. Jangan asal kasih nama ya! [Tunjuk ke teks]

[Transition] Kedua, **function should do one thing**. One thing aja! Simple kan?

[Close up] Jadi intinya, *clean code = happy developer*. 

Kalau bermanfaat, **save** dan **share** ya! [wave]`,

    // Test 8: Tips dengan markdown
    tips: [
        "**Speak natural**, jangan robotic - be yourself!",
        "*Practice* beberapa kali sebelum recording",
        "Gunakan **visual cues** untuk [shot variety]",
        "[Close up] saat deliver poin penting",
        "Keep **energy high** especially di *hook*",
    ],

    // Test 9: Edge cases
    edgeCases: {
        emptyBold: "**",
        emptyItalic: "*",
        unclosedBold: "**Ini tidak tertutup",
        unclosedItalic: "*Ini tidak tertutup",
        unclosedBracket: "[Ini tidak tertutup",
        nested: "**Bold dengan *italic* di dalamnya**", // May not work as expected
        adjacent: "**Bold***Italic*", // Adjacent formatting
    },
};

// Expected rendering untuk test 7 (fullScript):
export const expectedRendering = `
Visual Structure:
┌────────────────────────────────────────────────────────────────┐
│ [Close up ke wajah] Eh, tau gak sih? [pause] 90% developer    │
│  ─────purple─────   ──────bold─────   ──────   ────italic──   │
│                                                                 │
│ Halo guys! Hari ini gue mau bahas tentang clean code yang     │
│                                                  ──────bold──  │
│                                                                 │
│ [Cut ke visual] Pertama, naming convention. Jangan asal ...   │
│  ─────purple──             ──────italic─────                   │
│                                                                 │
│ [Transition] Kedua, function should do one thing. One thing... │
│  ──purple──          ────────────bold──────────                │
│                                                                 │
│ [Close up] Jadi intinya, clean code = happy developer.        │
│  ──purple─               ─────────italic──────────             │
│                                                                 │
│ Kalau bermanfaat, save dan share ya! [wave]                   │
│                   ──bold─  ──bold─      ─purple─              │
└────────────────────────────────────────────────────────────────┘
`;

// Console log test untuk quick verification
if (typeof window !== "undefined") {
    console.log("=== MARKDOWN RENDERING TEST ===");
    console.log("\n1. Bold Test:");
    console.log("Input:", testMarkdownExamples.bold);
    console.log(
        'Expected: "Ini adalah [BOLD]teks tebal[/BOLD] di dalam kalimat."\n'
    );

    console.log("2. Italic Test:");
    console.log("Input:", testMarkdownExamples.italic);
    console.log(
        'Expected: "Ini adalah [ITALIC]teks miring[/ITALIC] di dalam kalimat."\n'
    );

    console.log("3. Visual Cues Test:");
    console.log("Input:", testMarkdownExamples.visualCues);
    console.log(
        'Expected: "[BADGE]Close up[/BADGE] Lihat bagian ini [BADGE]Zoom out[/BADGE]"\n'
    );

    console.log("4. Combined Test:");
    console.log("Input:", testMarkdownExamples.combined);
    console.log(
        'Expected: "[BADGE]Close up[/BADGE] [BOLD]Penting![/BOLD] Ini adalah [ITALIC]tips[/ITALIC] yang harus diikuti. [BADGE]Transition[/BADGE]"\n'
    );

    console.log("=== END OF TESTS ===");
}

export default testMarkdownExamples;
