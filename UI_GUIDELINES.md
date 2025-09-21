# UI Style Guidelines for this project

## 1. Core Design Philosophy
The interface leans into a modern, futuristic aesthetic that combines airy glassmorphism, luminous gradients, and high contrast typography. Surfaces are layered with subtle blur and soft shadows, while interactive elements use vibrant sky-to-indigo accents to emphasize the AI-forward personality. Layouts balance generous white space with dense, information-rich cards so workflows feel both premium and approachable.

## 2. Color Palette
All base colors are defined as CSS variables in `app/globals.css` and remapped to Tailwind tokens via `@theme inline`. Light and dark themes share the same semantic tokens; only the underlying values shift.

### Primary Colors
| Token | HEX / RGBA | Usage |
| --- | --- | --- |
| `primary` | `#0EA5E9` | Primary CTAs, gradients, focus rings (`focus-visible:outline-ring`).|
| `primary-foreground` | `#FFFFFF` | Text/icon color on primary surfaces.|
| `gradient-indigo` | `#6366F1` | Gradient stop for hero buttons and badges (`to-indigo-500`).|
| `accent-sky` | `#7DD3FC` | Icon tint and secondary emphasis (`text-sky-300`).|

### Secondary & Accent Colors
| Token | HEX / RGBA | Usage |
| --- | --- | --- |
| `secondary` | `#F1F5F9` (light) / `rgba(255,255,255,0.05)` (dark) | Neutral pill backgrounds, secondary buttons, nav container.|
| `secondary-foreground` | `#0F172A` (light) / `#E2E8F0` (dark) | Text on secondary surfaces.|
| `accent` | `#F1F5F9` (light) / `rgba(255,255,255,0.05)` (dark) | Hover states on secondary/ghost elements.|
| `accent-foreground` | `#0F172A` (light) / `#E2E8F0` (dark) | Text/icon color for accent backgrounds.|

### Neutral / Grayscale
| Token | HEX / RGBA | Usage |
| --- | --- | --- |
| `background` | `#FFFFFF` (light) / `#020617` (dark) | Body background.|
| `foreground` | `#0F172A` (light) / `#E2E8F0` (dark) | Default text.|
| `card` | `#FFFFFF` (light) / `rgba(255,255,255,0.05)` (dark) | Card surfaces, glass panes.|
| `card-foreground` | `#0F172A` (light) / `#E2E8F0` (dark) | Body text inside cards.|
| `muted` | `#F8FAFC` (light) / `rgba(255,255,255,0.05)` (dark) | Muted backgrounds, badges.|
| `muted-foreground` | `#64748B` (light) / `#94A3B8` (dark) | Secondary text, helper copy.|
| `border` | `#E2E8F0` (light) / `rgba(255,255,255,0.1)` (dark) | Card borders, inputs, dividers.|
| `input` | `#FFFFFF` (light) / `rgba(255,255,255,0.1)` (dark) | Form controls, glass backgrounds.|

### Semantic Colors
| Token | HEX / RGBA | Usage |
| --- | --- | --- |
| `ring` | `#0EA5E9` | Focus outlines.|
| `destructive` | `#EF4444` | Danger buttons (`variant="danger"`), destructive banners.|
| `destructive-foreground` | `#FFFFFF` | Text on destructive surfaces.|
| `success-surface` | `rgba(16,185,129,0.1)` (`bg-emerald-500/10`) | Upload success banners, toasts.|
| `success-border` | `rgba(52,211,153,0.3)` (`border-emerald-400/30`) | Success container borders.|
| `success-foreground` | `#D1FAE5` (`text-emerald-100`) | Success text/icons.|
| `error-surface` | `rgba(244,63,94,0.1)` (`bg-rose-500/10`) | Error feedback blocks, toasts.|
| `error-border` | `rgba(251,113,133,0.3)` (`border-rose-400/30`) | Error borders.|
| `info-surface` | `rgba(56,189,248,0.1)` (`bg-sky-500/10`) | Neutral info tiles, drag states.|
| `info-border` | `rgba(56,189,248,0.4)` (`border-sky-400/40`) | Info borders, numbered badges.|
| `indigo-surface` | `rgba(99,102,241,0.1)` (`bg-indigo-500/10`) | Chat bubbles, AI cards, profile highlights.|
| `glass-overlay` | `rgba(255,255,255,0.04-0.1)` | Body gradients, backdrop layers.|

## 3. Typography
- **Font Family:** Primary Sans `var(--font-geist-sans)` (Geist), monospace `var(--font-geist-mono)`.
- **Case & Tracking:** Frequent use of uppercase badges with wide tracking (`tracking-[0.2em]`-`[0.3em]`).
- **Font Weight:** `font-semibold` (600) for headings, `font-medium` (500) for CTA text, `font-normal` (400) otherwise.

