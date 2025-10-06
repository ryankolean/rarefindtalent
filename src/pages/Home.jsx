
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const rotateY = useTransform(scrollYProgress, [0, 0.5], [0, 360]);

  const services = [
    {
      title: "Contingency Placement",
      description: "We will work on openings of any level for a fee equal to 15% of the hired candidate's first year base compensation. We specialize in mid-level through executive roles (up to and including C suite), but we will also work on part-time and entry-level roles for a custom, reduced rate."
    },
    {
      title: "In-house Contract Services", 
      description: "We support project-based needs, such as in-depth research, building a project plan for bringing on new teams, designing and rolling out a recruiting process for your company, or onboarding a new ATS.",
      additional: "Hourly rate (negotiable based on assignment); minimum of 120 hours"
    },
    {
      title: "Resume Reviews/Coaching",
      isCoaching: true,
      services: [
        {
          name: "Live Resume Editing Session",
          price: "$100",
          duration: "(40 minutes)"
        },
        {
          name: "Career Coaching", 
          price: "$125/session",
          duration: "(60 minutes)"
        },
        {
          name: "Interview Coaching & Negotiation Prep",
          price: "$125/session", 
          duration: "(60 minutes)"
        },
        {
          name: "Coaching + Resume Editing Session",
          price: "$175",
          duration: "(80 minutes)"
        }
      ]
    }
  ];

  const reasons = [
    {
      title: "Personalized Approach",
      description: "Every search is tailored to your specific needs, culture, and goals. No cookie-cutter solutions."
    },
    {
      title: "Proven Track Record", 
      description: "Consistent success across industries and levels, from entry-level positions to C-suite executives."
    },
    {
      title: "Transparent Process",
      description: "Clear communication, realistic timelines, and regular updates throughout the entire process."
    },
    {
      title: "Quality Over Quantity",
      description: "Focus on finding the right candidates, not just filling positions quickly."
    },
    {
      title: "Ongoing Support",
      description: "Support doesn't end at placement. Follow-up and guidance to ensure long-term success."
    },
    {
      title: "Industry Expertise",
      description: "Deep understanding of market trends, compensation benchmarks, and hiring best practices."
    }
  ];

  const recommendations = [
    {
      quote: "Krysta was instrumental in building out our exceptional commercial team across multiple global hubs at Carrot. Her incredible drive to find the right candidate fit for each role was complemented by her strong ability to connect with and truly understand potential candidates.",
      name: "Aoife Lucey",
      title: "Vice President of Global Markets at Carrot"
    },
    {
      quote: "I'm incredibly grateful to Krysta for being an exceptional partner as we built out our global team of Clinical Consultants. Her ability to truly understand what we're looking for in both skillset and cultural fit is unmatched. She consistently brought in outstanding candidates and brings genuine commitment to finding the right person for every role.",
      name: "Freddy Rodriguez",
      title: "Senior Manager Clinical Operations / Embryologist & IVF Specialist"
    },
    {
      quote: "Krysta is fantastic to work with. She is always on top of needs, available to brainstorm ideas and ensures she has a thorough understanding of requirements before proceeding. Her dedication and positivity are things that I appreciate more than anything.",
      name: "Susan Rogge-Adyniec",
      title: "VP, Enterprise Sales"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false },
    transition: { duration: 1.2, ease: "easeOut" }
  };

  const staggerContainer = {
    whileInView: {
      transition: {
        staggerChildren: 0.4
      }
    },
    viewport: { once: false }
  };

  return (
    <div className="bg-white text-slate-800">
      <style>
        {`
          .headline-underline-container {
            display: inline-block;
            position: relative;
            text-align: center;
          }
          .headline-multiline {
            margin-bottom: 0.5em;
            line-height: 1.2;
            font-weight: 700;
            font-size: clamp(3rem, 6.5vw, 8rem);
            letter-spacing: -0.025em;
          }
          
          .page-title {
            font-size: clamp(2.25rem, 5vw, 3rem);
            line-height: 1.2;
            font-weight: 600;
            letter-spacing: -1px;
          }
          
          .service-title {
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: -0.5px;
            margin-bottom: 1rem;
          }
          
          .reason-title {
            font-size: 1.125rem;
            font-weight: 600;
          }

          .content-text, .service-description, .reason-description {
            font-size: 1rem;
            line-height: 1.75;
            color: #475569; /* slate-600 */
          }
          
          .coaching-item {
            font-size: 1rem;
            line-height: 1.5;
          }
          
          .oval-portrait {
            width: 320px;
            height: 400px;
            border-radius: 50%;
            object-fit: cover;
            object-position: center top;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
          }
          
          .recommendation-quote {
            font-size: 1.125rem;
            line-height: 1.75;
            color: #334155; /* slate-700 */
            font-style: italic;
            border-left: 3px solid #cbd5e1; /* slate-300 */
            padding-left: 1.5rem;
          }

          .recommendation-author {
            font-weight: 700;
            color: #0f172a; /* slate-900 */
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.02ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.02ms !important;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex items-center justify-center min-h-[50vh]">
        <div className="max-w-7xl mx-auto text-center" style={{ perspective: '1200px' }}>
            <motion.img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/dde06eed3_generated-image10.png"
              alt="Rare Find Talent Logo"
              className="w-[20vw] max-w-[200px] min-w-[60px] mx-auto mb-8"
              style={{ rotateY }}
            />
            <div className="headline-underline-container">
              <h1 className="headline-multiline text-black">
                Connecting top talent<br/>
                with the<br/>
                right opportunities
              </h1>
            </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="page-title text-black mb-16">
              Our Services
            </h2>
          </motion.div>

          <motion.div 
            className="space-y-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false }}
          >
            {services.map((service, index) => (
              <motion.div 
                key={service.title} 
                className={index > 0 ? "pt-16 border-t border-slate-200" : ""}
                variants={fadeInUp}
              >
                <div className="max-w-4xl mx-auto">
                  <h3 className="service-title text-black">
                    {service.title}
                  </h3>
                  
                  {service.isCoaching ? (
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                      {service.services.map((item) => (
                        <div key={item.name}>
                          <Card className="bg-white border-slate-200 shadow-none hover:shadow-sm transition-shadow duration-300 h-full">
                            <CardContent className="p-6">
                              <div className="coaching-item">
                                <div className="font-semibold text-black mb-2">{item.name}</div>
                                <div className="text-slate-600">
                                  <span className="font-medium text-slate-800">{item.price}</span> {item.duration}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="service-description max-w-3xl">
                        {service.description}
                      </p>
                      {service.additional && (
                        <p className="service-description font-medium text-slate-700">
                          {service.additional}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Meet Krysta Section */}
      <section id="meet-krysta" className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h2 
              className="page-title text-black mb-16"
            >
              Meet Krysta
            </h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/53041ff8e_image.png"
                alt="Krysta Kolean"
                className="oval-portrait"
              />
            </motion.div>
            <motion.div 
              className="order-2 lg:order-1 space-y-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: false }}
            >
              <motion.p className="content-text" variants={fadeInUp}>
                With over a decade of experience in talent acquisition and recruitment, Krysta brings a unique combination of strategic insight and hands-on expertise to every client engagement.
              </motion.p>
              <motion.p className="content-text" variants={fadeInUp}>
                Her background spans across multiple industries, from fast-growing startups to established corporations, giving her the perspective needed to understand both candidate motivations and organizational needs.
              </motion.p>
              <motion.p className="content-text" variants={fadeInUp}>
                Krysta's approach is built on genuine relationships, transparent communication, and a commitment to finding the right fit for both parties. She believes that successful placements are about more than just matching skills on paper—they're about understanding culture, values, and long-term goals.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Krysta Section */}
      <section id="why-krysta" className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="page-title text-black mb-16">
              Why Krysta
            </h2>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="grid md:grid-cols-2 gap-x-12 gap-y-10"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: false }}
            >
              {reasons.map((reason) => (
                <motion.div 
                  key={reason.title} 
                  className="space-y-3"
                  variants={fadeInUp}
                >
                  <h3 className="reason-title text-black">
                    {reason.title}
                  </h3>
                  <p className="reason-description">
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section id="recommendations" className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="page-title text-black mb-16">
              Recommendations
            </h2>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="space-y-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: false }}
            >
              {recommendations.map((rec) => (
                <motion.div 
                  key={rec.name} 
                  className="text-center"
                  variants={fadeInUp}
                >
                  <blockquote className="recommendation-quote">
                    "{rec.quote}"
                  </blockquote>
                  <cite className="mt-6 block not-italic">
                    <span className="recommendation-author">{rec.name}</span>
                    <br />
                    <span className="text-slate-600">{rec.title}</span>
                  </cite>
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
              className="text-center mt-16"
              variants={fadeInUp}
            >
              <a
                href="https://www.linkedin.com/in/krystakolean/details/recommendations/?detailScreenTabIndex=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-3.5 text-base font-medium rounded-md hover:bg-slate-800 transition-all duration-600 transform hover:scale-105"
              >
                Read More on LinkedIn
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <motion.section 
        className="px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200"
        {...fadeInUp}
      >
        <div className="max-w-7xl mx-auto text-center">
          <Link
            to={createPageUrl("BookConsultation")}
            className="inline-block bg-black text-white px-8 py-3.5 text-base font-medium rounded-md hover:bg-slate-800 transition-all duration-600 transform hover:scale-105"
          >
            Book a Consultation
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
