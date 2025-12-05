/**
 * Migration Script: Add Slug to Existing Programmers
 *
 * This script adds slug field to all existing programmers in the database.
 * Run this once after deploying the slug feature.
 *
 * Usage:
 * 1. Make sure MongoDB connection is configured in .env
 * 2. Run: npx tsx scripts/add-slug-to-programmers.ts
 */

import mongoose from "mongoose";
import Programmer from "../models/Programmer";
import { generateProgrammerSlug } from "../lib/slug";

// MongoDB connection string - adjust as needed
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/byteunite";

async function addSlugToProgrammers() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Get all programmers without slug
        const programmers = await Programmer.find({
            $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
        });

        console.log(`📊 Found ${programmers.length} programmers without slug`);

        if (programmers.length === 0) {
            console.log("✨ All programmers already have slugs!");
            return;
        }

        const usedSlugs = new Set<string>();
        let updated = 0;
        let failed = 0;

        for (const programmer of programmers) {
            try {
                // Generate base slug from name
                let slug = generateProgrammerSlug(programmer.name);

                // Make sure slug is unique
                let counter = 1;
                let uniqueSlug = slug;

                while (
                    usedSlugs.has(uniqueSlug) ||
                    (await Programmer.findOne({
                        slug: uniqueSlug,
                        _id: { $ne: programmer._id },
                    }))
                ) {
                    uniqueSlug = `${slug}-${counter}`;
                    counter++;
                }

                // Update programmer with slug
                programmer.slug = uniqueSlug;
                await programmer.save();

                usedSlugs.add(uniqueSlug);
                updated++;

                console.log(`✓ Updated: ${programmer.name} -> ${uniqueSlug}`);
            } catch (error) {
                failed++;
                console.error(`✗ Failed to update ${programmer.name}:`, error);
            }
        }

        console.log("\n📈 Migration Summary:");
        console.log(`   ✅ Successfully updated: ${updated}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log(`   📊 Total: ${programmers.length}`);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run migration
addSlugToProgrammers()
    .then(() => {
        console.log("\n✨ Migration completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Migration failed:", error);
        process.exit(1);
    });
