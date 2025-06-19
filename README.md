# Tutoring Website

A modern, responsive tutoring web application built with React, Vite, and Tailwind CSS, using Supabase as the backend. The platform supports tutor management, curriculum browsing, academic writing price estimation, and admin controls.


## 🌐 Live Preview

[🔗 Deployed Site](https://kaycee-tutring.vercel.app)





##  Features

### Tutors
- View a grid of tutors with profile pictures and qualifications.
- Click to view full tutor details in a dark-themed modal.
- Admin panel for:
  - Adding, editing, deleting, and archiving tutors.
  - Uploading and replacing tutor images (with Supabase storage cleanup).

###  Curriculums
- Browse educational curriculums with descriptions and subjects.
- Toggle subject list dynamically.
- Admin panel to:
  - Add/edit/delete curriculums.
  - Assign subjects per curriculum.

###  Assignment Pricing Calculator
- Calculate academic writing prices based on word count or pages.
- Automatic currency conversion using [ExchangeRate API](https://www.exchangerate-api.com/).
- Supports multiple currencies (USD, MWK, EUR, etc.).

### Admin Dashboard
- View summaries (tutor count, curriculum count).
- Sidebar layout with CRUD views for tutors and curriculums.
- Upload/delete images directly to/from Supabase storage.

---

## Tech Stack

 1. React + Vite  - Frontend framework             
 2. Tailwind CSS  - Styling and layout 
 3. Supabase  - Backend (Database + Storage)
 4. ExchangeRate API - Currency conversion
 5. React Router  - Client-side routing             

---

## Getting Started

### 1. Clone the Repository

git clone https://github.com/Gabiel265/tutoring-site.git
cd tutoring-site

2. Install Dependencies

npm install

3. Setup Environment Variables
Create a .env file in the root:

env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
You can get your Exchange Rate API key from https://www.exchangerate-api.com

4. Run Locally

npm run dev

App will run at http://localhost:5173. - add /admin (to access administrator side)

-Admin side will work only after supabase connectiona and user is added in the admin table.


Table schemars:
create table public.admin_users (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  role text null default 'admin'::text,
  created_at timestamp with time zone null default now(),
  constraint admin_users_pkey primary key (id),
  constraint admin_users_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.subjects (
  id uuid not null default gen_random_uuid (),
  name text not null,
  curriculum_id uuid null,
  description text null,
  created_at timestamp with time zone null default now(),
  constraint subjects_pkey primary key (id),
  constraint subjects_curriculum_id_fkey foreign KEY (curriculum_id) references curriculums (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.curriculums (
  id uuid not null default gen_random_uuid (),
  name text not null,
  description text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone not null default now(),
  price numeric(10, 2) null,
  archived boolean null default false,
  constraint curriculums_pkey primary key (id),
  constraint curriculums_name_key unique (name)
) TABLESPACE pg_default;


create table public.tutors (
  id uuid not null default gen_random_uuid (),
  name text not null,
  profile_picture text null,
  qualification text null,
  bio text null,
  is_featured boolean null default false,
  created_at timestamp with time zone null default now(),
  archived boolean null default false,
  updated_at timestamp without time zone not null default now(),
  constraint tutors_pkey primary key (id)
) TABLESPACE pg_default;


🗂 Folder Structure

src/
├── components/
│   ├── Tutors.jsx
│   ├── TutorModal.jsx
│   ├── CurriculumSection.jsx
│   ├── AssignmentForm.jsx
│   ├── AdminDashboard.jsx
│   └── ...
├── data/
│   └── supabaseClient.js
├── pages/
│   ├── AdminAddTutor.jsx
│   ├── AdminEditTutor.jsx
│   ├── AdminCurriculums.jsx
│   └── ...
├── App.jsx
└── main.jsx
