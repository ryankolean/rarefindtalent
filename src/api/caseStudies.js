import { supabase } from '@/lib/supabase';

export const CaseStudies = {
  async getPublished() {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
};
