# EduPlanr 📚✨

<div align="center">
  <img src="public/logo.svg" alt="EduPlanr Logo" width="200" />
  
  **Your AI-Powered Study Companion**
  
  [![CI/CD](https://github.com/yourusername/eduplanr/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourusername/eduplanr/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
</div>

---

## 🌟 Features

### 📅 Smart Calendar & Planner
- **Auto-scheduling** based on your availability and study preferences
- **Visual calendar** with drag-and-drop session management
- **Study session tracking** with Pomodoro-style timer
- **Break reminders** to maintain focus

### 📚 Study Materials Management
- **CRUD operations** for notes, links, documents, and flashcards
- **Tag-based organization** for easy filtering
- **Favorites system** for quick access
- **Rich text editor** with formatting support

### 📋 Syllabus Tracking
- **Course management** with progress tracking
- **Topic-by-topic** completion tracking
- **Visual progress bars** showing course completion
- **Estimated time** tracking for each topic

### 🤖 AI-Powered Study Assistant
- **Chat interface** with GPT-4 integration
- **Concept explanations** in simple terms
- **Quiz generation** for practice
- **Flashcard creation** for memorization
- **Note summarization** for quick review

### 🎨 Futuristic UI/UX
- **Dark mode** by default with neon accents
- **Cyberpunk-inspired** design language
- **Fluid animations** with Framer Motion
- **Glass-morphism** effects
- **Fully responsive** for all devices

### 🔐 Secure Authentication
- **Google Sign-In** for quick access
- **Email/Password** authentication
- **Anonymous mode** for trying the app
- **Profile management** with customizable settings

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Firebase account** (for backend services)
- **OpenAI API key** (for AI tutor features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eduplanr.git
   cd eduplanr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase and OpenAI credentials:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
eduplanr/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│       ├── ci-cd.yml       # Main pipeline
│       └── quality.yml     # Code quality checks
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (dashboard)/   # Dashboard routes (protected)
│   │   │   ├── dashboard/ # Main dashboard
│   │   │   ├── calendar/  # Calendar view
│   │   │   ├── materials/ # Study materials
│   │   │   ├── syllabus/  # Syllabus tracking
│   │   │   ├── notes/     # Rich notes editor
│   │   │   ├── tutor/     # AI tutor chat
│   │   │   └── settings/  # User settings
│   │   ├── auth/          # Authentication pages
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── layout/        # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   └── ui/            # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Progress.tsx
│   │       ├── Badge.tsx
│   │       ├── Avatar.tsx
│   │       └── Loading.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── index.ts
│   ├── lib/               # Utilities and configurations
│   │   ├── firebase.ts    # Firebase initialization
│   │   └── utils.ts       # Helper functions
│   ├── services/          # API service layers
│   │   ├── authService.ts
│   │   ├── materialsService.ts
│   │   ├── syllabusService.ts
│   │   ├── sessionsService.ts
│   │   └── tutorService.ts
│   ├── store/             # Zustand state management
│   │   └── index.ts
│   └── types/             # TypeScript definitions
│       └── index.ts
├── .env.example           # Environment template
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Fluid animations
- **Zustand** - Lightweight state management
- **Heroicons** - Beautiful icons

### Backend
- **Firebase Auth** - Secure authentication
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **OpenAI API** - AI-powered features

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Primary deployment
- **Firebase Hosting** - Alternative deployment
- **Capacitor** - Mobile app builds

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Neon Cyan | `#00F5FF` | Primary accent |
| Neon Purple | `#A855F7` | Secondary accent |
| Neon Pink | `#EC4899` | Highlights |
| Neon Green | `#10B981` | Success states |
| Neon Yellow | `#F59E0B` | Warnings |
| Dark BG | `#0A0A0F` | Background |

### Typography
- **Display Font**: Space Grotesk
- **Body Font**: Inter

### Component Variants
All UI components support multiple variants:
- `default` - Standard appearance
- `primary` - Main action/emphasis
- `secondary` - Secondary actions
- `ghost` - Minimal style
- `neon` - Glowing effect
- `gradient` - Gradient backgrounds

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

---

## 📱 Mobile App (Capacitor)

Build native Android APK:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init

# Add Android platform
npx cap add android

# Build and sync
npm run build
npx cap sync

# Open in Android Studio
npx cap open android
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow the existing code style
- Use meaningful variable/function names
- Add comments for complex logic
- Write tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Firebase](https://firebase.google.com/) - Google's app development platform
- [OpenAI](https://openai.com/) - AI research and deployment
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

---

<div align="center">
  <p>Made with ❤️ by EduPlanr Team</p>
  <p>
    <a href="https://github.com/yourusername/eduplanr">GitHub</a> •
    <a href="https://eduplanr.vercel.app">Live Demo</a> •
    <a href="https://twitter.com/eduplanr">Twitter</a>
  </p>
</div>
