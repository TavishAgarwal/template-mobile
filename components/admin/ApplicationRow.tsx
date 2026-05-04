import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { BG_SURFACE, BORDER_DEFAULT } from '@/lib/theme'
import { formatRelativeTime } from '@/lib/utils'
import type { Application } from '@/types'

interface ApplicationRowProps {
  application: Application
  onPress: () => void
}

export function ApplicationRow({ application, onPress }: ApplicationRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}
    >
      <Avatar name={application.full_name} size="md" />
      <View style={s.info}>
        <Text variant="body" color="primary" style={{ fontWeight: '600' }}>
          {application.full_name}
        </Text>
        <Text variant="bodySm" color="secondary">
          {application.profession}{application.company ? ` at ${application.company}` : ''}
        </Text>
        <Text variant="caption" color="tertiary">{application.city} · {formatRelativeTime(application.created_at)}</Text>
      </View>
      <StatusBadge variant={application.status} />
    </Pressable>
  )
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, backgroundColor: BG_SURFACE,
    borderBottomWidth: 1, borderBottomColor: BORDER_DEFAULT,
  },
  info: { flex: 1, gap: 2 },
})
