import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Briefcase, Shield, Zap } from "lucide-react";

export default function ContractServices() {
  const benefits = [
    "Flexible staffing solutions for project-based work",
    "Reduced overhead costs and administrative burden",
    "Access to specialized skills for specific projects",
    "Quick ramp-up time with pre-vetted contractors",
    "Scalable workforce to match your business needs"
  ];

  const serviceTypes = [
    {
      icon: Briefcase,
      title: "Contract-to-Hire",
      description: "Evaluate talent on a contract basis before making a permanent hiring decision. Perfect for reducing hiring risk and ensuring cultural fit."
    },
    {
      icon: Zap,
      title: "Short-Term Projects",
      description: "Get expert help for time-sensitive projects or seasonal workload increases. Access specialized skills exactly when you need them."
    },
    {
      icon: Shield,
      title: "Long-Term Contracts",
      description: "Fill extended role gaps or ongoing project needs with qualified professionals who can commit to longer engagements."
    }
  ];

  const industries = [
    "Technology & Software Development",
    "Finance & Accounting",
    "Marketing & Creative Services",
    "Human Resources",
    "Operations & Project Management",
    "Sales & Business Development"
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
              In-House Contract Services
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mb-8">
              Need temporary expertise or flexible staffing solutions? Our contract services provide qualified professionals who can seamlessly integrate into your team for project-based work or extended engagements.
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
            <h2 className="text-3xl font-semibold text-black mb-12">Contract Service Options</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {serviceTypes.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="border border-slate-200 shadow-sm h-full">
                      <CardContent className="p-6">
                        <Icon className="h-10 w-10 text-black mb-4" />
                        <h3 className="text-lg font-semibold text-black mb-3">{service.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-semibold text-black mb-6">Why Choose Contract Services?</h2>
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
              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-black mb-4">Industries We Serve</h3>
                  <div className="space-y-3">
                    {industries.map((industry, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <p className="text-slate-700">{industry}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-semibold text-black mb-6">Ready to Build Your Team?</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Let's discuss your contract staffing needs and find the right professionals to support your business objectives.
            </p>
            <Link to={createPageUrl("BookConsultation")}>
              <Button className="bg-black text-white hover:bg-slate-800 h-12 px-8 text-base font-medium">
                Book a Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