| Token | Tailwind Class | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- | --- |
| `H1` | `text-4xl sm:text-5xl md:text-6xl` | 2.25-3.75rem | 600 | `tracking-tight` (~1.1) | Hero headline (`app/page.tsx`).|
| `H2` | `text-3xl` | 1.875rem | 600 | `leading-tight` (~1.25) | Section headers (`Product workflow`).|
| `H3` | `text-2xl` | 1.5rem | 600 | 1.3 | Card titles, page subheads.|
| `H4` | `text-xl` | 1.25rem | 600 | 1.3 | Card sub-headers, list titles.|
| `Body` | `text-base` | 1rem | 400-500 | `leading-relaxed` (~1.625) | Paragraph copy, helper text.|
| `Secondary` | `text-sm` | 0.875rem | 400-500 | 1.5 | Notes, captions, muted descriptions.|
| `Badge` | `text-xs uppercase tracking-[0.2em]` | 0.75rem | 600 | 1.4 | Pill badges, status labels.|
| `Mono` | `font-mono text-sm` | 0.875rem | 500 | 1.4 | Data readouts (rare, available via Geist Mono).|

## 4. Spacing and Sizing
- **Base Unit:** 4px scale (`1 tailwind increment = 0.25rem`).
- **Common Stack Spacing:** `gap-4` (16px) for compact stacks, `gap-6` (24px) for sections, `gap-10` (40px) for page-level separation.

| Token | Tailwind | Pixels | Notes |
| --- | --- | --- | --- |
| `space-xxs` | `1` | 4px | Tight element gaps (icon + label).|
| `space-xs` | `2` | 8px | Badge padding, button icon gaps.|
| `space-sm` | `3` | 12px | Inline badges, chat metadata.|
| `space-md` | `4` | 16px | Primary layout gaps, button padding.|
| `space-lg` | `6` | 24px | Card padding (`p-6`), grid gaps.|
| `space-xl` | `8` | 32px | Section padding, hero spacing.|
| `space-2xl` | `10` | 40px | Hero CTA stack, dropzone padding.|
| `space-3xl` | `12` | 48px | Full-width section padding, container vertical rhythm.|

