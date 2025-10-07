import React, { useState } from "react";
import { ContactInquiry } from "@/api/contactInquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const consultationSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  job_title: z.string().optional(),
  inquiry_type: z.string().min(1, "Please select a service interest"),
  message: z.string().optional(),
  preferred_contact: z.string().default("email"),
  urgency: z.string().default("flexible")
});

export default function BookConsultation() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, getValues } = useForm({
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

  const onSubmit = async (data) => {
    try {
      const result = await ContactInquiry.create(data);
      setSubmittedData(result);
      setIsSubmitted(true);
      reset();
      toast.success("Consultation request submitted successfully!", {
        description: "We'll be in touch within 24 hours."
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit consultation request", {
        description: error.message || "Please try again or contact us directly at contact@rarefindtalent.com"
      });
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
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-10 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                >
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-black mb-4">
                  Thank You For Your Inquiry
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  We've received your request and will be in touch within 24 hours 
                  to schedule a consultation.
                </p>
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
            color: #334155; /* slate-700 */
            margin-bottom: 8px;
            display: block;
          }
        `}
      </style>

      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
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
      <section className="px-4 sm:px-6 lg:px-8 pb-20 lg:pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="border border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-8 bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-xl font-semibold text-black">
                  Consultation Request
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full_name" className="form-label">Full Name *</label>
                      <Controller
                        name="full_name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="full_name"
                            className={`h-11 ${errors.full_name ? 'border-red-500' : ''}`}
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
                            className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
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

                  <div className="grid md:grid-cols-2 gap-6">
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
                            className="h-11"
                          />
                        )}
                      />
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
                            className="h-11"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="job_title" className="form-label">Job Title</label>
                      <Controller
                        name="job_title"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="job_title"
                            className="h-11"
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
                            <SelectTrigger className={`h-11 ${errors.inquiry_type ? 'border-red-500' : ''}`}>
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Preferred Contact Method</label>
                      <Controller
                        name="preferred_contact"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-11">
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
                            <SelectTrigger className="h-11">
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
                          className="h-32 resize-none"
                          placeholder="Please describe your talent needs, specific roles you're looking to fill, or any questions you have about our services..."
                        />
                      )}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white hover:bg-slate-800 h-12 text-base font-medium transition-all duration-300 transform"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Consultation Request"}
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