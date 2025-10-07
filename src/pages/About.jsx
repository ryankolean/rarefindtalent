import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Heart, Target, Users } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Authentic Relationships",
      description: "We prioritize building genuine, long-term relationships over transactional interactions. Every client and candidate is treated as a valued partner."
    },
    {
      icon: Target,
      title: "Quality Over Quantity",
      description: "We focus on finding the right fit rather than filling positions quickly. Our thorough vetting process ensures mutual success for all parties."
    },
    {
      icon: Award,
      title: "Industry Expertise",
      description: "With years of recruiting experience across multiple industries, we bring deep knowledge and insights to every placement."
    },
    {
      icon: Users,
      title: "Personalized Service",
      description: "We take the time to understand your unique needs, culture, and goals to deliver customized talent solutions."
    }
  ];

  const timeline = [
    {
      year: "2015",
      title: "Career Beginnings",
      description: "Started recruiting career with a passion for connecting talented professionals with great opportunities."
    },
    {
      year: "2018",
      title: "Specialized Focus",
      description: "Developed expertise in contingency placement and contract services across technology and professional services sectors."
    },
    {
      year: "2020",
      title: "Expanded Services",
      description: "Added resume writing and career coaching to provide comprehensive support for job seekers."
    },
    {
      year: "2023",
      title: "Rare Find Talent",
      description: "Launched independent recruiting practice to deliver more personalized, relationship-focused service."
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
              About Rare Find Talent
            </h1>
            <div className="max-w-3xl">
              <p className="text-xl text-slate-600 leading-relaxed mb-6">
                Rare Find Talent is a boutique recruiting firm founded on the belief that exceptional talent placement requires more than just matching resumes to job descriptions.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We combine industry expertise with a personalized approach to understand the unique needs of both our clients and candidates. Our mission is to create meaningful connections that drive mutual success and long-term growth.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="meet-krysta" className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-semibold text-black mb-12">Meet Krysta</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <p className="text-slate-700 leading-relaxed">
                  With over 8 years of experience in talent acquisition and recruitment, Krysta brings a wealth of knowledge and a proven track record of successful placements across diverse industries.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Her approach goes beyond traditional recruiting. Krysta takes the time to understand company cultures, team dynamics, and individual career aspirations to ensure every match is built to last.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Whether working with growing startups or established enterprises, Krysta's commitment to authenticity and excellence has earned her a reputation as a trusted talent partner who consistently delivers results.
                </p>
              </div>
              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-black mb-4">Professional Background</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Areas of Expertise</h4>
                      <ul className="text-slate-600 space-y-1 ml-4">
                        <li>• Executive & Professional Recruiting</li>
                        <li>• Technology & IT Staffing</li>
                        <li>• Contract & Contingency Placement</li>
                        <li>• Career Coaching & Resume Writing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Certifications</h4>
                      <ul className="text-slate-600 space-y-1 ml-4">
                        <li>• Professional Recruiter Certification</li>
                        <li>• LinkedIn Certified Professional</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            <h2 className="text-3xl font-semibold text-black mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="border border-slate-200 shadow-sm h-full">
                      <CardContent className="p-6">
                        <Icon className="h-10 w-10 text-black mb-4" />
                        <h3 className="text-lg font-semibold text-black mb-3">{value.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-semibold text-black mb-12 text-center">Our Journey</h2>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-black text-white rounded-lg flex items-center justify-center">
                            <span className="text-xl font-semibold">{item.year}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-black mb-2">{item.title}</h3>
                          <p className="text-slate-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-semibold text-black mb-6">Let's Work Together</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Whether you're looking to hire exceptional talent or advance your career, we're here to help you succeed.
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
