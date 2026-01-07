import React, { useState, useEffect, useRef, useCallback } from "react";
import { ContactInquiry } from "@/api/contactInquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2, Info, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const phoneRegex = /^[\+]?[\d\s\-\(\)\.\/]+$/;

const getCountryDialCode = () => {
  try {
    const locale = navigator.language || 'en-US';
    const region = locale.split('-')[1] || 'US';

    const dialCodes = {
      'US': '+1', 'CA': '+1', 'GB': '+44', 'AU': '+61', 'NZ': '+64',
      'IE': '+353', 'ZA': '+27', 'IN': '+91', 'PK': '+92', 'BD': '+880',
      'SG': '+65', 'MY': '+60', 'PH': '+63', 'ID': '+62', 'TH': '+66',
      'VN': '+84', 'JP': '+81', 'KR': '+82', 'CN': '+86', 'TW': '+886',
      'HK': '+852', 'MO': '+853', 'FR': '+33', 'DE': '+49', 'IT': '+39',
      'ES': '+34', 'PT': '+351', 'NL': '+31', 'BE': '+32', 'CH': '+41',
      'AT': '+43', 'SE': '+46', 'NO': '+47', 'DK': '+45', 'FI': '+358',
      'PL': '+48', 'RU': '+7', 'UA': '+380', 'TR': '+90', 'GR': '+30',
      'IL': '+972', 'SA': '+966', 'AE': '+971', 'EG': '+20', 'NG': '+234',
      'KE': '+254', 'BR': '+55', 'MX': '+52', 'AR': '+54', 'CL': '+56',
      'CO': '+57', 'PE': '+51', 'VE': '+58'
    };

    return dialCodes[region] || '+1';
  } catch (error) {
    return '+1';
  }
};

const consultationSchema = z.object({
  full_name: z.string()
    .min(1, "Please enter your full name")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long (maximum 100 characters)")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Full name should only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string()
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address (e.g., name@example.com)"),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || (val.length >= 8 && phoneRegex.test(val)),
      "Please enter a valid phone number (e.g., +1 248-812-2425 or +44 20 1234 5678)"
    ),
  company_name: z.string().optional(),
  job_title: z.string().optional(),
  inquiry_type: z.string().min(1, "Please select a service of interest"),
  message: z.string()
    .max(1000, "Message is too long (maximum 1000 characters)")
    .optional(),
  preferred_contact: z.string().default("email"),
  urgency: z.string().default("flexible")
});

const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 3;

const fetchWithTimeout = async (url, options, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your internet connection');
    }
    throw error;
  }
};

