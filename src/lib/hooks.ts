import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'

// Hook untuk fetch data dari Supabase
export function useSupabaseQuery<T>(
  table: string,
  key: string[],
  options?: { select?: string; filter?: Record<string, any> }
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      let query = supabase.from(table).select(options?.select || '*')

      // Apply filters jika ada
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      const { data, error } = await query
      if (error) throw error
      return data as T[]
    },
  })
}

// Hook untuk insert data ke Supabase
export function useSupabaseInsert(table: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const { data, error } = await supabase
        .from(table)
        .insert([payload])
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] })
    },
  })
}

// Hook untuk update data di Supabase
export function useSupabaseUpdate(table: string, id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq('id', id)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] })
    },
  })
}

// Hook untuk delete data dari Supabase
export function useSupabaseDelete(table: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] })
    },
  })
}
