# Programmers Feature - Documentation

## Overview

Feature Programmers telah diimplementasikan dengan database MongoDB menggunakan model, REST API, dan halaman yang mengonsumsi API tersebut.

## Struktur

### 1. Model Database

**File**: `models/Programmer.ts`

Model Programmer mencakup:

-   **Basic Info**: `name`, `role`, `location`, `bio`, `fullBio`
-   **Tech Stack**: Array of technologies
-   **Category**: frontend, backend, fullstack, mobile, devops, data
-   **Contact**: `email`, `github`, `portfolio`, `linkedin`, `twitter`
-   **Stats**: `rating`, `projects`, `experience`, `joinedDate`
-   **Professional**: `availability`, `hourlyRate`, `languages[]`, `certifications[]`
-   **Nested Data**:
    -   `skills[]`: Array with name and level (0-100)
    -   `recentProjects[]`: Portfolio projects with title, description, tech, link, image, duration, role
    -   `testimonials[]`: Client reviews with name, role, company, text, rating

### 2. REST API

#### GET `/api/programmers`

Mendapatkan semua programmers dengan filtering, search, dan sorting.

**Query Parameters**:

-   `page` (default: 1)
-   `limit` (default: 100)
-   `category`: Filter by category (frontend, backend, fullstack, mobile, devops, data)
-   `search`: Search by name, role, or tech stack
-   `sortBy`: Sort by name, rating, or projects

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

**Note**: Response excludes `fullBio`, `skills`, `recentProjects`, `testimonials`, `linkedin`, `twitter`, `email` untuk performa.

#### POST `/api/programmers`

Membuat programmer baru.

**Body**:

```json
{
  "name": "John Doe",
  "role": "Frontend Developer",
  "email": "john@example.com",
  "location": "New York, NY",
  "bio": "...",
  "fullBio": "...",
  "stack": ["React", "TypeScript"],
  "category": "frontend",
  "avatar": "...",
  "github": "johndoe",
  "portfolio": "johndoe.dev",
  "rating": 4.5,
  "projects": 10,
  "joinedDate": "2024-01-01",
  "experience": "5+ years",
  "availability": "Available for freelance",
  "hourlyRate": "$80-100",
  "skills": [{"name": "React", "level": 90}],
  ...
}
```

#### GET `/api/programmers/[id]`

