# Sandkorn — CLAUDE.md

## What is Sandkorn?

Sandkorn ("grain of sand" in Danish) is a Danish digital activism and boycott platform. The central metaphor is grains of sand: each person who commits to boycotting a company adds a grain to a collective pile. The pile grows visually as more people join. Small individual actions become a visible collective force.

The project is currently a single `index.html` monolith (6,742 lines). It is being migrated incrementally to a Next.js app in the `sandkorn-next/` folder. **Keep `index.html` as a working fallback** — do not delete or break it.

## Tech Stack

- **Framework**: Next.js 15+ App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (with custom tokens mapped from CSS variables)
- **State**: Zustand (ephemeral UI) + TanStack Query (server data)
- **Backend**: Supabase (Postgres + Auth + Realtime)
- **Deploy**: Vercel
- **Fonts**: Syne, Syne Mono, Outfit, Caveat (via `next/font/google`)

## Key Domain Vocabulary

| Term | Meaning |
|---|---|
| **grain** | One boycott commitment by one person |
| **pile** | The collective visual of all grains (canvas animation) |
| **scope** | View level: `you` / `city` / `dk` (national) |
| **dossier** | Detail page for a company, alternative, or event |
| **bubble** | Issue tag: `war`, `pol`, `data`, `labour`, `env`, `tax`, `settler`, `mis`, `animal`, `indig` |
| **MitID** | Danish digital ID — used to verify real identity for grain counting |
| **GDPR email** | AI-generated deletion request sent to a company's data controller |

## Project Structure (`sandkorn-next/`)

```
app/
  layout.tsx           # Root layout with fonts + providers
  page.tsx             # Home: grain pile + scope tabs + stats
  companies/
    page.tsx           # Browse companies (filter by category)
    [id]/
      page.tsx         # Company dossier
      gdpr/page.tsx    # GDPR email generator
      guide/page.tsx   # Manual deletion guide
  alternatives/
    page.tsx
    [id]/page.tsx
  events/
    page.tsx
    [id]/page.tsx
  plan/page.tsx        # Multi-step plan wizard
  stats/page.tsx       # Goal / aggregate stats
  auth/
    login/page.tsx
    callback/page.tsx
  api/
    gdpr-email/route.ts  # Server route — Anthropic key stays here, never in client

components/
  layout/
    BottomNav.tsx
    TopBar.tsx
    DossierLayout.tsx
  grain/
    GrainPile.tsx       # Canvas — always use `'use client'` + `dynamic(..., { ssr: false })`
  company/
    CompanyRow.tsx
    CompanyCard.tsx
    OwnershipTree.tsx   # Canvas
  ui/
    Button.tsx
    Card.tsx
    Pill.tsx
    Bubble.tsx          # Issue tag (war/pol/data/labour/env/tax/settler/mis/animal/indig)
    Modal.tsx           # Bottom-sheet
    Toggle.tsx
    Toast.tsx

lib/
  data/
    companies.ts
    alternatives.ts
    events.ts
    gdprContacts.ts
    manualGuides.ts
  grain/
    physics.ts

store/
  ui.ts                # Zustand: modals, scope, plan flow, boycott flow
  provider.tsx         # Wraps QueryClientProvider + ZustandStoreProvider

types/
  company.ts
  alternative.ts
  event.ts
  gdpr.ts
```

## Key Conventions

### Canvas components
Always import canvas components with `dynamic` and `ssr: false`:
```tsx
const GrainPile = dynamic(() => import('@/components/grain/GrainPile'), { ssr: false })
```
The component file itself must have `'use client'` at the top.

### API key security (GDPR email)
**Never** call `api.anthropic.com` from the browser. The API key must stay in `app/api/gdpr-email/route.ts` as an env var (`ANTHROPIC_API_KEY`). The client calls `/api/gdpr-email` instead.

### Tailwind color tokens (mapped from CSS variables)
```
bg:    #f3f4f1
teal:  #1a7a6a  (teal-bg: #edf7f5, teal-border: #b8ddd8, teal-2: #156355)
sand:  #c8a464  (sand-2: #a07830, sand-3: #d4b47c)
amber: #8a6000  (amber-bg: #fdf7ee, amber-border: #e8d090)
warn:  #c05010  (warn-bg: #fdf2ec, warn-border: #f0c8a8)
border: #e2e4de
border2: #cdd0c8
mid:   #5a5f58
dim:   #9aa09a
```

### Fonts
- `font-sans` → Outfit (body)
- `font-syne` → Syne (headings, logo)
- `font-mono` → Syne Mono (labels, pills, tags)
- `font-caveat` → Caveat (handwritten accent)

### Mobile-first, 430px max-width
The app is primarily mobile (max-width 430px). Desktop breakpoint is `768px` with sidebar nav replacing bottom nav.

## Migration Phases

1. **Phase 0** (current): Scaffold + tokens + 3 core screens with static data
   - Home (`/`), Companies list (`/companies`), Company dossier (`/companies/[id]`)
2. **Phase 1**: All browse + dossier screens
3. **Phase 2**: Grain pile animation + home screen pixel-perfect
4. **Phase 3**: Action flows (plan wizard, GDPR email, manual guide, MitID)
5. **Phase 4**: Supabase + auth
6. **Phase 5**: Live grain stats, community features
7. **Phase 6**: Vercel deploy
