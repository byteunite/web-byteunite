/**
 * Generate URL-friendly slug from text
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
    return (
        text
            .toLowerCase()
            .trim()
            // Replace spaces with hyphens
            .replace(/\s+/g, "-")
            // Remove special characters
            .replace(/[^\w\-]+/g, "")
            // Replace multiple hyphens with single hyphen
            .replace(/\-\-+/g, "-")
            // Remove leading/trailing hyphens
            .replace(/^-+/, "")
            .replace(/-+$/, "")
    );
}

/**
 * Generate unique slug by appending counter if duplicate exists
 * @param baseSlug - Base slug to use
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 */
export function generateUniqueSlug(
    baseSlug: string,
    existingSlugs: string[]
): string {
    let slug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

/**
 * Generate slug from programmer name
 * @param name - Programmer name
 * @returns Slug from name
 */
export function generateProgrammerSlug(name: string): string {
    return generateSlug(name);
}
