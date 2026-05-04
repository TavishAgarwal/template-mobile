import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { mockMembers } from '@/lib/mockData'
import type { Profile } from '@/types'

export function useMembers(search?: string) {
  return useQuery({
    queryKey: ['members', search],
    queryFn: async (): Promise<Profile[]> => {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'member')
        .eq('onboarding_completed', true)
        .order('created_at', { ascending: false })

      if (search) {
        query = query.or(`display_name.ilike.%${search}%,profession.ilike.%${search}%,city.ilike.%${search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Profile[]
    },
    enabled: isSupabaseEnabled,
    placeholderData: search
      ? mockMembers.filter(m =>
          m.display_name?.toLowerCase().includes(search.toLowerCase()) ||
          m.profession?.toLowerCase().includes(search.toLowerCase()) ||
          m.city?.toLowerCase().includes(search.toLowerCase())
        )
      : mockMembers,
  })
}

export function useMember(id: string) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles').select('*').eq('id', id).single()
      if (error) throw error
      return data as Profile
    },
    enabled: isSupabaseEnabled && !!id,
    placeholderData: mockMembers.find(m => m.id === id),
  })
}
