# Design System — Velvet

The Velvet design language is **dark luxury editorial**. Every screen should feel like a private members' club at night — warm gold, near-black surfaces, generous whitespace, unhurried typography.

---

## Color Tokens

```typescript
// lib/theme.ts
export const ACCENT        = '#C9A84C'   // warm gold — primary CTA, active states
export const ACCENT_DIM    = 'rgba(201,168,76,0.12)'  // gold tint backgrounds
export const ACCENT_BORDER = 'rgba(201,168,76,0.30)'  // gold borders
export const ACCENT_GLOW   = 'rgba(201,168,76,0.20)'  // glow effects
export const ACCENT_LIGHT  = '#E8C96A'   // lighter gold for text on dark

// Backgrounds
export const BG_BASE       = '#0A0A0A'   // screen background
export const BG_SURFACE    = '#141414'   // card / sheet surface
export const BG_ELEVATED   = '#1C1C1C'   // elevated modal / overlay
export const BG_INPUT      = '#1A1A1A'   // text input background

// Borders
export const BORDER_DEFAULT = '#2A2A2A'  // standard dividers
export const BORDER_SUBTLE  = '#1E1E1E'  // barely-there borders

// Text
export const TEXT_PRIMARY   = '#F5F5F0'  // main body text (warm white)
export const TEXT_SECONDARY = '#888880'  // supporting text (muted)
export const TEXT_TERTIARY  = '#555550'  // hints, timestamps
export const TEXT_INVERSE   = '#0A0A0A'  // text on gold buttons

// Status colors
export const SUCCESS        = '#4CAF7C'  // approved, success
export const WARNING        = '#E8B84C'  // pending, waitlisted
export const ERROR          = '#E85C4C'  // rejected, error
export const INFO            = '#4C8CE8'  // informational

// Overlays
export const OVERLAY_DARK   = 'rgba(0,0,0,0.75)'
export const OVERLAY_LIGHT  = 'rgba(0,0,0,0.40)'
```

---

## Typography

```typescript
// lib/typography.ts

// Fonts used:
// - Playfair_Display_400Regular  (display headings — editorial character)
// - Playfair_Display_700Bold     (bold headings)
// - Playfair_Display_400Regular_Italic (italic accents)
// - DMSans_400Regular            (body text)
// - DMSans_500Medium             (medium emphasis body)
// - DMSans_700Bold               (strong body)

export const TYPE_SCALE = {
  // Display — big editorial moments
  display:    { fontFamily: 'Playfair_Display_700Bold',   fontSize: 36, lineHeight: 44 },
  h1:         { fontFamily: 'Playfair_Display_700Bold',   fontSize: 28, lineHeight: 36 },
  h2:         { fontFamily: 'Playfair_Display_400Regular',fontSize: 22, lineHeight: 30 },
  h3:         { fontFamily: 'DMSans_700Bold',             fontSize: 18, lineHeight: 26 },
  
  // Body — DM Sans for readability
  bodyLg:     { fontFamily: 'DMSans_400Regular',          fontSize: 17, lineHeight: 26 },
  body:       { fontFamily: 'DMSans_400Regular',          fontSize: 15, lineHeight: 23 },
  bodySm:     { fontFamily: 'DMSans_400Regular',          fontSize: 13, lineHeight: 20 },
  
  // UI — labels, captions, metadata
  label:      { fontFamily: 'DMSans_500Medium',           fontSize: 12, lineHeight: 16, letterSpacing: 1.5 },
  caption:    { fontFamily: 'DMSans_400Regular',          fontSize: 11, lineHeight: 16 },
  
  // Special
  quote:      { fontFamily: 'Playfair_Display_400Regular_Italic', fontSize: 17, lineHeight: 28 },
  number:     { fontFamily: 'Playfair_Display_700Bold',   fontSize: 42, lineHeight: 50 },
}
```

---

## Spacing Scale

Use multiples of 4. Standard Tailwind spacing applies.

```
4  → 1  (p-1)   tight — inside badges
8  → 2  (p-2)   small — compact UI elements
12 → 3  (p-3)   default button padding vertical
16 → 4  (p-4)   card padding, standard section margin
20 → 5  (p-5)   generous card padding
24 → 6  (p-6)   section spacing
32 → 8  (p-8)   large section gaps
48 → 12 (p-12)  hero sections
64 → 16 (p-16)  screen-level padding top/bottom
```

---

## Component Specifications

### GoldButton (Primary CTA)
```
Background:    #C9A84C
Text:          #0A0A0A (bold, 15px DM Sans)
Border Radius: 8px
Height:        52px
Letter Spacing: 0.5px
Pressed state: opacity 0.85 + scale 0.98
```

### GhostButton (Secondary)
```
Background:    transparent
Border:        1px solid rgba(201,168,76,0.30)
Text:          #C9A84C
Border Radius: 8px
Height:        52px
```

