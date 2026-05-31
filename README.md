# Aktivio — Summer Vibe Edition ☀️

**Aktivio** transforms Bishkek into a real-life multiplayer game. Teenagers and young adults explore the city, complete AI-generated challenges, earn XP, and compete for their district.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Leaflet** / react-leaflet (City Radar map)
- Mobile-first **PWA** (manifest + standalone display)

## Features (MVP)

| Feature | Route | Description |
|---------|-------|-------------|
| City Radar | `/` | Interactive Bishkek map with challenges & live teams |
| AI Missions | `/missions` | Context-aware mission generator (location, budget, time) |
| AI Assistant | `/` (Radar) | Салкын context advisor — chat overlay on home map |
| Публикации | `/publications` | Post creation, mission evidence, reactions, place cards |
| Leaderboards | `/leaderboard` | District War, City & Friends rankings |
| Profile | `/profile` | Editable profile, interests, premium achievement cards |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — best in mobile viewport (375px).

## Project Structure

```
src/
├── app/                    # Next.js pages
├── components/
│   ├── home/               # Dashboard & map UI
│   ├── map/                # Leaflet map components
│   ├── missions/           # AI mission generator
│   ├── threads/            # Vibe Threads feed
│   ├── leaderboard/        # Rankings
│   ├── profile/            # User profile
│   ├── layout/             # App shell, bottom nav
│   └── ui/                 # Reusable UI primitives
├── hooks/                  # React hooks (user, map)
└── lib/
    ├── types/              # TypeScript domain types
    ├── constants/          # Districts, categories, levels
    ├── mock/               # Bishkek-flavored mock data
    ├── services/           # Mission generator, XP, verification
    └── utils/              # Helpers
```

## Districts

Sverdlovsky · Pervomaisky · Oktyabrsky · Leninsky

## Branch

`feature/aktivio-summer-vibe-mvp`
