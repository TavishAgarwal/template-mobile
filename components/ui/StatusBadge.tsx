import React from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import { Text } from './Text'
import {
  ACCENT, ACCENT_DIM, SUCCESS, SUCCESS_DIM, ERROR, ERROR_DIM,
  WARNING, WARNING_DIM, INFO, INFO_DIM, BORDER_DEFAULT,
} from '@/lib/theme'

type BadgeVariant = 'pending' | 'approved' | 'rejected' | 'waitlisted' |
  'going' | 'virtual' | 'in_person' | 'member' | 'admin' | 'default'

interface StatusBadgeProps {
  variant: BadgeVariant
  label?: string
  style?: ViewStyle
}

const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  pending:    { bg: WARNING_DIM,  text: WARNING, border: `${WARNING}30` },
  approved:   { bg: SUCCESS_DIM,  text: SUCCESS, border: `${SUCCESS}30` },
  rejected:   { bg: ERROR_DIM,    text: ERROR,   border: `${ERROR}30` },
  waitlisted: { bg: INFO_DIM,     text: INFO,    border: `${INFO}30` },
  going:      { bg: SUCCESS_DIM,  text: SUCCESS, border: `${SUCCESS}30` },
  virtual:    { bg: INFO_DIM,     text: INFO,    border: `${INFO}30` },
  in_person:  { bg: ACCENT_DIM,   text: ACCENT,  border: `${ACCENT}30` },
  member:     { bg: ACCENT_DIM,   text: ACCENT,  border: `${ACCENT}30` },
  admin:      { bg: ACCENT_DIM,   text: ACCENT,  border: `${ACCENT}30` },
  default:    { bg: 'rgba(255,255,255,0.06)', text: '#888880', border: BORDER_DEFAULT },
}

const DEFAULT_LABELS: Record<BadgeVariant, string> = {
  pending: 'Pending', approved: 'Approved', rejected: 'Rejected', waitlisted: 'Waitlisted',
  going: 'Going', virtual: 'Virtual', in_person: 'In Person', member: 'Member',
  admin: 'Admin', default: 'Unknown',
}

export function StatusBadge({ variant, label, style }: StatusBadgeProps) {
  const palette = BADGE_STYLES[variant] ?? BADGE_STYLES.default
  const displayLabel = label ?? DEFAULT_LABELS[variant] ?? variant

  return (
    <View style={[s.badge, { backgroundColor: palette.bg, borderColor: palette.border }, style]}>
      <Text variant="caption" style={{ color: palette.text, fontWeight: '600', fontSize: 11 }}>
        {displayLabel}
      </Text>
    </View>
  )
}

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
})
