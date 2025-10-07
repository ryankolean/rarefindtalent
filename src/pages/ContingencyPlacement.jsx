import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, TrendingUp, Clock } from "lucide-react";

export default function ContingencyPlacement() {
  const benefits = [
    "No upfront costs - pay only when we successfully place a candidate",
    "Access to our extensive network of pre-vetted professionals",
    "Dedicated recruiter assigned to understand your unique needs",
    "Replacement guarantee if the placement doesn't work out",
    "Average time-to-fill: 2-4 weeks"
  ];

  const process = [
    {
      step: "1",
      title: "Discovery Call",
      description: "We learn about your company culture, role requirements, and ideal candidate profile"
    },
    {
      step: "2",
      title: "Candidate Search",
      description: "Our team identifies and vets top talent from our network and active sourcing"
    },
    {
      step: "3",
      title: "Interviews",
      description: "We present qualified candidates and coordinate the interview process"
    },
    {
      step: "4",
      title: "Placement",
      description: "We facilitate the offer process and ensure smooth onboarding"
    }
  ];

  return (
    <div className="bg-white text-slate-800">
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

      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="page-title text-black mb-6">
              Contingency Placement
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-8">
              Our contingency placement service is a risk-free way to find exceptional talent for your organization. You only pay when we successfully place a candidate who accepts your offer.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-black mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">Expert Matching</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our recruiters specialize in finding candidates who match both your technical requirements and company culture.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <TrendingUp className="h-10 w-10 text-black mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">Quality Pipeline</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Access to a continuously updated network of top-tier professionals across various industries.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <Clock className="h-10 w-10 text-black mb-4" />
                <h3 className="text-lg font-semibold text-black mb-2">Fast Turnaround</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Reduce your time-to-hire with our streamlined process and pre-qualified candidate pool.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-semibold text-black mb-12">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border border-slate-200 shadow-sm h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-semibold mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-semibold text-black mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-semibold text-black mb-6">Why Choose Contingency Placement?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700 leading-relaxed">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="border border-slate-200 shadow-sm bg-slate-50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-black mb-4">Ready to Get Started?</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Schedule a free consultation to discuss your hiring needs and learn how our contingency placement service can help you find the perfect candidate.
                  </p>
                  <Link to={createPageUrl("BookConsultation")}>
                    <Button className="w-full bg-black text-white hover:bg-slate-800 h-12 text-base font-medium">
                      Book a Consultation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
