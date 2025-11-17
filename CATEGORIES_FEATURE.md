# Categories Feature - Documentation

## Overview

Feature Categories telah diimplementasikan dengan database MongoDB menggunakan model, REST API, dan halaman yang mengonsumsi API tersebut.

## Struktur

### 1. Model Database

**File**: `models/Category.ts`

Model Category mencakup:

-   Basic info: `id`, `title`, `description`, `longDescription`
-   Visual: `icon`, `color`, `image`
-   Stats: `programmersCount`, `projectsCount`, `eventsCount`
-   Technologies: Array of technologies
-   Nested data:
    -   `programmers[]`: List of programmers with name, title, company, avatar, skills, experience
    -   `projects[]`: List of projects with title, description, author, stack, likes, views, image
    -   `events[]`: List of events with title, date, time, organizer, attendees, maxAttendees, price
    -   `resources[]`: List of resources with title, url, type

### 2. REST API

#### GET `/api/categories`

Mendapatkan semua kategori (tanpa detail nested data).

**Query Parameters**:

-   `page` (default: 1)
-   `limit` (default: 100)

**Response**:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 6,
    "totalPages": 1
  }
}
```

#### POST `/api/categories`

Membuat kategori baru.

**Body**:

```json
{
  "id": "frontend",
  "title": "Frontend Development",
  "description": "...",
  "longDescription": "...",
  "icon": "Globe",
  "color": "bg-blue-500",
  "programmersCount": 156,
  "projectsCount": 89,
  "eventsCount": 12,
  "technologies": ["React", "Vue.js", ...],
  "image": "https://...",
  "programmers": [...],
  "projects": [...],
  "events": [...],
  "resources": [...]
}
```

#### GET `/api/categories/[id]`

Mendapatkan detail kategori berdasarkan ID (termasuk semua nested data).

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "id": "frontend",
    "title": "Frontend Development",
    "programmers": [...],
    "projects": [...],
    "events": [...],
    "resources": [...]
  }
}
```

#### PUT `/api/categories/[id]`

Update kategori berdasarkan ID.

#### DELETE `/api/categories/[id]`

Hapus kategori berdasarkan ID.

### 3. Frontend Pages

#### `/categories`

**File**: `app/categories/page.tsx`

Halaman ini menampilkan grid dari semua kategori dengan:

-   Loading state (Loader2 spinner)
-   Error state dengan tombol retry
-   Card untuk setiap kategori menampilkan:
    -   Image
    -   Icon dan color
    -   Title & description
    -   Stats (programmers, projects, events count)
    -   Technologies badges
    -   Link ke detail page

#### `/categories/[category]`

**File**: `app/categories/[category]/page.tsx`

Halaman detail kategori dengan tabs:

-   **Overview**: Long description, technologies, quick actions
-   **Programmers**: List programmers dengan search & sort
-   **Projects**: Grid of projects
-   **Events**: List of events
-   **Resources**: External resources dengan links

Features:

-   Loading state
-   Error handling dengan notFound()
-   Search & filter functionality
-   Responsive design

### 4. Seed Data

**File**: `scripts/seed-categories.ts`

Script untuk populate database dengan data dummy.

**Data yang di-seed**:

1. Frontend Development
2. Backend Development
3. Mobile Development
4. Full Stack Development
5. DevOps & Cloud
6. Data Science & AI

Setiap kategori memiliki:

-   2 programmers
-   2 projects
-   2 events
-   3 resources

## Cara Menggunakan

### 1. Setup Environment

Pastikan `.env.local` memiliki:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### 2. Seed Database

```bash
pnpm seed:categories
```

Script ini akan:

-   Connect ke MongoDB
-   Clear existing categories
-   Insert 6 sample categories
-   Display success message

### 3. Run Development Server

```bash
pnpm dev
```

### 4. Access Pages

-   Categories list: http://localhost:3000/categories
-   Category detail: http://localhost:3000/categories/frontend

## API Usage Examples

### Fetch all categories

```typescript
const response = await fetch("/api/categories");
const result = await response.json();
const categories = result.data;
```

### Fetch specific category

```typescript
const response = await fetch("/api/categories/frontend");
const result = await response.json();
const category = result.data;
```

### Create new category

```typescript
const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoryData),
});
const result = await response.json();
```

## Icon Mapping

Icons menggunakan lucide-react. Mapping di halaman:

-   `Globe`: Frontend
-   `Database`: Backend
-   `Smartphone`: Mobile
-   `Code`: Full Stack
-   `Cloud`: DevOps
-   `Brain`: Data Science & AI

## Next Steps

Untuk pengembangan lebih lanjut:

1. **Authentication**: Protect POST, PUT, DELETE endpoints
2. **Image Upload**: Integrate dengan Cloudinary untuk upload images
3. **Search**: Implement global search across categories
4. **Filtering**: Add filters by technology, difficulty, etc.
5. **Relations**: Link dengan Programmer, Project, Event collections yang real
6. **Analytics**: Track views, popular categories
7. **Comments/Reviews**: Allow users to comment on categories

## Troubleshooting

### Error: Cannot connect to MongoDB

-   Check MONGODB_URI in `.env.local`
-   Ensure MongoDB cluster is running
-   Check network/firewall settings

### Error: Categories not loading

-   Check browser console for API errors
-   Verify API endpoint is working: visit `/api/categories` directly
-   Check MongoDB has data: run seed script again

### TypeScript errors

-   Run `pnpm install` to ensure all dependencies installed
-   Check that tsx is in devDependencies
-   Restart TypeScript server in VS Code

## File Structure

```
/Users/admin/Documents/project/byteunite-dev/
├── models/
│   └── Category.ts          # Category model & interfaces
├── app/
│   ├── api/
│   │   └── categories/
│   │       ├── route.ts                # GET all, POST
│   │       └── [id]/route.ts           # GET, PUT, DELETE by ID
│   └── categories/
│       ├── page.tsx                    # Categories list page
│       └── [category]/page.tsx         # Category detail page
└── scripts/
    └── seed-categories.ts              # Seed script
```
