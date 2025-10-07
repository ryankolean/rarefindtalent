import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CheckCircle } from "lucide-react";
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

    if (!formData.full_name || !formData.email || !formData.service_type ||
        !formData.consultation_date || !formData.consultation_time) {
      toast.error("Please fill in all required fields");
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
      toast.error("Failed to book consultation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isBooked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-2 border-emerald-500">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-black mb-3">
              Consultation Booked!
            </h3>
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
          <Calendar className="h-6 w-6" />
          Book Your Consultation
        </CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Select a convenient date and time for your free consultation
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="John Doe"
                required
                className="h-11 sm:h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                required
                className="h-11 sm:h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="h-11 sm:h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company
              </label>
              <Input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company Name"
                className="h-11 sm:h-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service Interest *
            </label>
            <Select onValueChange={(value) => handleChange('service_type', value)} required>
              <SelectTrigger className="h-11 sm:h-12">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Preferred Date *
              </label>
              <Input
                type="date"
                value={formData.consultation_date}
                onChange={(e) => handleChange('consultation_date', e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                required
                className="h-11 sm:h-12"
              />
              <p className="text-xs text-slate-500 mt-1">
                Available dates: Next business day to 60 days out
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Time *
              </label>
              <Select onValueChange={(value) => handleChange('consultation_time', value)} required>
                <SelectTrigger className="h-11 sm:h-12">
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
              <p className="text-xs text-slate-500 mt-1">All times in EST</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional Information
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Tell us about your needs or any specific topics you'd like to discuss..."
              className="h-24 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-slate-800 h-12 sm:h-14 text-base font-medium"
          >
            {isSubmitting ? "Booking..." : "Book Consultation"}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By booking a consultation, you agree to our terms of service and privacy policy.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