## 5. Layout
- **Grid System:** Fluid CSS grid and flex layouts. Lists typically use 1 column on mobile, switch to 2-column (`sm:grid-cols-[1.25fr_1fr]`) or 3-column (`md:grid-cols-3`) at breakpoints. No fixed 12-column requirement, but 24px gaps keep rhythm consistent.
- **Breakpoints:** Tailwind defaults (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`). Most responsive rules kick in at `sm` and `md`.
- **Containers:** Primary shell `max-w-6xl` (1152px) centered with `px-6` / `sm:px-8`. Subsections use `max-w-3xl` (768px) for readable copy blocks.
- **Background Layers:** Root layout stacks two absolute gradients to create ambient light (`radial-gradient` sky/indigo + linear overlay). Maintain both layers for new pages to keep brand atmosphere.

## 6. Border Radius
| Token | Tailwind | Pixels | Usage |
| --- | --- | --- | --- |
| `radius-pill` | `rounded-full` | 9999px | Buttons, badges, nav pills.|
| `radius-xl` | `rounded-2xl` | 16px | Inputs, textareas, status cards.|
| `radius-xxl` | `rounded-3xl` | 24px | Cards, dropzones.|
| `radius-hero` | `rounded-4xl` | 32px | Hero panels, feature sections.|
| `radius-chat` | `rounded-[28px]` | 28px | Chat bubbles for consistent oval profile.|
| Global base | `var(--radius)` = `0.75rem` (12px) | Tailwind tokens reference this for consistent rounding.|

## 7. Shadows & Elevation
- **Standard:** `shadow-md`, `shadow-lg`, `shadow-2xl` for button and card depth.
- **Custom glows:**
  - `shadow-indigo-500/30` & `shadow-sky-500/30` on primary buttons.
  - `shadow-[0_0_30px_rgba(56,189,248,0.25)]` to highlight drag-over states.
  - `shadow-[0_15px_40px_rgba(129,140,248,0.18)]` and `shadow-[0_20px_45px_rgba(15,23,42,0.35)]` on chat/profile cards for cinematic depth.
- **Backdrop blur:** Frequent `backdrop-blur` / `backdrop-blur-lg` to amplify glass appearance; pair with translucent backgrounds.

## 8. Iconography
- **Library:** `lucide-react`.
- **Style:** Outline icons scaled between `h-4 w-4` (buttons) and `h-11 w-11` (feature cards). Maintain a `1.5px` stroke default; apply soft tint fills (e.g., `bg-indigo-500/20`) when icons sit in decorative containers.
- **Usage:** Icons generally sit inside rounded squares or pills with translucent brand tints to reinforce the gradient-driven look.

## 9. Component Documentation
The project follows a composable pattern with reusable primitives in `components/ui` and page-specific modules. Reuse these patterns to ensure consistency.

### Button (`components/ui/button.tsx`)
- **Base Style:** `inline-flex`, pill-shaped (`rounded-full`), medium weight, 200ms transitions, disabled state lowers opacity to 60% and sets `cursor-not-allowed`.
- **Variants:**
  - `primary` (default): `bg-gradient-to-r from-sky-500 to-indigo-500`, white text, drop shadow glow. Hover lightens gradient; focus uses `outline-ring`.
  - `secondary`: Neutral glass button `bg-secondary` with border. Hover shifts to `bg-accent`.
  - `ghost`: Transparent background, inherits text color, hover adds `bg-accent` wash.
  - `danger`: Solid `bg-destructive`, rosy shadow, focus outline swaps to `outline-rose-300`.
- **Sizes:**
  - `sm`: `h-9 px-4 text-sm` (Use for toolbars, icon buttons).
  - `md`: `h-11 px-6 text-sm md:text-base` (Default).
  - `lg`: `h-12 px-8 text-base md:text-lg` (Hero CTAs).
- **States:**
  - `:hover` implemented via gradient tweaks or background swap.
  - `:focus-visible` outlines use `outline-2 outline-offset-2` with theme ring color.
  - `:disabled` toggled by logic; keep disabled classes intact for accessibility.
- **Usage Example:**
  ```tsx
  <Button size="lg" onClick={handleSubmit}>
    Send
  </Button>
  ```

### Card Suite (`components/ui/card.tsx`)
- **Base Style:** `Card` uses `rounded-3xl border border-border bg-card p-6 shadow-lg backdrop-blur`. It acts as a glass panel; always supply content via subcomponents.
- **Subcomponents:**
  - `CardHeader`: `mb-4 flex flex-col gap-2` for stacked titles.
  - `CardTitle`: `text-xl font-semibold tracking-[-0.02em]` with `text-card-foreground`.
  - `CardDescription`: `text-sm text-muted-foreground leading-relaxed`.
  - `CardContent`: Simple wrapper inheriting `text-card-foreground`.
- **Variants:** No explicit variants; override `className` for contextual styling (e.g., `backdrop-blur-lg`, themed borders).
- **States:** Cards are static; rely on hover or shadow transitions by adding classes when needed.

### Input (`components/ui/input.tsx`)
- **Base Style:** Full-width, `h-12`, `rounded-2xl`, bordered with `border-border`, `bg-input`, `px-4`. Placeholder uses `text-muted-foreground` to ensure contrast.
- **States:** Focus ring via `focus-visible:outline outline-2 outline-offset-2 outline-ring`. Disabled styling inherited from Tailwind defaults; set via prop.
- **Usage:**
  ```tsx
  <Input placeholder="Search documents" />
  ```

### Textarea (`components/ui/textarea.tsx`)
- **Base Style:** `rounded-2xl`, `border border-border`, `bg-input`, `px-4 py-3`, `text-sm`. Chat page overrides with thicker styling (`rounded-3xl`, translucent background, custom shadow`).
- **States:** Same focus treatment as `Input` plus support for `disabled` and `readonly` via props.

### Theme Toggle (`components/ui/theme-toggle.tsx`)
- **Base Style:** Ghost `Button` sized `h-9 w-9`, icon-only.
- **States:** Disabled skeleton shown while mounting to prevent hydration mismatch. Active toggle swaps between `Sun` and `Moon` icons; animation relies on `transition-all`.

### Site Header (`components/site-header.tsx`)
- **Layout:** Flex container `max-w-6xl`, `px-6`/`sm:px-8`, vertical stack on mobile, horizontal alignment on `md`.
- **Typography:** App title `text-lg font-semibold tracking-tight`; tagline `text-sm text-muted-foreground`.
- **States:** Contains `SiteNav` and `ThemeToggle`; ensure header remains inside root layout’s gradient shell.

### Site Navigation (`components/site-nav.tsx`)
- **Base Style:** Pills inside `nav` container with `rounded-full border border-border bg-card p-1 text-sm font-medium shadow-lg backdrop-blur`.
- **Active State:** `bg-primary text-primary-foreground shadow`. Inactive links use `text-card-foreground` & `hover:bg-accent`.
- **Routing:** Active route determined via `usePathname()` equality. Keep label casing Title Case.

