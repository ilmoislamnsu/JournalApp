# Web Journal

A simple personal journaling app built with React, TypeScript, and Vite. Designed to feel smooth, minimal, and actually usable without trying too hard.

---

## Features

- **Multiple Journals**  
  Organize entries into separate journals with custom colors

- **Mood Tracking**  
  Tag entries with moods like Happy, Neutral, Anxious, etc.

- **Tags**  
  Add and filter entries using custom tags

- **Dark & Light Mode**  
  Clean support for both themes, switchable from the profile menu

- **Collapsible Sidebar**  
  Hide distractions when you just want to write

- **Local Storage**  
  Everything stays in your browser. No accounts, no syncing

---

## Design

Inspired by macOS-style glass UI, but kept practical.

- Subtle blur and transparency
- Soft gradients and shadows
- Clean spacing and readable typography
- Focus on clarity over decoration

---

## Getting Started

### Requirements

- Node.js (LTS recommended)

### Install & Run

```bash
cd ~/Downloads/Web\ Journal

npm install
npm run dev
```

Open in your browser:

```
http://localhost:5173
```

### Build

```bash
npm run build
```

Production files will be in the `dist/` folder.

---

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- shadcn/ui
- Lucide Icons
- React Router
- date-fns

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProfileMenu.tsx
│   ├── context/
│   │   ├── BookContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── NewEntry.tsx
│   │   └── EntryDetail.tsx
│   └── utils/
│       └── storage.ts
└── styles/
    ├── index.css
    ├── theme.css
    └── tailwind.css
```

---

## Notes

- No backend by design  
- No user accounts  
- Built for personal use and quick iteration  

---

## License

Personal use  
UI components: shadcn/ui (MIT)  
Icons: Lucide (ISC)
