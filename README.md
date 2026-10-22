<div align="center">
  <img src="public/favicon.svg" alt="EduPlanr logo" width="120" />

  <h1>EduPlanr</h1>

  <p>A study planner with a built-in AI tutor: schedule sessions, track your syllabus, keep notes and materials, and import subjects, topics and exam dates straight from your documents.</p>

  <a href="https://edu-planr.vercel.app"><strong>Live demo</strong></a>
</div>

## What it does

- Schedule study sessions on a calendar and time them with the study timer.
- Track a syllabus: add courses and topics, tick them off, and see progress per course with an estimated time for each topic.
- Keep notes in a rich-text editor, and links, documents and flashcards organised with tags and favourites.
- Ask the AI tutor to explain a concept, write practice questions or make flashcards. It calls Google Gemini on the server (2.5 Flash first, other Gemini models if that one is unavailable), with per-user authentication and rate limiting.
- Upload a course list, syllabus or exam timetable (PDF or text) and Gemini pulls out the subjects, the topics with estimated study hours, or each exam's date, time and venue.
- Exams, routine, subjects and notifications each have their own page.
- Sign in with Google, email and password, or try it anonymously.

## Tech stack

Next.js 14 (App Router) and TypeScript, Tailwind CSS, Framer Motion, Zustand for state, Firebase Auth and Cloud Firestore, the Firebase Admin SDK on the server, Google's Generative AI SDK, and Jest for tests. Deployed on Vercel.

## Running it locally

You need Node.js 24, a Firebase project, and a Gemini API key from Google AI Studio.

```bash
git clone https://github.com/arif481/EduPlanr.git
cd EduPlanr
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- the `NEXT_PUBLIC_FIREBASE_*` values from your Firebase project settings
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL` and `FIREBASE_ADMIN_PRIVATE_KEY` from a service account
- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) for the tutor and document features

Then start the dev server and open http://localhost:3000:

```bash
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npm test`, and `npm run export` for a static export.

## Project layout

```
src/
  app/
    (dashboard)/   calendar, dashboard, exams, materials, notes, notifications,
                   profile, routine, settings, subjects, syllabus, tutor
    api/           server routes for the tutor and document processing
    auth/          sign-in pages
  components/      layout and UI components
  lib/             Firebase setup, server auth, rate limiting, utilities
  services/        data access for sessions, materials, syllabus and the tutor
  store/           Zustand store
  types/           shared TypeScript types
```

## License

[MIT](LICENSE)
