# Feature: LinkedIn Field in Programmer Form

## Overview

Added LinkedIn field to the Add/Edit Programmer modal, allowing admins to store and display LinkedIn profile links for programmers.

## Changes Made

### 1. Frontend UI (`/app/(protected)/list-programmers/page.tsx`)

#### Updated Local Interface

```typescript
interface IProgrammer {
    // ... other fields
    github: string;
    portfolio: string;
    linkedin: string; // ✅ Added
    email: string;
    // ... other fields
}
```

#### Updated Form State

```typescript
const [formData, setFormData] = useState({
    // ... other fields
    github: "",
    portfolio: "",
    linkedin: "", // ✅ Added
    email: "",
    // ... other fields
});
```

#### Updated `resetForm()` Function

```typescript
const resetForm = () => {
    setFormData({
        // ... other fields
        github: "",
        portfolio: "",
        linkedin: "", // ✅ Added
        email: "",
        // ... other fields
    });
};
```

#### Updated `handleOpenDialog()` Function (Edit Mode)

```typescript
const handleOpenDialog = (programmer?: IProgrammer) => {
    if (programmer) {
        setFormData({
            // ... other fields
            github: programmer.github,
            portfolio: programmer.portfolio,
            linkedin: programmer.linkedin || "", // ✅ Added
            email: programmer.email,
            // ... other fields
        });
    }
};
```

#### Updated `handleParseCV()` Function (CV Upload)

```typescript
setFormData({
    // ... other fields
    github: result.data.github || "",
    portfolio: result.data.portfolio || "",
    linkedin: result.data.linkedin || "", // ✅ Added
    email: result.data.email || "",
    // ... other fields
});
```

#### Updated `handleSubmitProgrammer()` Function (Save Payload)

```typescript
payload = {
    // ... other fields
    github: formData.github,
    portfolio: formData.portfolio,
    linkedin: formData.linkedin, // ✅ Added
    email: formData.email,
    // ... other fields
};
```

#### Updated Form UI (3-Column Grid)

```typescript
<div className="grid grid-cols-3 gap-4">
    {" "}
    {/* Changed from grid-cols-2 */}
    <div className="space-y-2">
        <Label htmlFor="github">GitHub</Label>
        <Input
            id="github"
            placeholder="username"
            value={formData.github}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    github: e.target.value,
                })
            }
        />
    </div>
    <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio</Label>
        <Input
            id="portfolio"
            placeholder="yoursite.com"
            value={formData.portfolio}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    portfolio: e.target.value,
                })
            }
        />
    </div>
    {/* ✅ New LinkedIn Field */}
    <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
            id="linkedin"
            placeholder="linkedin.com/in/username"
            value={formData.linkedin}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    linkedin: e.target.value,
                })
            }
        />
    </div>
</div>
```

### 2. Backend Schema (Already Existed)

The `linkedin` field was already present in `/models/Programmer.ts`:

```typescript
export interface IProgrammer extends Document {
    // ... other fields
    github: string;
    portfolio: string;
    linkedin: string; // ✅ Already exists
    twitter: string;
    // ... other fields
}

const ProgrammerSchema = new Schema<IProgrammer>({
    // ... other fields
    linkedin: {
        type: String,
        required: false, // Optional field
    },
    // ... other fields
});
```

## Features

### 1. **Add Programmer with LinkedIn**

-   Admin can input LinkedIn profile URL when creating new programmer
-   Field is optional (not required)
-   Placeholder: `linkedin.com/in/username`

### 2. **Edit Programmer LinkedIn**

-   When editing existing programmer, LinkedIn field populates with saved value
-   Can update or clear LinkedIn field

### 3. **CV Upload with LinkedIn**

-   If CV contains LinkedIn information, it will be parsed by Gemini AI
-   LinkedIn field auto-fills from parsed CV data
-   Falls back to empty string if not found in CV

### 4. **Save LinkedIn to Database**

-   LinkedIn value is included in payload when saving programmer
-   Stored in MongoDB as optional field
-   Can be retrieved via API endpoints

