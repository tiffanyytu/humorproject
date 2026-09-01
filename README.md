# Almost Crack'd: AI Humor Generator & Community Feed
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat&logo=typescript) ![Supabase](https://img.shields.io/badge/Supabase-green?style=flat&logo=supabase) ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css)

**🚀 Live Demo:** [https://humorproject.vercel.app/](https://humorproject.vercel.app/)

**GitHub Repository Topics:** `nextjs`, `typescript`, `supabase`, `ai`, `full-stack`, `vision-api`, `user-portal`

### What This Project Does
Almost Crack'd is an AI-powered comedy platform that takes ordinary user-uploaded photos and turns them into hilarious memes (like absurd LinkedIn influencer posts or dramatic Shakespearean roasts). Users can browse a community feed of generated jokes, or log into the "VIP Area" to upload their own images, generate captions, and vote on other users' creations.

### My Contribution
As the sole full-stack developer, I engineered the entire application from the ground up. This included designing the responsive UI, integrating Supabase for authentication and database management, handling S3 bucket file uploads, and connecting the frontend to the backend AI generation pipeline. 

### Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Next.js Server Actions, Supabase (PostgreSQL)
* **Auth & Storage:** Supabase Auth (Google/Email), Supabase Storage / S3

### Key Technical Decisions & Features
* **4-Step Image Generation Pipeline:** Built a robust upload flow utilizing presigned URLs to securely transfer images to cloud storage before passing them to the AI vision models.
* **Responsive Masonry-Style Feed:** Implemented a clean, 3-column grid layout for the community feed that dynamically adjusts to mobile viewports to prevent scrolling fatigue.
* **Interactive Voting System:** Engineered a real-time UI that allows authenticated users to cast upvotes/downvotes, writing directly to a relational `caption_votes` table.
* **UX Polish:** Added asynchronous loading overlays and UI "decluttering" (hiding cards after a vote is cast) to make the app feel modern and snappy.

### How to Run It Locally

1. Clone the repository.
2. Install dependencies:
   `npm install`
3. Set up your `.env.local` file with your Supabase keys:
   `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`
   `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`
4. Run the development server:
   `npm run dev`
5. Open http://localhost:3000 in your browser.
