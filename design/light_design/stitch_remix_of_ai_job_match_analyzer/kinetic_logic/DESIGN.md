---
name: Kinetic Logic
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464555'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is rooted in **Modern Minimalism**, specifically tailored for high-output SaaS environments. It prioritizes clarity, speed of comprehension, and a "tool-first" mentality. The aesthetic avoids decorative flourishes in favor of functional precision, creating an environment of focused productivity.

The target audience consists of hiring managers and high-level talent who value efficiency over ornamentation. The emotional response is one of reliability, professional rigor, and calm control. All UI elements follow a strict logic of alignment and purpose, utilizing generous white space and a restrained palette to reduce cognitive load.

## Colors

The palette is intentionally limited to maintain professional focus. 

- **Primary Indigo (#4F46E5):** Reserved strictly for primary actions, active states, and critical navigational indicators.
- **Surface Neutral (#F9FAFB):** Used as the global background to provide a soft, low-glare canvas that differentiates from pure white (#FFFFFF) used for card surfaces.
- **Content Primary (#111827):** High-contrast dark neutral for headings and primary body text to ensure maximum legibility.
- **Content Secondary (#4B5563):** A softer grey for meta-data, labels, and supporting text.
- **Stroke (#E5E7EB):** A consistent, subtle boundary for defining structure without creating visual noise.

## Typography

This design system utilizes **Inter** across all levels to maintain a systematic, utilitarian appearance. The hierarchy is restrained, relying on weight shifts and subtle tight tracking on larger sizes rather than excessive scale.

- **Headlines:** Use Semi-Bold (600) with slight negative letter-spacing to appear grounded and authoritative.
- **Body:** Standardized at 16px for readability, with a 14px variant for denser data views.
- **Labels:** Small labels utilize a Semi-Bold weight and uppercase transform for clear categorization and UI signaling.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is housed within a maximum 1280px container for desktop to prevent line lengths from becoming unreadable, while using fluid 12-column grids internally.

- **Grid:** 12 columns for desktop, 8 for tablet, and 4 for mobile.
- **Rhythm:** An 8px linear scale is the primary driver for spacing, ensuring all elements align to a predictable vertical and horizontal cadence.
- **Safe Areas:** Page margins are set to 24px on mobile and scale to 48px+ on wider displays to maintain the "minimalist" sense of space.

## Elevation & Depth

Hierarchy is established through **Low-Contrast Outlines** and **Tonal Layering** rather than traditional shadows.

- **Level 0 (Background):** #F9FAFB.
- **Level 1 (Cards/Surfaces):** #FFFFFF with a 1px #E5E7EB border. 
- **Interaction (Hover):** A very light, diffused shadow (0px 4px 6px -1px rgba(0, 0, 0, 0.05)) is used only to signify interactivity on hover.
- **Depth:** Avoid multiple stacked shadows. If an element needs to feel "raised" (like a modal), use a slightly darker border or a 10% opacity backdrop overlay.

## Shapes

The design system uses a **Rounded (8px)** corner radius as the standard for all primary UI components (buttons, inputs, cards). This creates a modern, approachable feel while remaining professional and structured.

- **Small elements (Checkboxes):** Use 4px (Soft) to maintain geometric integrity.
- **Large containers:** Maintain the 8px standard to ensure a cohesive visual language.
- **Pills:** Only reserved for status tags and chips where a distinct contrast in shape is needed to differentiate them from functional buttons.

## Components

### Buttons & Controls
- **Primary Button:** Solid #4F46E5 background, white text, 8px radius. Compact padding (8px 16px).
- **Secondary Button:** White background, 1px #E5E7EB border, #111827 text.
- **Segmented Controls:** A light grey container (#F3F4F6) with a "sliding" white card for the active state. Used for toggling work modes (Remote/Hybrid/On-site).

### Form Elements
- **Input Fields:** 1px #E5E7EB border that shifts to #4F46E5 on focus. Labels are consistently 14px Medium weight, positioned above the field.
- **Chips/Tags:** Used for multi-select skills. Light indigo background (#EEF2FF) with #4F46E5 text and a small "x" icon for removal.

### Cards & Feeds
- **Job Cards:** White background, 1px border, no shadow by default. Clear hierarchy: Title (18px Semi-Bold), Company (14px Regular), and Metadata (12px Labels) at the bottom.
- **List Items:** Separated by thin 1px horizontal dividers (#E5E7EB) with consistent 16px vertical padding.

### Specialized Components
- **Activity Indicator:** A small, 8px solid dot (Indigo for active, Grey for inactive) used in talent feeds.
- **Compact Progress Bars:** Slim 4px height bars for profile completion or application stages.