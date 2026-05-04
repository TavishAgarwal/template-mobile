import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { mockApplications } from '@/lib/mockData'
import type { Application } from '@/types'

export function useApplications(status?: Application['status']) {
  return useQuery({
    queryKey: ['applications', status],
    queryFn: async (): Promise<Application[]> => {
      let query = supabase.from('applications').select('*').order('created_at', { ascending: false })
      if (status) query = query.eq('status', status)
      const { data, error } = await query
      if (error) throw error
      return data as Application[]
    },
    enabled: isSupabaseEnabled,
    placeholderData: status
      ? mockApplications.filter(a => a.status === status)
      : mockApplications,
  })
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async (): Promise<Application> => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Application
    },
    enabled: isSupabaseEnabled && !!id,
    placeholderData: mockApplications.find(a => a.id === id),
  })
}
