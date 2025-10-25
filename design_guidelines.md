# Wildlife Identification App - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from iNaturalist's scientific yet accessible interface, National Geographic's immersive photography presentation, and modern conservation platforms that balance educational content with emotional connection to wildlife.

**Core Principle**: Create an interface that feels like a field guide brought to digital life - trustworthy, educational, and visually engaging with nature imagery at its heart.

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, and 24 for consistent rhythm (p-4, m-8, gap-6, etc.)

**Container Strategy**:
- Main content area: `max-w-6xl mx-auto px-4`
- Upload zone: `max-w-3xl mx-auto` for focused interaction
- Results cards: `max-w-4xl mx-auto` for optimal readability

---

## Typography Hierarchy

**Font Stack**: 
- Primary: 'Inter' for clean, modern UI elements
- Accent: 'Merriweather' for species names and headings (adds natural, scientific elegance)

**Type Scale**:
- Hero headline: `text-5xl md:text-6xl font-bold` (Merriweather)
- Section headers: `text-3xl md:text-4xl font-bold` (Merriweather)
- Species names: `text-2xl font-semibold` (Merriweather)
- Body text: `text-base leading-relaxed` (Inter)
- Labels/captions: `text-sm font-medium` (Inter)
- Status badges: `text-xs font-bold uppercase tracking-wider` (Inter)

---

## Page Structure

### Hero Section (60vh on mobile, 70vh on desktop)
- Full-width background with nature photography (forest canopy, wildlife in habitat)
- Centered content with subtle overlay for text legibility
- Main headline explaining the app's purpose
- Subheadline describing AI-powered identification
- Primary CTA button with blur backdrop effect: `backdrop-blur-md bg-white/20 border border-white/30`
- Trust indicator below CTA: "Powered by AI • Conservation Data Verified"

### Upload Interface Section
**Layout**: Centered, spacious design with clear visual hierarchy

- Large drag-and-drop zone: 
  - Border: `border-2 border-dashed rounded-2xl`
  - Padding: `p-12 md:p-16`
  - States: Default, hover, active/dragging, uploading, success
  - Icon: Large camera/upload icon (6rem size)
  - Primary text: "Drop wildlife photo here"
  - Secondary text: "or click to browse • Supports JPG, PNG up to 10MB"
  
- OR divider with horizontal lines: `flex items-center gap-4` with lines and centered "OR" text

- Camera button option: `p-6 rounded-xl border-2` for mobile users to take photos directly

### Results Display Section
**Multi-Panel Layout**: Grid system `grid md:grid-cols-2 gap-8`

**Left Panel - Image Display**:
- Uploaded image in rounded container: `rounded-2xl overflow-hidden shadow-lg`
- Aspect ratio preserved, max height constraint
- Subtle border treatment

**Right Panel - Species Information**:
- Conservation status badge (prominent at top):
  - Badge styles: `px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2`
  - Icon indicator (dot or symbol) before status text
  
- Species name: Large, prominent typography
- Scientific name: Italicized, smaller, muted

- Information cards grid: `grid gap-4 mt-6`
  - Habitat card
  - Diet card  
  - Conservation status details card
  - Geographic range card
  
Each card: `p-6 rounded-xl border` with icon, label, and description

### Features Section (Full-width alternating layout)
**Three-Column Grid**: `grid md:grid-cols-3 gap-8`

Feature cards with:
- Large icon at top (4rem size from Heroicons)
- Feature title: `text-xl font-semibold`
- Description: `text-base leading-relaxed`
- Padding: `p-8 rounded-2xl`

Features to highlight:
1. AI-Powered Recognition
2. Conservation Status Data
3. Educational Resources

### How It Works Section
**Stepped Process**: Horizontal timeline on desktop, vertical on mobile

- Step indicators: Numbered circles `w-12 h-12 rounded-full flex items-center justify-center`
- Connecting lines between steps
- Step title and description below each indicator
- Grid: `grid md:grid-cols-4 gap-8`

### Footer
**Multi-column layout**: `grid md:grid-cols-4 gap-8`

Sections:
- About (logo, tagline, description)
- Quick Links (Home, How It Works, About Conservation)
- Resources (Wildlife Database, Educational Materials, API Access)
- Connect (Social links, Contact, Newsletter signup)

Newsletter: Input field with inline button, `flex items-center gap-2`

Bottom bar: Copyright, Privacy Policy, Terms

---

## Component Specifications

### Status Badges
Three distinct visual treatments (using borders/opacity, not colors):
- **Endangered**: Bold border, high contrast
- **Invasive**: Medium border, pattern indicator
- **Native**: Subtle border, checkmark icon

### Cards
- Border radius: `rounded-xl` for larger cards, `rounded-lg` for smaller
- Padding: `p-6` standard, `p-8` for feature cards
- Borders: `border-2` for emphasis, `border` for subtle
- Shadows: `shadow-md` on cards, `shadow-lg` for elevated elements

### Buttons
- Primary CTA: `px-8 py-4 rounded-full text-lg font-semibold`
- Secondary: `px-6 py-3 rounded-full text-base font-medium border-2`
- Icon buttons: `p-3 rounded-full`
- Hero buttons on images: `backdrop-blur-md bg-white/20 border border-white/30`

### Loading States
- Skeleton screens for image analysis
- Progress indicator: Circular with percentage
- Animated pulse for loading cards: `animate-pulse`

### Responsive Breakpoints
- Mobile-first approach
- Key breakpoint: `md:` (768px) for major layout shifts
- Stack to single column on mobile
- Upload zone reduces padding on mobile: `p-8 md:p-16`

---

## Images

### Hero Section
**Image**: Wide landscape nature photography - lush forest canopy or wildlife in natural habitat at golden hour. Should evoke conservation and natural beauty. High resolution, professionally shot wildlife photography.

### Feature Section Icons
Use Heroicons (outline style) for:
- Sparkles icon for AI Recognition
- Shield check for Conservation Data
- Academic cap for Educational Resources

### Results Section
User-uploaded wildlife photos will populate this section dynamically. Design should accommodate various aspect ratios and orientations gracefully.

---

## Accessibility & Interaction

- Focus states: `focus:ring-4 focus:ring-offset-2`
- All interactive elements min tap target: 44x44px
- Form labels: Always visible, never placeholder-only
- Skip to content link for keyboard navigation
- ARIA labels for icon-only buttons
- Alt text required for all images