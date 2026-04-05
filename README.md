# Web Journal

A personal journaling app with a **macOS 26 Tahoe liquid glass** design, built with React, TypeScript, and Vite.

---

## Features

- **Multiple Journals** — Create and organize entries into separate journals, each with a custom colour
- **Mood Tracking** — Tag each entry with your mood (Happy, Excited, Neutral, Anxious, Sad)
- **Tags** — Add searchable tags to any entry
- **Dark & Light Mode** — Full macOS Tahoe vibrancy in both modes, toggled from the profile menu
- **Collapsible Sidebar** — Expand or collapse the sidebar to focus on writing
- **Local Storage** — All your entries are saved privately in your browser

---

## Design

Styled after **macOS 26 Tahoe** — Apple's liquid glass design language featuring:

- Ultra-translucent frosted-glass panels (`blur(60px) saturate(220%)`)
- Specular inner highlight at the top edge of every surface
- Gradient primary buttons with soft glow shadows
- Thin `0.5px` dividers and borders
- System-native SF Pro typography
- Adaptive dark and light vibrancy materials

---

## Getting Started

### Requirements

- [Node.js](https://nodejs.org) (LTS recommended)

### Install & Run

```bash
# Navigate to the project
cd ~/Downloads/Web\ Journal\ -\ Edited\ by\ Claude

# Install dependencies (first time only)
npm install

# Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy anywhere (Netlify, Vercel, GitHub Pages, etc.).

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility styling |
| [Radix UI](https://radix-ui.com) | Accessible component primitives |
| [shadcn/ui](https://ui.shadcn.com) | Pre-built component library |
| [Lucide React](https://lucide.dev) | Icons |
| [React Router](https://reactrouter.com) | Client-side routing |
| [date-fns](https://date-fns.org) | Date formatting |

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Layout.tsx       # App shell, sidebar + top bar
│   │   ├── Sidebar.tsx      # Journal list, dark/light aware
│   │   └── ProfileMenu.tsx  # Theme toggle + user menu
│   ├── context/
│   │   ├── BookContext.tsx   # Journal state
│   │   └── ThemeContext.tsx  # Dark / light mode
│   ├── pages/
│   │   ├── Home.tsx         # Entry list
│   │   ├── NewEntry.tsx     # Create entry
│   │   └── EntryDetail.tsx  # View / edit entry
│   └── utils/
│       └── storage.ts       # localStorage helpers
└── styles/
    ├── index.css            # Entry point
    ├── theme.css            # Tahoe design tokens
    └── tailwind.css         # Tailwind config
```

---

## License

Personal use. UI components from [shadcn/ui](https://ui.shadcn.com/) (MIT). Icons from [Lucide](https://lucide.dev/) (ISC).
