# Tutoring Website

A modern, responsive tutoring web application built with React, Vite, and Tailwind CSS, using Supabase as the backend. The platform supports tutor management, curriculum browsing, academic writing price estimation, and admin controls.


## 🌐 Live Preview

[🔗 Deployed Site](https://yourdomain.com)



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

App will run at http://localhost:5173.

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
