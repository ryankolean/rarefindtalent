import { supabase } from '@/lib/supabase';

export const Blog = {
  async getPublishedPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  async getPostBySlug(slug) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async getPostsByCategory(category) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  async searchPosts(query) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }
};
