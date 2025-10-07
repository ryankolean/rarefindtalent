import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Testimonials as TestimonialsAPI } from "@/api/testimonials";
import { motion } from "framer-motion";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await TestimonialsAPI.getFeatured();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-600">
            Real feedback from companies we've helped
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border border-slate-200 shadow-sm h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6 italic">
                    "{testimonial.testimonial_text}"
                  </p>
                  <div className="border-t border-slate-200 pt-4">
                    <p className="font-semibold text-black">{testimonial.client_name}</p>
                    {testimonial.client_title && (
                      <p className="text-sm text-slate-600">
                        {testimonial.client_title}
                        {testimonial.client_company && ` at ${testimonial.client_company}`}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