Mendapatkan detail programmer berdasarkan ID (termasuk semua nested data).

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Sarah Chen",
    "fullBio": "...",
    "skills": [...],
    "recentProjects": [...],
    "testimonials": [...],
    ...
  }
}
```

#### PUT `/api/programmers/[id]`

Update programmer berdasarkan ID.

#### DELETE `/api/programmers/[id]`

Hapus programmer berdasarkan ID.

### 3. Frontend Pages

#### `/programmers`

**File**: `app/programmers/page.tsx`

Halaman ini menampilkan grid dari semua programmers dengan:

-   **Loading state** (Loader2 spinner)
-   **Error state** dengan tombol retry
-   **Search & Filter**:
    -   Search by name, role, or technology
    -   Filter by category (all, frontend, backend, fullstack, mobile)
    -   Sort by name, rating, or projects count
-   **Card untuk setiap programmer** menampilkan:
    -   Avatar
    -   Name, role, location
    -   Bio
    -   Rating & projects count
    -   Tech stack badges (max 4, then +N more)
    -   GitHub & Portfolio links
    -   View Profile button

#### `/programmers/[id]`

**File**: `app/programmers/[id]/page.tsx`

Halaman detail programmer dengan:

-   **Hero Section**: Avatar, name, role, location, bio, hire/contact buttons
-   **Main Content**:
    -   About Me (full bio)
    -   Skills & Expertise (with progress bars)
    -   Tech Stack (badges)
    -   Recent Projects (with images, descriptions, tech used)
    -   Client Testimonials (with ratings)
-   **Sidebar**:
    -   Quick Stats (rating, projects, experience, hourly rate, joined date)
    -   Availability status
    -   Languages
    -   Certifications
    -   Social links (LinkedIn, Twitter, Email)
-   **Loading & Error states**

### 4. Seed Data

**File**: `scripts/seed-programmers.ts`

Script untuk populate database dengan 6 sample programmers:

1. **Sarah Chen** - Senior Frontend Developer (frontend)
2. **Marcus Rodriguez** - Full Stack Engineer (fullstack)
3. **Aisha Patel** - Mobile Developer (mobile)
4. **David Kim** - Backend Developer (backend)
5. **Elena Volkov** - DevOps Engineer (devops)
6. **James Wilson** - Frontend Architect (frontend)

Setiap programmer memiliki:

-   Complete profile information
-   6 skills dengan level
-   2-3 recent projects
-   1-2 testimonials
-   Multiple certifications
-   Language proficiencies

## Cara Menggunakan

### 1. Setup Environment

Pastikan `.env.local` memiliki:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### 2. Seed Database

```bash
npm run seed:programmers
```

atau

```bash
pnpm seed:programmers
```

Script ini akan:

-   Connect ke MongoDB
-   Clear existing programmers
-   Insert 6 sample programmers
-   Display success message

### 3. Run Development Server

```bash
npm run dev
```

### 4. Access Pages

-   Programmers list: http://localhost:3000/programmers
-   Programmer detail: http://localhost:3000/programmers/[id]
    -   Get ID from database or API response

## API Usage Examples

### Fetch all programmers

```typescript
const response = await fetch("/api/programmers");
const result = await response.json();
const programmers = result.data;
```

### Search & filter programmers

```typescript
const params = new URLSearchParams({
    category: "frontend",
    search: "React",
    sortBy: "rating",
});
const response = await fetch(`/api/programmers?${params}`);
const result = await response.json();
```

### Fetch specific programmer

```typescript
const response = await fetch(`/api/programmers/${id}`);
const result = await response.json();
const programmer = result.data;
```

### Create new programmer

```typescript
const response = await fetch("/api/programmers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(programmerData),
});
const result = await response.json();
```

## Category Options

-   `frontend`: Frontend Development
-   `backend`: Backend Development
-   `fullstack`: Full Stack Development
-   `mobile`: Mobile Development
-   `devops`: DevOps & Cloud
-   `data`: Data Science & AI

## Features

### Search Functionality

API supports searching across:

-   Programmer name
-   Role/title
-   Tech stack (any technology)

### Sorting Options

-   `name`: Alphabetical by name (A-Z)
-   `rating`: Highest rated first
-   `projects`: Most projects first

### Filtering

-   Filter by category
-   Client-side search updates immediately
-   Server-side filtering for performance

## Next Steps

Untuk pengembangan lebih lanjut:

1. **Authentication**: Protect POST, PUT, DELETE endpoints
2. **User Profiles**: Allow programmers to create/edit their own profiles
3. **Image Upload**: Integrate dengan Cloudinary untuk avatar & project images
4. **Advanced Search**: Filter by skills, experience level, hourly rate
5. **Messaging**: Add direct messaging between users
6. **Reviews**: Allow clients to leave reviews
7. **Portfolio Integration**: Connect with GitHub API for real project data
8. **Availability Calendar**: Show actual availability
9. **Hiring System**: Add job posting and application system
10. **Analytics**: Track profile views, contact requests

## Troubleshooting

### Error: Cannot connect to MongoDB

-   Check MONGODB_URI in `.env.local`
-   Ensure MongoDB cluster is running
-   Check network/firewall settings

### Error: Programmers not loading

-   Check browser console for API errors
-   Verify API endpoint: visit `/api/programmers` directly
-   Check MongoDB has data: run seed script again

### Search not working

-   Ensure search parameter is being sent to API
-   Check API query building logic
-   Verify MongoDB text search is working

### TypeScript errors

-   Run `npm install` to ensure all dependencies installed
-   Check that tsx is available for running seed scripts
-   Restart TypeScript server in VS Code

## File Structure

```
/Users/admin/Documents/project/byteunite-dev/
├── models/
│   └── Programmer.ts              # Programmer model & interfaces
├── app/
│   ├── api/
│   │   └── programmers/
│   │       ├── route.ts                # GET all, POST
│   │       └── [id]/route.ts           # GET, PUT, DELETE by ID
│   └── programmers/
│       ├── page.tsx                    # Programmers list page
│       ├── loading.tsx                 # Loading state
│       └── [id]/page.tsx               # Programmer detail page
└── scripts/
    └── seed-programmers.ts             # Seed script
```

## API Response Examples

### List Response (Summary)

```json
{
    "success": true,
    "data": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Sarah Chen",
            "role": "Senior Frontend Developer",
            "location": "San Francisco, CA",
            "bio": "Passionate about creating...",
            "stack": ["React", "TypeScript", "Tailwind CSS"],
            "category": "frontend",
            "avatar": "/professional-woman-developer.png",
            "github": "sarahchen",
            "portfolio": "sarahchen.dev",
            "rating": 4.9,
            "projects": 12
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 100,
        "total": 6,
        "totalPages": 1
    }
}
```

### Detail Response (Full)

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Sarah Chen",
    "fullBio": "I'm a senior frontend developer...",
    "skills": [
      {"name": "React", "level": 95},
      {"name": "TypeScript", "level": 90}
    ],
    "recentProjects": [...],
    "testimonials": [...],
    "linkedin": "sarahchen-dev",
    "twitter": "sarahcodes",
    "email": "sarah@example.com",
    ...
  }
}
```