const getErrorMessage = (error) => {
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network and try again.';
  }

  if (error.rateLimited || error.status === 429) {
    if (error.message && error.message.includes('minute')) {
      return error.message;
    }
    return 'Too many submission attempts. Please wait before trying again.';
  }

  if (error.message?.includes('timeout')) {
    return 'Request timeout. Your connection may be slow. Please try again.';
  }

  if (error.message?.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (error.status >= 500) {
    return 'Server error. Our team has been notified. Please try again in a few moments.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

export default function BookConsultation() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(consultationSchema),
    mode: "onSubmit",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      company_name: "",
      job_title: "",
      inquiry_type: "consultation",
      message: "",
      preferred_contact: "email",
      urgency: "flexible"
    }
  });

  const maxMessageLength = 1000;

  const scrollToError = useCallback(() => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors]);

  useEffect(() => {
    const detectedCode = getCountryDialCode();
    setCountryCode(detectedCode);
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0 && !isSubmitting) {
      scrollToError();
    }
  }, [errors, isSubmitting, scrollToError]);

  const submitWithRetry = async (data, attempt = 1) => {
    try {
      const result = await ContactInquiry.create(data);
      return result;
    } catch (error) {
      if (attempt < MAX_RETRIES && (!error.status || error.status >= 500)) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return submitWithRetry(data, attempt + 1);
      }
      throw error;
    }
  };

  const sendEmailNotification = async (data) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetchWithTimeout(
        `${supabaseUrl}/functions/v1/send-contact-notification`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
        15000
      );

      if (!response.ok) {
        console.warn('Email notification failed, but form was saved');
      }
    } catch (emailError) {
      console.warn('Failed to send email notifications:', emailError);
    }
  };

  const onSubmit = async (data) => {
    let progressTimer;

    try {
      if (!navigator.onLine) {
        toast.error('No internet connection', {
          description: 'Please check your network connection and try again.',
          action: {
            label: 'Retry',
            onClick: () => handleSubmit(onSubmit)()
          }
        });
        return;
      }

      progressTimer = setTimeout(() => {
        setShowProgress(true);
      }, 1500);

      const result = await submitWithRetry(data);
      setSubmittedData(result);

      await sendEmailNotification(data);

      clearTimeout(progressTimer);
      setShowProgress(false);
      setSubmitSuccess(true);

      setTimeout(() => {
        setIsSubmitted(true);
        setRetryCount(0);
        reset();
      }, 800);

      toast.success("Consultation request submitted successfully!", {
        description: "We'll be in touch within 24 hours."
      });
    } catch (error) {
      console.error("Submission error:", error);
      clearTimeout(progressTimer);
      setShowProgress(false);
      setSubmitSuccess(false);

      const errorMessage = getErrorMessage(error);
      const isRateLimited = error.rateLimited || error.status === 429;
      const canRetry = !isRateLimited && retryCount < MAX_RETRIES && (!error.status || error.status >= 500 || !navigator.onLine);

      toast.error(isRateLimited ? "Rate Limit Exceeded" : "Failed to submit consultation request", {
        description: errorMessage,
        duration: isRateLimited ? 8000 : 6000,
        action: canRetry ? {
          label: 'Retry',
          onClick: () => handleRetry(data)
        } : undefined
      });
    }
  };

  const handleRetry = async (data) => {
    if (retryCount >= MAX_RETRIES) {
      toast.error('Maximum retry attempts reached', {
        description: 'Please contact us directly at contact@rarefindtalent.com'
      });
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    toast.info(`Retrying submission (${retryCount + 1}/${MAX_RETRIES})...`, {
      duration: 2000
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await onSubmit(data);
    } finally {
      setIsRetrying(false);
    }
  };

  const PageWrapper = ({ children }) => (
    <div className="bg-white text-slate-800">{children}</div>
  );

  const pageTitleStyles = "page-title text-black mb-4";
  const pageSubtitleStyles = "text-lg text-slate-600 leading-relaxed max-w-3xl";

  if (isSubmitted) {
    return (
      <PageWrapper>
        <Toaster position="top-right" />
        <style>
          {`
            .page-title {
              font-size: clamp(2.25rem, 5vw, 3rem);
              line-height: 1.2;
              font-weight: 600;
              letter-spacing: -1px;
            }
          `}
        </style>

        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-emerald-100 shadow-lg bg-gradient-to-b from-emerald-50/50 to-white">
              <CardContent className="p-10 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl" />
                    <CheckCircle className="h-20 w-20 text-emerald-500 relative" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-semibold text-black mb-4">
                    Thank You, {submittedData?.full_name?.split(' ')[0] || 'there'}!
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    We've received your consultation request and will be in touch within 24 hours
                    to schedule your personalized consultation.
                  </p>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      What Happens Next?
                    </h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-1">1.</span>
                        <span>Our team will review your inquiry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-1">2.</span>
                        <span>We'll reach out via {submittedData?.preferred_contact || 'email'} to schedule your consultation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-1">3.</span>
                        <span>Prepare to discuss your talent needs and goals</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                    >
                      Submit Another Request
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/'}
                      className="bg-slate-900 hover:bg-slate-800"
                    >
                      Return to Home
                    </Button>
                  </div>

                  {submittedData?.email && (
                    <p className="text-sm text-slate-500 mt-6">
                      A confirmation has been sent to <span className="font-medium text-slate-700">{submittedData.email}</span>
                    </p>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Toaster position="top-right" />
      <style>
        {`
          .page-title {
            font-size: clamp(2.25rem, 5vw, 3rem);
            line-height: 1.2;
            font-weight: 600;
            letter-spacing: -1px;
          }

          .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #334155;
            margin-bottom: 8px;
            display: block;
          }

          @media (max-width: 640px) {
            .form-label {
              font-size: 0.9375rem;
            }

            /* Enhanced touch targets for mobile */
            button[role="combobox"],
            input,
            textarea {
              min-height: 48px;
            }

            /* Better spacing on mobile */
            .space-y-4 > * + * {
              margin-top: 1.5rem;
            }
          }

          /* Keyboard navigation focus styles */
          input:focus-visible,
          textarea:focus-visible,
          button:focus-visible,
          [role="combobox"]:focus-visible {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
            border-color: #3b82f6;
          }

          /* Smooth scroll behavior for error navigation */
          html {
            scroll-behavior: smooth;
          }
        `}
      </style>

      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className={pageTitleStyles}>
              Book a Consultation
            </h1>
            <p className={pageSubtitleStyles}>
              Ready to discuss your talent needs? Fill out the form below and we'll schedule a free consultation to explore how we can help you find the right talent for your organization.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Direct Contact Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  Prefer to Reach Out Directly?
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  We'd love to hear from you. Contact us directly via email or phone, or complete the form below.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <a
                  href="mailto:contact@rarefindtalent.com"
                  className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:border-slate-300 transition-colors duration-200">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="font-medium">contact@rarefindtalent.com</span>
                </a>
                <a
                  href="tel:+12488122425"
                  className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:border-slate-300 transition-colors duration-200">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="font-medium">(248) 812-2425</span>
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                <p className="text-slate-500 text-sm">
                  Or fill out the consultation request form below
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="border border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-4 sm:p-6 lg:p-8 bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-lg sm:text-xl font-semibold text-black">
                  Consultation Request
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <TooltipProvider>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {(isSubmitting || isRetrying) && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 rounded-lg pointer-events-none" />
                  )}

                  {Object.keys(errors).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-red-800 mb-2">
                            Please correct the following errors:
                          </h3>
                          <ul className="space-y-1">
                            {errors.full_name && (
                              <li className="text-sm text-red-700">• {errors.full_name.message}</li>
                            )}
                            {errors.email && (
                              <li className="text-sm text-red-700">• {errors.email.message}</li>
                            )}
                            {errors.phone && (
                              <li className="text-sm text-red-700">• {errors.phone.message}</li>
                            )}
                            {errors.inquiry_type && (
                              <li className="text-sm text-red-700">• {errors.inquiry_type.message}</li>
                            )}
                            {errors.message && (
                              <li className="text-sm text-red-700">• {errors.message.message}</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="full_name" className="form-label">Full Name *</label>
                      <Controller
                        name="full_name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="full_name"
                            placeholder="John Smith"
                            disabled={isSubmitting || isRetrying}
                            className={`h-11 sm:h-12 text-base ${errors.full_name ? 'border-red-500' : ''} ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          />
                        )}
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">Email *</label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            disabled={isSubmitting || isRetrying}
                            className={`h-11 sm:h-12 text-base ${errors.email ? 'border-red-500' : ''} ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          />
                        )}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="phone" className="form-label mb-0">Phone Number</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Optional. Include country code for international numbers (e.g., {countryCode} 248-812-2425)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="phone"
                            type="tel"
                            placeholder={`${countryCode} 248-812-2425`}
                            disabled={isSubmitting || isRetrying}
                            className={`h-11 sm:h-12 text-base ${errors.phone ? 'border-red-500' : ''} ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          />
                        )}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone.message}
                        </p>
                      )}
                      {!errors.phone && (
                        <p className="text-xs text-slate-500 mt-1">Optional - Include country code: {countryCode} 248-812-2425</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="company_name" className="form-label">Company Name</label>
                      <Controller
                        name="company_name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="company_name"
                            placeholder="Acme Corporation"
                            disabled={isSubmitting || isRetrying}
                            className={`h-11 sm:h-12 text-base ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="job_title" className="form-label">Job Title</label>
                      <Controller
                        name="job_title"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="job_title"
                            placeholder="HR Manager"
                            disabled={isSubmitting || isRetrying}
                            className={`h-11 sm:h-12 text-base ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="form-label">Service Interest *</label>
                      <Controller
                        name="inquiry_type"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || isRetrying}>
                            <SelectTrigger className={`h-11 sm:h-12 text-base ${errors.inquiry_type ? 'border-red-500' : ''} ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultation">General Consultation</SelectItem>
                              <SelectItem value="contingency_placement">Contingency Placement</SelectItem>
                              <SelectItem value="contract_services">In-house Contract Services</SelectItem>
                              <SelectItem value="coaching">Resume/Coaching Services</SelectItem>
                              <SelectItem value="general">General Inquiry</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.inquiry_type && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.inquiry_type.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="form-label">Preferred Contact Method</label>
                      <Controller
                        name="preferred_contact"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || isRetrying}>
                            <SelectTrigger className={`h-11 sm:h-12 text-base ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="either">Either</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <label className="form-label">Timeline</label>
                      <Controller
                        name="urgency"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting || isRetrying}>
                            <SelectTrigger className={`h-11 sm:h-12 text-base ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate</SelectItem>
                              <SelectItem value="within-week">Within a Week</SelectItem>
                              <SelectItem value="within-month">Within a Month</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="form-label">Tell us about your needs</label>
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="message"
                          maxLength={maxMessageLength}
                          disabled={isSubmitting || isRetrying}
                          className={`h-32 sm:h-36 resize-none text-base ${errors.message ? 'border-red-500' : ''} ${(isSubmitting || isRetrying) ? 'opacity-60 cursor-not-allowed' : ''}`}
                          placeholder="Please describe your talent needs, specific roles you're looking to fill, or any questions you have about our services..."
                        />
                      )}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 sm:pt-4">
                    {showProgress && (
                      <div className="mb-3 text-center">
                        <p className="text-sm text-slate-600 animate-pulse">Processing your request...</p>
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting || isRetrying || submitSuccess}
                      className="w-full bg-black text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed h-12 sm:h-14 text-base sm:text-lg font-medium transition-all duration-300 transform touch-manipulation relative overflow-hidden"
                    >
                      {submitSuccess ? (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Request Sent!
                        </span>
                      ) : isSubmitting || isRetrying ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {isRetrying ? `Retrying (${retryCount}/${MAX_RETRIES})...` : 'Sending Request...'}
                        </span>
                      ) : (
                        "Schedule Consultation"
                      )}
                    </Button>
                  </div>
                </form>
                </TooltipProvider>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}