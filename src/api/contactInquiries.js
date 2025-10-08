import { supabase } from '@/lib/supabase';

const RATE_LIMIT_KEY = 'contact_form_submissions';
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_SUBMISSIONS_PER_HOUR = 3;

const RateLimiter = {
  check() {
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);

    if (!stored) {
      return { allowed: true, remaining: MAX_SUBMISSIONS_PER_HOUR - 1 };
    }

    const submissions = JSON.parse(stored);
    const recentSubmissions = submissions.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );

    if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
      const oldestSubmission = Math.min(...recentSubmissions);
      const resetTime = new Date(oldestSubmission + RATE_LIMIT_WINDOW);
      return {
        allowed: false,
        remaining: 0,
        resetAt: resetTime
      };
    }

    return {
      allowed: true,
      remaining: MAX_SUBMISSIONS_PER_HOUR - recentSubmissions.length - 1
    };
  },

  record() {
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const submissions = stored ? JSON.parse(stored) : [];

    const recentSubmissions = submissions.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );

    recentSubmissions.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
  },

  getRemainingTime() {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) return null;

    const submissions = JSON.parse(stored);
    const now = Date.now();
    const recentSubmissions = submissions.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );

    if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
      const oldestSubmission = Math.min(...recentSubmissions);
      return Math.ceil((oldestSubmission + RATE_LIMIT_WINDOW - now) / 60000);
    }

    return null;
  }
};

export const ContactInquiry = {
  async create(data) {
    const rateLimitCheck = RateLimiter.check();

    if (!rateLimitCheck.allowed) {
      const remainingMinutes = RateLimiter.getRemainingTime();
      const error = new Error(
        `Rate limit exceeded. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`
      );
      error.status = 429;
      error.rateLimited = true;
      error.resetAt = rateLimitCheck.resetAt;
      throw error;
    }

    console.log('[ContactInquiry] Creating new inquiry:', {
      name: data.full_name,
      email: data.email,
      inquiry_type: data.inquiry_type,
      timestamp: new Date().toISOString()
    });

    try {
      const { data: result, error } = await supabase
        .from('contact_inquiries')
        .insert([{
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          company_name: data.company_name || null,
          job_title: data.job_title || null,
          inquiry_type: data.inquiry_type,
          message: data.message || null,
          preferred_contact: data.preferred_contact || 'email',
          urgency: data.urgency || 'flexible'
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('[ContactInquiry] Database error:', {
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });

        const enhancedError = new Error(error.message);
        enhancedError.status = 500;
        enhancedError.code = error.code;
        enhancedError.originalError = error;
        throw enhancedError;
      }

      RateLimiter.record();

      console.log('[ContactInquiry] Successfully created inquiry:', {
        id: result.id,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      if (error.rateLimited) {
        throw error;
      }

      console.error('[ContactInquiry] Unexpected error:', error);

      if (!error.status) {
        error.status = 500;
      }

      throw error;
    }
  },

  async getAll() {
    console.log('[ContactInquiry] Fetching all inquiries');

    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[ContactInquiry] Error fetching inquiries:', error);
        throw error;
      }

      console.log(`[ContactInquiry] Successfully fetched ${data?.length || 0} inquiries`);
      return data;
    } catch (error) {
      console.error('[ContactInquiry] Unexpected error fetching inquiries:', error);
      throw error;
    }
  },

  checkRateLimit() {
    return RateLimiter.check();
  },

  getRateLimitInfo() {
    const check = RateLimiter.check();
    const remainingMinutes = RateLimiter.getRemainingTime();

    return {
      allowed: check.allowed,
      remaining: check.remaining,
      maxPerHour: MAX_SUBMISSIONS_PER_HOUR,
      windowMinutes: RATE_LIMIT_WINDOW / 60000,
      resetInMinutes: remainingMinutes,
      resetAt: check.resetAt
    };
  }
};
