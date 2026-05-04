import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { mockConversations } from '@/lib/mockData'
import type { Conversation } from '@/types'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('conversations')
        .select('*, other_member:profiles!conversations_member_2_id_fkey(*)')
        .or(`member_1_id.eq.${user.id},member_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })
      if (error) throw error
      return data as Conversation[]
    },
    enabled: isSupabaseEnabled,
    placeholderData: mockConversations,
  })
}
