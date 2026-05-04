import React from 'react'
import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { Card } from '@/components/ui/Card'
import { ACCENT, ACCENT_DIM, BG_SURFACE, BORDER_DEFAULT } from '@/lib/theme'

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  highlight?: boolean
}

export function StatCard({ label, value, icon, highlight = false }: StatCardProps) {
  return (
    <Card style={[s.card, highlight && s.highlight].filter(Boolean) as any} glow={highlight}>
      <View style={s.row}>
        {icon && <View style={s.iconWrap}>{icon}</View>}
        <View style={s.textWrap}>
          <Text variant="number" color={highlight ? 'accent' : 'primary'}>{String(value)}</Text>
          <Text variant="label" uppercase color="secondary">{label}</Text>
        </View>
      </View>
    </Card>
  )
}

const s = StyleSheet.create({
  card: { padding: 16, flex: 1 },
  highlight: { borderColor: `${ACCENT}30` },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: ACCENT_DIM,
    alignItems: 'center', justifyContent: 'center',
  },
  textWrap: { flex: 1, gap: 2 },
})
