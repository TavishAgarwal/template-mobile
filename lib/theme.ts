/**
 * 🎨 Velvet Design Tokens
 *
 * Dark luxury editorial palette. Warm gold accent on near-black surfaces.
 * Import colors only from this file — never hardcode hex values in components.
 */

// ── Primary brand accent ──────────────────────────────────────────────────────
export const ACCENT         = '#C9A84C'   // warm gold — primary CTA, active states
export const ACCENT_DIM     = 'rgba(201,168,76,0.12)'  // gold tint backgrounds
export const ACCENT_BORDER  = 'rgba(201,168,76,0.30)'  // gold borders
export const ACCENT_GLOW    = 'rgba(201,168,76,0.20)'  // glow effects
export const ACCENT_LIGHT   = '#E8C96A'   // lighter gold for text on dark

// ── Backgrounds ───────────────────────────────────────────────────────────────
export const BG_BASE        = '#0A0A0A'   // screen background
export const BG_SURFACE     = '#141414'   // card / sheet surface
export const BG_ELEVATED    = '#1C1C1C'   // elevated modal / overlay
export const BG_INPUT       = '#1A1A1A'   // text input background

// Legacy alias so existing template code still compiles
export const BG = BG_BASE
export const SURFACE = BG_SURFACE
export const SURFACE2 = BG_ELEVATED
export const SURFACE3 = '#2e2e2e'

// ── Borders ───────────────────────────────────────────────────────────────────
export const BORDER_DEFAULT = '#2A2A2A'   // standard dividers
export const BORDER_SUBTLE  = '#1E1E1E'   // barely-there borders
export const BORDER         = BORDER_DEFAULT
export const BORDER_ACTIVE  = ACCENT_BORDER

// ── Text ──────────────────────────────────────────────────────────────────────
export const TEXT_PRIMARY    = '#F5F5F0'  // main body text (warm white)
export const TEXT_SECONDARY  = '#888880'  // supporting text (muted)
export const TEXT_TERTIARY   = '#555550'  // hints, timestamps
export const TEXT_INVERSE    = '#0A0A0A'  // text on gold buttons
export const TEXT_DISABLED   = 'rgba(255,255,255,0.18)'

// ── Status colors ─────────────────────────────────────────────────────────────
export const SUCCESS         = '#4CAF7C'  // approved, success
export const WARNING         = '#E8B84C'  // pending, waitlisted
export const ERROR           = '#E85C4C'  // rejected, error
export const INFO            = '#4C8CE8'  // informational

export const ERROR_DIM       = 'rgba(232,92,76,0.10)'
export const SUCCESS_DIM     = 'rgba(76,175,124,0.12)'
export const WARNING_DIM     = 'rgba(232,184,76,0.12)'
export const INFO_DIM        = 'rgba(76,140,232,0.12)'

// ── Overlays ──────────────────────────────────────────────────────────────────
export const OVERLAY_DARK    = 'rgba(0,0,0,0.75)'
export const OVERLAY_LIGHT   = 'rgba(0,0,0,0.40)'

// ── Tab bar ───────────────────────────────────────────────────────────────────
export const TAB_ACTIVE      = ACCENT
export const TAB_INACTIVE    = TEXT_TERTIARY
export const TAB_HEIGHT      = 68
