# Fix: CV Upload - Projects & Nested Data Not Saved

## 🐛 Problem

Ketika mengupload CV menggunakan fitur "Upload CV", data nested seperti:

-   **Skills** (array dengan name dan level)
-   **Recent Projects** (array dengan detail project)
-   **Testimonials** (array dengan reviews)

Tidak tersimpan ke database. Hanya data basic (name, role, email, dll) yang tersimpan.

## 🔍 Root Cause

Di fungsi `handleSubmitProgrammer`, ketika menggunakan mode "form", nested data selalu di-set ke array kosong:

```typescript
// SEBELUM (BUG)
payload = {
    // ... other fields
    skills: [], // ❌ Always empty
    recentProjects: [], // ❌ Always empty
    testimonials: [], // ❌ Always empty
};
```

Data yang diparsing dari CV tidak disimpan di state, sehingga hilang saat submit.

## ✅ Solution

### 1. Tambah State untuk Nested Data

Menambahkan state khusus untuk menyimpan nested data hasil parsing CV:

```typescript
const [parsedNestedData, setParsedNestedData] = useState<{
    skills: ISkill[];
    recentProjects: IRecentProject[];
    testimonials: ITestimonial[];
}>({
    skills: [],
    recentProjects: [],
    testimonials: [],
});
```

### 2. Update `handleParseCV`

Menyimpan nested data dari hasil parsing ke state:

```typescript
// Save nested data (skills, recentProjects, testimonials)
setParsedNestedData({
    skills: result.data.skills || [],
    recentProjects: result.data.recentProjects || [],
    testimonials: result.data.testimonials || [],
});
```

### 3. Update `handleSubmitProgrammer`

Menggunakan nested data yang sudah diparsing:

```typescript
// SETELAH (FIXED) ✅
payload = {
    // ... other fields
    skills: parsedNestedData.skills,
    recentProjects: parsedNestedData.recentProjects,
    testimonials: parsedNestedData.testimonials,
};
```

### 4. Update `resetForm`

Reset nested data saat form di-reset:

```typescript
setParsedNestedData({
    skills: [],
    recentProjects: [],
    testimonials: [],
});
```

### 5. Tambah Visual Indicator

Menampilkan info di form tentang nested data yang berhasil diparsing:

```tsx
{
    (parsedNestedData.skills.length > 0 ||
        parsedNestedData.recentProjects.length > 0 ||
        parsedNestedData.testimonials.length > 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-green-900 mb-2">
                ✅ Additional Data Extracted from CV:
            </h4>
            <div className="space-y-1 text-sm text-green-800">
                {parsedNestedData.skills.length > 0 && (
                    <div>
                        • <strong>{parsedNestedData.skills.length}</strong>{" "}
                        Skills
                    </div>
                )}
                {parsedNestedData.recentProjects.length > 0 && (
                    <div>
                        •{" "}
                        <strong>
                            {parsedNestedData.recentProjects.length}
                        </strong>{" "}
                        Recent Projects
                    </div>
                )}
                {parsedNestedData.testimonials.length > 0 && (
                    <div>
                        •{" "}
                        <strong>{parsedNestedData.testimonials.length}</strong>{" "}
                        Testimonials
                    </div>
                )}
            </div>
        </div>
    );
}
```

## 📊 Before vs After

### Before (BUG ❌):

```
1. Upload CV → Parse with AI
2. AI extracts: name, role, skills, projects, etc.
3. Only basic data saved to state
4. Submit → skills: [], recentProjects: [], testimonials: []
5. ❌ Nested data LOST
```

### After (FIXED ✅):

```
1. Upload CV → Parse with AI
2. AI extracts: name, role, skills, projects, etc.
3. Basic data → formData
4. Nested data → parsedNestedData
5. Submit → Include parsedNestedData
6. ✅ All data SAVED to database
```

## 🧪 Testing

### Test Case:

1. Upload CV dengan project experience di dalamnya
2. Klik "Parse CV with AI"
3. Check form - should show green box with extracted data count
4. Submit programmer
5. View programmer detail
6. ✅ Recent Projects section should show the projects

### Expected Result:

-   Skills extracted and saved
-   Recent Projects extracted and saved
-   Testimonials extracted and saved (if any in CV)

## 📝 Files Modified

1. `/app/(protected)/list-programmers/page.tsx`
    - Added `parsedNestedData` state
    - Updated `handleParseCV`
    - Updated `handleSubmitProgrammer`
    - Updated `resetForm`
    - Added visual indicator for parsed nested data

## 🎯 Impact

-   ✅ Skills from CV now saved
-   ✅ Recent Projects from CV now saved
-   ✅ Testimonials from CV now saved
-   ✅ Better UX with visual feedback
-   ✅ No data loss during CV upload process

## 🚀 Status

**FIXED** - Nested data sekarang tersimpan dengan sempurna!

---

**Fixed Date:** December 5, 2024  
**Issue:** Nested data not saved from CV upload  
**Status:** ✅ Resolved
