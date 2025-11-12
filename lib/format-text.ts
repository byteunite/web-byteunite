/**
 * Utility untuk memformat teks dengan dukungan markdown sederhana
 * Mendukung: **bold**, *italic*, __bold__, _italic_
 */

export function parseMarkdownToHtml(text: string): string {
    if (!text) return "";

    let formatted = text;

    // Parse bold dengan ** atau __
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // Parse italic dengan * atau _ (tapi hindari yang sudah di-parse sebagai bold)
    formatted = formatted.replace(
        /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
        "<em>$1</em>"
    );
    formatted = formatted.replace(
        /(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g,
        "<em>$1</em>"
    );

    // Parse line breaks
    formatted = formatted.replace(/\n/g, "<br/>");

    return formatted;
}

/**
 * Parse markdown untuk bullet points dengan formatting
 */
export function parseMarkdownBulletPoints(text: string): string {
    if (!text) return "";

    let formatted = text;

    // Parse bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // Parse italic
    formatted = formatted.replace(
        /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
        "<em>$1</em>"
    );
    formatted = formatted.replace(
        /(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g,
        "<em>$1</em>"
    );

    // Parse line breaks untuk bullet points
    formatted = formatted.replace(/\n/g, "<br/>");

    return formatted;
}
