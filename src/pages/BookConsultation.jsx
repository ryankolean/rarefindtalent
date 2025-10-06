import React, { useState } from "react";
import { ContactInquiry } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function BookConsultation() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    job_title: "",
    inquiry_type: "consultation",
    message: "",
    preferred_contact: "email",
    urgency: "flexible"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await ContactInquiry.create(formData);
      setIsSubmitted(true);
    } catch (error) {
      alert("Failed to submit consultation request. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full_name" className="form-label">Full Name *</label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">Email *</label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label htmlFor="company_name" className="form-label">Company Name</label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange("company_name", e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="job_title" className="form-label">Job Title</label>
                      <Input
                        id="job_title"
                        value={formData.job_title}
                        onChange={(e) => handleInputChange("job_title", e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="form-label">Service Interest *</label>
                      <Select value={formData.inquiry_type} onValueChange={(value) => handleInputChange("inquiry_type", value)}>
                        <SelectTrigger className="h-11">
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
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Preferred Contact Method</label>
                      <Select value={formData.preferred_contact} onValueChange={(value) => handleInputChange("preferred_contact", value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="either">Either</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="form-label">Timeline</label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
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
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="form-label">Tell us about your needs</label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="h-32 resize-none"
                      placeholder="Please describe your talent needs, specific roles you're looking to fill, or any questions you have about our services..."
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