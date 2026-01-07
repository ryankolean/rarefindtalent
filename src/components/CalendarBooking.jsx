import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CalendarBooking() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    service_type: "",
    consultation_date: "",
    consultation_time: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const serviceTypes = [
    "Contingency Placement",
    "Contract Services",
    "Resume Review & Career Coaching",
    "General Inquiry"
  ];

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM"
  ];

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const re = /^[\d\s\-\(\)\+]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'full_name':
        if (!value || value.trim().length < 2) {
          return "Please enter your full name (at least 2 characters)";
        }
        return "";
      case 'email':
        if (!value) {
          return "Email is required";
        }
        if (!validateEmail(value)) {
          return "Please enter a valid email address";
        }
        return "";
      case 'phone':
        if (value && !validatePhone(value)) {
          return "Please enter a valid phone number (at least 10 digits)";
        }
        return "";
      case 'service_type':
        if (!value) {
          return "Please select a service type";
        }
        return "";
      case 'consultation_date':
        if (!value) {
          return "Please select a consultation date";
        }
        return "";
      case 'consultation_time':
        if (!value) {
          return "Please select a time slot";
        }
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['full_name', 'email', 'service_type', 'consultation_date', 'consultation_time'];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      const firstErrorField = Object.keys(errors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .insert([formData]);

      if (error) throw error;

      setIsBooked(true);
      toast.success("Consultation booked successfully!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book consultation. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  if (isBooked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
        role="alert"
        aria-live="polite"
      >
        <Card className="border-2 border-emerald-500">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-semibold text-black mb-3">
              Consultation Booked!
            </h2>
            <p className="text-slate-600 mb-4">
              Thank you for booking a consultation with Rare Find Talent. We've sent a confirmation email to <strong>{formData.email}</strong>.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600 mb-2">Your Appointment Details:</p>
              <p className="font-semibold text-black">
                {new Date(formData.consultation_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="font-semibold text-black">{formData.consultation_time}</p>
              <p className="text-sm text-slate-600 mt-2">{formData.service_type}</p>
            </div>
            <p className="text-sm text-slate-500">
              We'll reach out shortly to confirm your appointment and send calendar invites.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border border-slate-200 shadow-sm max-w-3xl mx-auto">
      <CardHeader className="p-4 sm:p-6 lg:p-8 bg-slate-50 border-b border-slate-200">
        <CardTitle className="text-xl font-semibold text-black flex items-center gap-2">
          <Calendar className="h-6 w-6" aria-hidden="true" />
          Book Your Consultation
        </CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Select a convenient date and time for your free consultation
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-500" aria-label="required">*</span>
              </label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                onBlur={() => handleBlur('full_name')}
                placeholder="John Doe"
                required
                aria-required="true"
                aria-invalid={!!errors.full_name}
                aria-describedby={errors.full_name ? "full_name-error" : undefined}
                className={`h-11 sm:h-12 ${errors.full_name ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.full_name && (
                <p id="full_name-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  {errors.full_name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500" aria-label="required">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="john@example.com"
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`h-11 sm:h-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="(248) 812-2425"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={`h-11 sm:h-12 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.phone && (
                <p id="phone-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                Company
              </label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company Name"
                className="h-11 sm:h-12"
              />
            </div>
          </div>

          <div>
            <label htmlFor="service_type" className="block text-sm font-medium text-slate-700 mb-2">
              Service Interest <span className="text-red-500" aria-label="required">*</span>
            </label>
            <Select
              onValueChange={(value) => handleChange('service_type', value)}
              required
              aria-required="true"
              aria-invalid={!!errors.service_type}
              aria-describedby={errors.service_type ? "service_type-error" : undefined}
            >
              <SelectTrigger
                id="service_type"
                name="service_type"
                className={`h-11 sm:h-12 ${errors.service_type ? 'border-red-500' : ''}`}
                onBlur={() => handleBlur('service_type')}
              >
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_type && (
              <p id="service_type-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {errors.service_type}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="consultation_date" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Preferred Date <span className="text-red-500" aria-label="required">*</span>
              </label>
              <Input
                id="consultation_date"
                name="consultation_date"
                type="date"
                value={formData.consultation_date}
                onChange={(e) => handleChange('consultation_date', e.target.value)}
                onBlur={() => handleBlur('consultation_date')}
                min={getMinDate()}
                max={getMaxDate()}
                required
                aria-required="true"
                aria-invalid={!!errors.consultation_date}
                aria-describedby={errors.consultation_date ? "consultation_date-error" : "consultation_date-help"}
                className={`h-11 sm:h-12 ${errors.consultation_date ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.consultation_date ? (
                <p id="consultation_date-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  {errors.consultation_date}
                </p>
              ) : (
                <p id="consultation_date-help" className="text-xs text-slate-500 mt-1">
                  Available dates: Next business day to 60 days out
                </p>
              )}
            </div>

            <div>
              <label htmlFor="consultation_time" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Preferred Time <span className="text-red-500" aria-label="required">*</span>
              </label>
              <Select
                onValueChange={(value) => handleChange('consultation_time', value)}
                required
                aria-required="true"
                aria-invalid={!!errors.consultation_time}
                aria-describedby={errors.consultation_time ? "consultation_time-error" : "consultation_time-help"}
              >
                <SelectTrigger
                  id="consultation_time"
                  name="consultation_time"
                  className={`h-11 sm:h-12 ${errors.consultation_time ? 'border-red-500' : ''}`}
                  onBlur={() => handleBlur('consultation_time')}
                >
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.consultation_time ? (
                <p id="consultation_time-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  {errors.consultation_time}
                </p>
              ) : (
                <p id="consultation_time-help" className="text-xs text-slate-500 mt-1">All times in EST</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              Additional Information
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Tell us about your needs or any specific topics you'd like to discuss..."
              className="h-24 resize-none"
              aria-describedby="message-help"
            />
            <p id="message-help" className="text-xs text-slate-500 mt-1">
              Optional: Share any specific topics or questions you'd like to discuss
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-slate-800 h-12 sm:h-14 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin mr-2" aria-hidden="true">⏳</span>
                Booking...
              </>
            ) : (
              "Book Consultation"
            )}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By booking a consultation, you agree to our terms of service and privacy policy.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
