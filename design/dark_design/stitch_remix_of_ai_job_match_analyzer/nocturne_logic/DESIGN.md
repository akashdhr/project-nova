---
name: Nocturne Logic
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#bcc7de'
  on-tertiary: '#263143'
  tertiary-container: '#8691a7'
  on-tertiary-container: '#1f2a3c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  surface-charcoal: '#1e293b'
  surface-navy: '#0f172a'
  accent-indigo: '#6366f1'
  accent-violet: '#a855f7'
  border-subtle: '#334155'
  text-primary: '#f8fafc'
  text-secondary: '#94a3b8'
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
    letterSpacing: 0.05em
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
  gutter: 24px
  container-max: 1280px
---

## Brand & Style

This design system is a sophisticated dark-mode evolution of its predecessor, transitioning from a tool-first SaaS aesthetic into a high-performance, immersive "command center" environment. It utilizes a **Modern Minimalism** approach with **Glassmorphic** accents to create depth without clutter.

The target audience remains high-level talent and managers, now operating within a workspace that reduces eye strain and emphasizes vibrant data visualization. The emotional response is one of "focused intensity" and "premium precision." The UI leverages deep charcoal and navy foundations to make indigo and violet primary actions feel luminous and urgent, maintaining a sleek, professional edge that feels futuristic yet grounded.

## Colors

The color palette is optimized for high-contrast legibility in low-light environments, using a layered approach to define hierarchy.

- **Primary Indigo (#6366f1):** The core interactive color. Used for primary buttons, active toggles, and critical focus states.
- **Secondary Violet (#a855f7):** An accent color used for secondary actions, data visualizations, and highlighting specific talent attributes.
- **Neutral Navy (#0f172a):** The global background (Level 0), providing a deep, stable base.
- **Surface Charcoal (#1e293b):** The primary container color (Level 1), used for cards and headers to create subtle separation from the background.
- **Text Strategy:** All headings use **Text-Primary (#f8fafc)** for maximum "pop" against dark backgrounds, while supporting text uses **Text-Secondary (#94a3b8)** to maintain a comfortable reading hierarchy.

## Typography

This system uses **Inter** for its neutral, systematic clarity. In dark mode, typography requires slightly more breathing room to prevent "ink bleed" effects on high-brightness screens.

- **Contrast:** Maintain a minimum 4.5:1 ratio for body text and 3:1 for large headlines.
- **Scale:** Headlines utilize a tight tracking (-0.02em) to feel cohesive and structural.
- **Labels:** The `label-sm` style is intended for metadata and tags, utilizing a slightly increased letter-spacing (0.05em) and uppercase transformation to ensure legibility against dark surfaces.

## Layout & Spacing

The layout utilizes a **Fixed-Fluid Hybrid** model centered within a 1280px container. In dark mode, whitespace is treated as "negative volume," allowing elements to float with a sense of purpose.

- **Grid:** A standard 12-column system is used for desktop. 
- **Rhythm:** An 8px base unit (4px for micro-adjustments) ensures vertical rhythm across all components.
- **Breakpoints:**
  - Mobile (<640px): 16px margins, 4-column grid.
  - Tablet (640px - 1024px): 24px margins, 8-column grid.
  - Desktop (>1024px): 48px+ margins, 12-column grid.

## Elevation & Depth

In this dark-themed system, depth is conveyed through **Tonal Layers** and **Backdrop Blurs** rather than traditional black shadows, which are invisible on dark backgrounds.

- **Level 0 (Base):** #0f172a (The canvas).
- **Level 1 (Surfaces):** #1e293b with a subtle 1px border (#334155) to define the edge.
- **Level 2 (Modals/Overlays):** #1e293b with a semi-transparent border and a **Violet-tinted Glow** (shadow: 0px 10px 15px -3px rgba(168, 85, 247, 0.15)).
- **Glassmorphism:** Use a 12px backdrop-blur on navigation bars and floating menus to create a sense of material layering.

## Shapes

The system adopts a **Rounded (8px)** standard to soften the technicality of the dark palette.

- **Global Radius:** 8px for buttons, inputs, and standard cards.
- **Container Radius:** 16px for larger dashboard widgets and main content areas to create a nested, modular feel.
- **Interactive States:** Use a transition between sharp and soft focus; hover states may slightly increase the apparent "glow" of the border without changing the corner radius.

## Components

### Buttons & Controls
- **Primary Action:** Solid Indigo (#6366f1) with white text. On hover, apply a subtle violet outer glow.
- **Secondary Action:** Ghost style with a 1px border (#334155) and Text-Primary. Background shifts to #334155 on hover.
- **Segmented Controls:** Deep navy container (#0f172a) with a #1e293b active segment indicator.

### Form Elements
- **Inputs:** Background #0f172a with a 1px #334155 border. On focus, the border becomes Indigo (#6366f1) with a soft 2px outer glow.
- **Checkboxes/Radios:** Rounded 4px corners, using Indigo for the checked state.

### Cards & Data
- **Dashboard Cards:** Level 1 Surface (#1e293b) with a 1px #334155 top-border to catch "simulated light." 
- **Status Chips:** Translucent backgrounds (10% opacity of the status color) with high-saturation text (e.g., 10% Emerald background with 100% Emerald text) for "glowing" legibility.

### Specialized Components
- **Code/Technical Blocks:** Pure black (#000000) background with a 1px violet-tinted border to differentiate from the navy/charcoal UI.
- **Active Indicators:** Pulsing 6px Indigo dots to signify live talent or real-time updates.