### Site Footer (`components/site-footer.tsx`)
- **Base Style:** `border-t border-white/10 bg-slate-950/40`, copy set in `text-slate-400` with `text-xs` on mobile -> `text-sm` on desktop.
- **Links:** Simple text links with `hover:text-slate-200`. Maintain consistent spacing via `flex` wraps.

### Upload Form (`components/upload/upload-form.tsx`)
- **Dropzone:** `rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center`. Drag active state adds cyan glow (`border-sky-400/60`, `bg-sky-500/10`, custom shadow).
- **Icon:** `UploadCloud` sized `h-14 w-14 text-sky-300`.
- **Body Copy:** Primary prompt `text-lg font-medium`, helper `text-sm text-muted-foreground` with actionable link styled `text-sky-300 underline` on hover.
- **Status Blocks:**
  - Uploading: `rounded-3xl border border-border bg-card p-5`, textual row with `Loader2` spinner (`animate-spin`).
  - Success: `border border-emerald-400/30 bg-emerald-500/10 text-emerald-100` with `CheckCircle2`.
  - Error: `border border-rose-400/30 bg-rose-500/10 text-rose-200`.
- **Toasts:** Fixed top-right glass toasts tinted emerald or rose. Close action uses uppercase micro button.
- **Actions:** Buttons at footer (`variant="danger"` & `secondary`) share `size="sm"`; disabled when uploading or deleting.

### N8N Upload Form (`components/n8n/n8n-upload-form.tsx`)
- Mirrors `UploadForm` but theme shifts darker: dropzone uses `border-white/12 bg-white/5`, text colors switch to white/silver. Status cards reuse emerald/rose semantics. Failed uploads annotated with `text-rose-200` list.

### Chat Panel (`components/chat/chat-panel.tsx`)
- **Container:** Column stack `space-y-8`, overall text inherits `text-foreground`.
- **Message List:** Scrollable region `max-h-[58vh] overflow-y-auto` with `gap-8`. Messages align right for user, left for assistant.
- **Bubbles:**
  - User: `bg-gradient-to-r from-sky-500 to-indigo-500`, pill radius `rounded-[28px]`, white text, deep shadow.
  - Assistant: `bg-card text-card-foreground` with optional AI avatar pill (`bg-indigo-500/80`).
  - Metadata badge uses uppercase microcopy with `MessageCircle` icon.
- **Attachments:** Download link shown as inline pill `rounded-full border border-border bg-secondary px-3 py-1 text-xs`.
- **Profiles:** Candidate cards `rounded-2xl border border-indigo-400/30 bg-indigo-500/10` with uppercase headings and two-column info grid.
- **Composer:** Textarea overrides to `min-h-[360px]`, translucent background `bg-white/10`, heavy shadow, `focus-visible:ring-2 focus-visible:ring-sky-500`. Helper text `text-sm text-muted-foreground`. Buttons reuse primary/secondary variants.
- **Error Banner:** `rounded-3xl border border-destructive bg-destructive/10 text-destructive-foreground`.

### Theme Provider (`components/theme-provider.tsx`)
Wrap all pages with `ThemeProvider` (`next-themes`) configured for `defaultTheme="dark"`, `enableSystem`, and `disableTransitionOnChange`. All color tokens respond automatically to the `class` attribute.

### Global Patterns
- **Scrollbars:** Custom WebKit scrollbar: 10px width, translucent track, sky thumb with hover state.
- **Gradients & Overlays:** Maintain dual absolute layers in `RootLayout` for signature glow. New full-width sections should respect the ambient lighting by using transparent backgrounds (`bg-card`, `bg-white/5`) instead of opaque solids.
- **Focus & Accessibility:** Every interactive element sets `focus-visible` styles with theme-colored outlines. Preserve these classes when extending components.
- **Motion:** Animations kept subtle—200ms transitions, spinner icon uses `animate-spin`. Avoid introducing long-duration transitions that disrupt the snappy feel.

## Implementation Checklist for New UI
- Reuse primitives (`Button`, `Card`, `Input`, `Textarea`) before rolling custom components.
- Prefer pill shapes (`rounded-full`) for primary actions, `rounded-3xl`+ for surface containers.
- Pair bright gradients with muted, glassy cards to maintain contrast hierarchy.
- When introducing status states, align with existing semantic color recipes (emerald for success, rose for failure, sky/indigo for info).
- Respect spacing scale: 24px (`gap-6`/`p-6`) for most blocks, 40px (`gap-10`) for page-level separation.
- Apply ambient gradient background layers on every top-level page.