### MemberCard (Directory)
```
Background:    #141414
Border:        1px solid #2A2A2A
Border Radius: 12px
Padding:       16px
Avatar:        56px circle
Name:          Playfair Display 17px
Profession:    DM Sans 13px muted
City tag:      DM Sans 11px, gold pill
```

### EventCard
```
Cover Image:   full width, 180px height, rounded top 12px
Overlay:       gradient bottom 40px, black to transparent
Date badge:    absolute top-right, gold bg, black text
Title:         Playfair 18px over image bottom
Type pill:     "Virtual" / "In Person" — top left
```

### ApplicationStepCard
```
Background:    #141414
Step indicator: numbered dots in gold (active) / grey (inactive)
Progress bar:  linear, gold fill, animated on step change
```

### AdminApplicationRow
```
Background:    #141414 → hover #1C1C1C
Status badge:  pill — Pending (amber), Approved (green), Rejected (red)
Quick actions: Approve (green) / Reject (red) icon buttons
```

### DMThreadBubble (own)
```
Background:    ACCENT_DIM with gold border
Text:          TEXT_PRIMARY
Align:         right
Border Radius: 16px 16px 4px 16px
```

### DMThreadBubble (theirs)
```
Background:    #1C1C1C
Text:          TEXT_PRIMARY
Align:         left
Border Radius: 16px 16px 16px 4px
```

### InviteCard
```
Background:    linear gradient from #1C1C1C to #141414
Code display:  Playfair Display 28px monospace-style, gold
Copy button:   ghost, small
Used indicator: strikethrough + grey on used codes
```

---

## Iconography

Use **Lucide React Native** for all UI icons. Key icons used:

| Context | Icon |
|---------|------|
| Members tab | `Users` |
| Events tab | `Calendar` |
| Messages tab | `MessageCircle` |
| Profile tab | `User` |
| Admin | `Shield` |
| Approve | `CheckCircle` |
| Reject | `XCircle` |
| Invite | `Send` |
| RSVP Going | `Check` |
| Location | `MapPin` |
| Virtual | `Video` |
| Online dot | `Circle` (filled, green) |
| Copy code | `Copy` |
| Lock/exclusive | `Lock` |
| Crown/admin | `Crown` |
| Filter | `SlidersHorizontal` |

---

## Animation Guidelines

- **Page transitions**: Fade + slight upward slide (translateY: 20 → 0, opacity: 0 → 1, 300ms ease-out)
- **Card press**: Scale 1.0 → 0.97, duration 100ms
- **Application step progress**: Width animated with spring, stiffness 200
- **Online dot pulse**: Keyframe opacity 1 → 0.3 → 1, infinite, 2s
- **Toast entry**: Slide up from bottom + fade, 250ms spring
- **Approval confetti**: Lottie or emoji burst on admin approve (celebratory moment)
- **DM send**: Message bubble slides in from right + fade, 200ms
- **Loading skeleton**: Shimmer effect — gradient moves left to right over grey placeholder

---

## Screen Layout Patterns

### Tab Screen Template
```
SafeAreaView (bg: #0A0A0A)
  ScrollView
    Header (28px Playfair heading + optional subtitle)
    Content sections (16px horizontal padding, 24px section gap)
  FlatList (for directory/messages — better perf)
```

### Detail Screen Template  
```
Stack.Screen (transparent header over content)
ScrollView
  Hero image OR avatar block (full width, 240px)
  Content card (rounded top corners overlap hero, -20px margin)
  Action buttons (fixed bottom safe area)
```

### Application Step Template
```
SafeAreaView
  Step progress indicator (top)
  ScrollView
    Question heading (Playfair)
    Input(s)
  Bottom: Next/Back buttons (always visible, not in scroll)
```

---

## Empty States

Each empty state has:
1. A tasteful icon (32px, gold, low opacity)
2. A short Playfair italic headline
3. A DM Sans body line
4. Optional CTA button

Examples:
- **No messages yet:** "Your conversations await." + "Find a member and say hello."
- **No events yet:** "Something's coming." + "Watch this space."
- **Application queue empty:** "All caught up." + "No applications to review."

---

## Loading States

Use shimmer skeleton cards — never spinners for content loading.

Spinner (gold, small) is acceptable only for:
- Button loading state (replace label with spinner)
- Inline form submission

---

## Micro-copy & Brand Voice

- **Exclusive:** "Not everyone gets in." / "By invitation only." / "A curated circle."
- **Warm:** "Welcome to the circle." / "Glad you're here."
- **Confident:** "You've been approved." (not "Your application has been approved.")
- **Human:** Admin rejection: "We appreciate your interest. We're very selective about timing and fit." (never harsh)
- **Label casing:** ALL CAPS for section labels (use `label` type scale). Sentence case for body.
