import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "What is contingency placement and how does it work?",
    answer: "Contingency placement means you only pay when we successfully place a candidate who accepts your offer. There are no upfront costs or retainer fees. Our fee is typically 15% of the hired candidate's first year base compensation. We work diligently to find the right fit, and if the placement doesn't work out within the guarantee period, we'll find a replacement at no additional cost."
  },
  {
    question: "How long does the typical placement process take?",
    answer: "The average time-to-fill is 2-4 weeks, though this can vary depending on the role's seniority, required skills, and market conditions. Executive searches may take longer, while entry-level positions often fill more quickly. We provide regular updates throughout the process and work efficiently to minimize your time-to-hire."
  },
  {
    question: "What industries and roles do you specialize in?",
    answer: "We work across multiple industries including technology, finance, professional services, marketing, and operations. Our expertise spans from entry-level positions to C-suite executives. We specialize in mid-level through executive roles but also accommodate part-time and entry-level positions with custom pricing."
  },
  {
    question: "What is your candidate vetting process?",
    answer: "Our vetting process includes thorough resume screening, initial phone interviews, skills assessment, reference checks, and cultural fit evaluation. We only present candidates who meet your specific requirements and have been pre-qualified through our comprehensive evaluation process."
  },
  {
    question: "Do you offer contract-to-hire options?",
    answer: "Yes, our in-house contract services include contract-to-hire arrangements. This allows you to evaluate talent on a contract basis before making a permanent hiring decision, reducing risk and ensuring the right fit for your organization."
  },
  {
    question: "What does your resume review service include?",
    answer: "Our resume services range from live editing sessions to comprehensive rewrites. We offer 40-minute live editing sessions ($100), career coaching ($125/hour), interview preparation ($125/hour), and combined packages. All services include ATS optimization, achievement-focused content, and industry-specific formatting."
  },
  {
    question: "What is your replacement guarantee?",
    answer: "If a placed candidate doesn't work out within the guarantee period (typically 90 days), we will search for and place a replacement candidate at no additional fee. This demonstrates our commitment to finding the right long-term fit for your organization."
  },
  {
    question: "How do you ensure candidate quality?",
    answer: "Quality is our top priority. We maintain a rigorous screening process, conduct detailed interviews, verify references, and assess both technical skills and cultural fit. We also leverage our extensive network of pre-vetted professionals and only present candidates we're confident will succeed in your organization."
  },
  {
    question: "Can you help with remote and hybrid positions?",
    answer: "Absolutely. We work with companies offering remote, hybrid, and in-office arrangements. Our candidate network includes professionals across various locations, and we're experienced in matching talent to flexible work environments."
  },
  {
    question: "What makes Rare Find Talent different from other recruiting firms?",
    answer: "We offer a personalized, boutique approach with deep industry expertise. Unlike larger firms, you work directly with an experienced recruiter who takes time to understand your company culture, specific needs, and long-term goals. We prioritize quality over quantity and focus on building lasting relationships rather than quick placements."
  }
];

export default function FAQ() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Find answers to common questions about our services and process
          </p>
        </div>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-slate-900 hover:text-black">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
