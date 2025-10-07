import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, MessageSquare, Target } from "lucide-react";

export default function ResumeServices() {
  const services = [
    {
      icon: FileText,
      title: "Resume Writing & Optimization",
      description: "Professional resume creation and enhancement to showcase your skills and experience effectively. ATS-optimized formatting to ensure your resume passes applicant tracking systems.",
      features: ["Industry-specific formatting", "Keyword optimization", "Achievement-focused content", "ATS-friendly design"]
    },
    {
      icon: MessageSquare,
      title: "LinkedIn Profile Optimization",
      description: "Enhance your professional online presence with a compelling LinkedIn profile that attracts recruiters and highlights your unique value proposition.",
      features: ["Headline optimization", "Summary writing", "Experience enhancement", "Skills & endorsements strategy"]
    },
    {
      icon: Target,
      title: "Career Coaching",
      description: "One-on-one coaching sessions to help you navigate your career path, prepare for interviews, and develop effective job search strategies.",
      features: ["Interview preparation", "Job search strategy", "Salary negotiation tips", "Career transition guidance"]
    }
  ];

  const process = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "We discuss your career goals, experience, and target roles"
    },
    {
      step: "2",
      title: "Document Review",
      description: "We analyze your current materials and identify areas for improvement"
    },
    {
      step: "3",
      title: "Development",
      description: "Our team crafts compelling content tailored to your goals"
    },
    {
      step: "4",
      title: "Refinement",
      description: "We collaborate with you to finalize materials you're confident in"
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
              Resume & Career Services
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-8">
              Stand out in today's competitive job market with professionally crafted resumes, optimized LinkedIn profiles, and personalized career coaching designed to help you land your dream role.
            </p>
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
            <h2 className="text-3xl font-semibold text-black mb-12">Our Services</h2>
            <div className="space-y-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="border border-slate-200 shadow-sm">
                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Icon className="h-7 w-7 text-black" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-black mb-3">{service.title}</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">{service.description}</p>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                  <span className="text-sm text-slate-700">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-semibold text-black mb-12 text-center">How It Works</h2>
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

      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-semibold text-black mb-6">Why Invest in Professional Services?</h2>
              <div className="space-y-4">
                {[
                  "First impressions matter - your resume is often the first contact with potential employers",
                  "Professional writing highlights achievements and quantifies impact",
                  "ATS optimization ensures your resume gets seen by hiring managers",
                  "Expert guidance saves time and increases interview opportunities",
                  "Personalized coaching builds confidence for the interview process"
                ].map((benefit, index) => (
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
              <Card className="border border-slate-200 shadow-sm bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-black mb-4">Ready to Elevate Your Career?</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Schedule a consultation to discuss your career goals and learn how our professional services can help you stand out from the competition.
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
