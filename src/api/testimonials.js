import { supabase } from '@/lib/supabase';

export const Testimonials = {
  async getFeatured() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  }
};
