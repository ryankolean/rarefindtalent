import { supabase } from '@/lib/supabase';

export const ContactInquiry = {
  async create(data) {
    const { data: result, error } = await supabase
      .from('contact_inquiries')
      .insert([data])
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return result;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }
};
