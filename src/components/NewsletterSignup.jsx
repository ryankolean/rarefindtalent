import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function NewsletterSignup({ compact = false }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          toast.error("This email is already subscribed");
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        setEmail("");
        toast.success("Successfully subscribed to our newsletter!");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed && !compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-black mb-2">
          Thank You for Subscribing!
        </h3>
        <p className="text-slate-600">
          You'll receive our latest insights and updates in your inbox.
        </p>
      </motion.div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md" aria-label="Newsletter subscription">
        <label htmlFor="newsletter-email-compact" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email-compact"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
          aria-required="true"
          className="flex-1 h-10 text-sm"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="bg-black text-white hover:bg-slate-800 h-10 px-4 text-sm whitespace-nowrap disabled:opacity-50"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Mail className="h-12 w-12 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Stay Informed
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Get the latest hiring insights, career tips, and industry trends delivered to your inbox.
          </p>
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4" aria-label="Newsletter subscription">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  aria-required="true"
                  className="flex-1 h-12 bg-white/10 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 text-base font-medium whitespace-nowrap disabled:opacity-50"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                </Button>
              </form>
              <p className="text-xs text-slate-400 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
