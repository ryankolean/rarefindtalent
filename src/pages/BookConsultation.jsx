import React, { useState, useEffect } from "react";
import { ContactInquiry } from "@/api/contactInquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const phoneRegex = /^[\d\s\-\(\)\+\.ext]+$/;

const consultationSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || (val.length >= 10 && phoneRegex.test(val)),
      "Please enter a valid phone number (minimum 10 digits)"
    ),
  company_name: z.string().optional(),
  job_title: z.string().optional(),
  inquiry_type: z.string().min(1, "Please select a service interest"),
  message: z.string().max(1000, "Message must be 1000 characters or less").optional(),
  preferred_contact: z.string().default("email"),
  urgency: z.string().default("flexible")
});

const FORM_STORAGE_KEY = 'consultation_form_draft';
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

  if (error.message?.includes('timeout')) {
    return 'Request timeout. Your connection may be slow. Please try again.';
  }

  if (error.message?.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (error.status >= 500) {
    return 'Server error. Our team has been notified. Please try again in a few moments.';
  }

  if (error.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

export default function BookConsultation() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm({
    resolver: zodResolver(consultationSchema),
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

  const formValues = watch();
  const messageValue = watch("message") || "";
  const messageLength = messageValue.length;
  const maxMessageLength = 1000;

  useEffect(() => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach(key => {
          setValue(key, parsedData[key]);
        });
        toast.info('Draft restored', {
          description: 'We restored your previous form data.',
          duration: 3000
        });
      } catch (error) {
        console.error('Failed to restore form data:', error);
      }
    }
  }, [setValue]);

  useEffect(() => {
    const hasData = Object.values(formValues).some(value =>
      value && value !== "consultation" && value !== "email" && value !== "flexible"
    );

    if (hasData && !isSubmitted) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formValues));
    }
  }, [formValues, isSubmitted]);

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

      const result = await submitWithRetry(data);
      setSubmittedData(result);

      await sendEmailNotification(data);

      localStorage.removeItem(FORM_STORAGE_KEY);
      setIsSubmitted(true);
      setRetryCount(0);
      reset();

      toast.success("Consultation request submitted successfully!", {
        description: "We'll be in touch within 24 hours."
      });
    } catch (error) {
      console.error("Submission error:", error);

      const errorMessage = getErrorMessage(error);
      const canRetry = retryCount < MAX_RETRIES && (!error.status || error.status >= 500 || !navigator.onLine);

      toast.error("Failed to submit consultation request", {
        description: errorMessage,
        duration: 6000,
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                            className={`h-11 sm:h-12 text-base ${errors.full_name ? 'border-red-500' : ''}`}
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
                            className={`h-11 sm:h-12 text-base ${errors.email ? 'border-red-500' : ''}`}
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
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            className={`h-11 sm:h-12 text-base ${errors.phone ? 'border-red-500' : ''}`}
                          />
                        )}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone.message}
                        </p>
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
                            className="h-11 sm:h-12 text-base"
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
                            className="h-11 sm:h-12 text-base"
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`h-11 sm:h-12 text-base ${errors.inquiry_type ? 'border-red-500' : ''}`}>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-11 sm:h-12 text-base">
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-11 sm:h-12 text-base">
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
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="message" className="form-label mb-0">Tell us about your needs</label>
                      <span className={`text-xs ${messageLength > maxMessageLength ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                        {messageLength}/{maxMessageLength}
                      </span>
                    </div>
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="message"
                          maxLength={maxMessageLength}
                          className={`h-32 sm:h-36 resize-none text-base ${errors.message ? 'border-red-500' : ''}`}
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
                    <Button
                      type="submit"
                      disabled={isSubmitting || isRetrying}
                      className="w-full bg-black text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed h-12 sm:h-14 text-base sm:text-lg font-medium transition-all duration-300 transform touch-manipulation"
                    >
                      {isSubmitting || isRetrying ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        "Submit Consultation Request"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}