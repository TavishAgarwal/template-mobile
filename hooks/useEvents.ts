import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { mockEvents } from '@/lib/mockData'
import type { Event } from '@/types'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<Event[]> => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
      if (error) throw error
      return data as Event[]
    },
    enabled: isSupabaseEnabled,
    placeholderData: mockEvents,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async (): Promise<Event> => {
      const { data, error } = await supabase
        .from('events').select('*').eq('id', id).single()
      if (error) throw error
      return data as Event
    },
    enabled: isSupabaseEnabled && !!id,
    placeholderData: mockEvents.find(e => e.id === id),
  })
}