## UI Layout

**Before:**

```
┌─────────────────┬─────────────────┐
│     GitHub      │    Portfolio    │
└─────────────────┴─────────────────┘
```

**After:**

```
┌───────────────┬───────────────┬───────────────┐
│    GitHub     │   Portfolio   │   LinkedIn    │
└───────────────┴───────────────┴───────────────┘
```

## Usage Examples

### Example 1: Manual Entry

```typescript
// User fills form manually
{
    name: "John Doe",
    role: "Senior Frontend Developer",
    // ... other fields
    github: "johndoe",
    portfolio: "johndoe.dev",
    linkedin: "linkedin.com/in/johndoe"  // ✅ LinkedIn field
}
```

### Example 2: CV Upload

```typescript
// AI parses CV and extracts LinkedIn
{
    name: "Jane Smith",
    role: "Full Stack Engineer",
    // ... other fields
    github: "janesmith",
    portfolio: "janesmith.com",
    linkedin: "linkedin.com/in/jane-smith"  // ✅ Auto-filled from CV
}
```

### Example 3: Edit Existing Programmer

```typescript
// Opens dialog with existing data
programmer = {
    _id: "507f1f77bcf86cd799439011",
    name: "Alice Johnson",
    // ... other fields
    github: "alicejohnson",
    portfolio: "alicejohnson.io",
    linkedin: "linkedin.com/in/alice-johnson", // ✅ Populates from DB
};
```

## API Integration

### POST/PUT `/api/programmers`

**Request Payload:**

```json
{
    "name": "John Doe",
    "role": "Senior Frontend Developer",
    // ... other fields
    "github": "johndoe",
    "portfolio": "johndoe.dev",
    "linkedin": "linkedin.com/in/johndoe"
}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        // ... other fields
        "github": "johndoe",
        "portfolio": "johndoe.dev",
        "linkedin": "linkedin.com/in/johndoe"
    }
}
```

## Technical Notes

### Field Properties

-   **Type:** `String`
-   **Required:** `false` (optional)
-   **Default:** None (empty string in form state)
-   **Validation:** None (accepts any string)

### State Management

-   Stored in `formData` state (flat data)
-   Not part of `parsedNestedData` (nested data like skills/projects)
-   Cleared on `resetForm()`
-   Populated on edit mode via `handleOpenDialog()`
-   Populated from CV via `handleParseCV()`

### Gemini AI Parsing

The AI CV parser can extract LinkedIn from CV text:

```typescript
// In /lib/gemini-cv-parser.ts
const prompt = `
Extract the following information from this CV:
- ... other fields
- linkedin (string, LinkedIn profile URL)
- ... other fields
`;
```

## Testing Checklist

-   [x] Add new programmer with LinkedIn field
-   [x] Edit existing programmer and update LinkedIn
-   [x] Upload CV with LinkedIn info and auto-fill
-   [x] Save programmer with LinkedIn to database
-   [x] Retrieve programmer data with LinkedIn from API
-   [x] Clear/empty LinkedIn field
-   [x] LinkedIn field is optional (not required)
-   [x] TypeScript compilation successful
-   [x] No console errors in browser

## Related Files

### Modified

-   `/app/(protected)/list-programmers/page.tsx` - Added LinkedIn field to form

### Existing (No Changes Needed)

-   `/models/Programmer.ts` - LinkedIn field already exists
-   `/app/api/programmers/route.ts` - Handles LinkedIn in payload
-   `/app/api/programmers/[id]/route.ts` - Updates LinkedIn field
-   `/lib/gemini-cv-parser.ts` - Can parse LinkedIn from CV

## Conclusion

The LinkedIn field is now fully integrated into the Add/Edit Programmer modal. Admins can:

1. Manually enter LinkedIn URL when creating/editing programmers
2. Auto-fill LinkedIn from uploaded CV via AI parsing
3. View and update LinkedIn for existing programmers
4. Store LinkedIn in database for future reference

The field is optional and follows the same pattern as the existing `github` and `portfolio` fields.
