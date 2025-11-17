# Programmers Nested Data Management

## Overview

Fitur CRUD lengkap untuk mengelola data nested pada setiap programmer di halaman admin `/list-programmers`.

## Fitur Yang Tersedia

### 1. **Skills Management**

Mengelola skills programmer dengan level proficiency.

**Fields:**

-   `name` (string) - Nama skill (e.g., React, Python, AWS)
-   `level` (number 0-100) - Level keahlian dalam persen

**Actions:**

-   ✅ Add new skill
-   ✅ Edit existing skill
-   ✅ Delete skill
-   ✅ Visual progress bar untuk level

### 2. **Certifications Management**

Mengelola sertifikasi programmer (array of strings).

**Fields:**

-   `certification` (string) - Nama sertifikasi lengkap

**Actions:**

-   ✅ Add new certification
-   ✅ Delete certification
-   ✅ Simple list view

### 3. **Recent Projects Management**

Mengelola project terbaru yang pernah dikerjakan.

**Fields:**

-   `title` (string) - Judul project
-   `description` (string) - Deskripsi project
-   `tech` (array) - Array teknologi yang digunakan (comma-separated input)
-   `link` (string) - URL project
-   `image` (string) - URL gambar project
-   `duration` (string) - Durasi pengerjaan (e.g., "3 months")
-   `role` (string) - Peran dalam project (e.g., "Lead Developer")

**Actions:**

-   ✅ Add new project
-   ✅ Edit existing project
-   ✅ Delete project
-   ✅ Display tech stack badges

### 4. **Testimonials Management**

Mengelola testimonial/review dari klien.

**Fields:**

-   `name` (string) - Nama reviewer
-   `role` (string) - Jabatan reviewer
-   `company` (string) - Nama perusahaan
-   `text` (string) - Isi testimonial
-   `rating` (number 1-5) - Rating bintang

**Actions:**

-   ✅ Add new testimonial
-   ✅ Edit existing testimonial
-   ✅ Delete testimonial
-   ✅ Visual star rating display

## Cara Penggunaan

### Desktop View:

1. Klik tombol **"Manage"** pada baris programmer
2. Pilih jenis data yang ingin dikelola:
    - Skills (dengan jumlah item)
    - Certifications (dengan jumlah item)
    - Projects (dengan jumlah item)
    - Testimonials (dengan jumlah item)
3. Dialog management akan terbuka dengan list data yang ada
4. Gunakan tombol **"Add"** untuk menambah data baru
5. Gunakan icon **Edit** untuk mengubah data
6. Gunakan icon **Trash** untuk menghapus data

### Mobile View:

1. Lihat grid buttons di setiap card programmer:
    - **Skills** - Mengelola skills
    - **Certs** - Mengelola certifications
    - **Projects** - Mengelola recent projects
    - **Reviews** - Mengelola testimonials
2. Setiap button menampilkan jumlah item dalam kurung
3. Klik button untuk membuka dialog management

## Technical Implementation

### State Management:

```typescript
// Main nested data dialog
const [manageDialogOpen, setManageDialogOpen] = useState(false);
const [manageType, setManageType] = useState<
    "skills" | "certifications" | "projects" | "testimonials" | null
>(null);
const [selectedProgrammer, setSelectedProgrammer] =
    useState<IProgrammer | null>(null);

// Individual dialogs for each data type
const [skillDialogOpen, setSkillDialogOpen] = useState(false);
const [certDialogOpen, setCertDialogOpen] = useState(false);
const [projectDialogOpen, setProjectDialogOpen] = useState(false);
const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
```

### API Integration:

Semua perubahan disimpan melalui PUT request ke `/api/programmers/[id]`:

```typescript
const response = await fetch(`/api/programmers/${selectedProgrammer._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        skills: updatedSkills, // atau certifications, recentProjects, testimonials
    }),
});
```

### Data Flow:

1. User membuka manage dialog untuk programmer tertentu
2. Data programmer yang dipilih disimpan di `selectedProgrammer`
3. User add/edit/delete item dari nested array
4. Perubahan langsung di-submit ke API
5. Data di-refresh dari server
6. `selectedProgrammer` di-update dengan data terbaru
7. Toast notification menampilkan status sukses/error

## UI Components Used:

-   `Dialog` - Main container untuk management
-   `DropdownMenu` - Desktop "Manage" button dropdown
-   `Button` - Various action buttons
-   `Input` - Text input fields
-   `Textarea` - Long text input (descriptions, testimonials)
-   `Select` - Rating selection (1-5 stars)
-   `Badge` - Display tech stack
-   `Label` - Form labels
-   Icons: `Award`, `Briefcase`, `MessageSquare`, `Settings`, `Edit`, `Trash2`, `PlusCircle`, `Star`

## Validasi:

-   **Skills**: Nama skill required, level 0-100
-   **Certifications**: Nama sertifikasi required
-   **Recent Projects**: Title, description, tech, role, duration required
-   **Testimonials**: Name, text, company required, rating 1-5

## Toast Notifications:

-   ✅ Success: "Skill added/updated/deleted successfully"
-   ❌ Error: "Failed to save skill" (dengan error message)
-   ⚠️ Validation: "Please fill in all required fields"

## Notes:

-   Semua perubahan langsung tersimpan ke database
-   Tidak ada batch update - setiap action langsung hit API
-   Auto-refresh data setelah setiap perubahan
-   Delete action langsung tanpa confirmation (kecuali delete programmer)
-   Edit mode: Form di-populate dengan data existing
-   Add mode: Form kosong dengan default values
