import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Pricing() {
  const servicePlans = [
    {
      name: "Contingency Placement",
      description: "Risk-free recruiting - pay only for successful placements",
      features: [
        "No upfront costs",
        "Unlimited candidate submissions",
        "90-day replacement guarantee",
        "Dedicated recruiter",
        "Average 2-4 week placement",
        "All experience levels"
      ]
    },
    {
      name: "Contract Services",
      description: "Flexible consulting for special projects",
      features: [
        "Project-based or ongoing",
        "Process improvement consulting",
        "ATS implementation support",
        "Recruiting strategy development",
        "Custom solutions"
      ]
    },
    {
      name: "Career Services",
      description: "Professional coaching and resume services",
      features: [
        "Resume review and optimization",
        "Interview preparation",
        "Salary negotiation guidance",
        "LinkedIn profile enhancement",
        "Career coaching sessions"
      ]
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
            className="text-center mb-16"
          >
            <h1 className="page-title text-black mb-6">
              Our Services
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Tailored solutions to meet your recruiting and career development needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {servicePlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border border-slate-200 shadow-sm h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-black mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-6">
                      {plan.description}
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-lg text-slate-600 mb-6">
              Ready to learn more? Book a consultation to discuss your specific needs.
            </p>
            <Link
              to={createPageUrl("BookConsultation")}
              className="inline-block bg-black text-white px-8 py-3.5 text-base font-medium rounded-md hover:bg-slate-800 transition-all duration-300"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
