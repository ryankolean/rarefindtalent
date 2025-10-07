import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CaseStudies as CaseStudiesAPI } from "@/api/caseStudies";
import { motion } from "framer-motion";
import { Building2, Target, TrendingUp, Clock } from "lucide-react";

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const data = await CaseStudiesAPI.getPublished();
        setCaseStudies(data);
      } catch (error) {
        console.error("Error fetching case studies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCaseStudies();
  }, []);

  const toggleExpanded = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return null;
  }

  if (caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-slate-600">
            Real results from our client partnerships
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border border-slate-200 shadow-sm h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    {study.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Industry</p>
                        <p className="text-sm text-slate-700">{study.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-medium">Timeline</p>
                        <p className="text-sm text-slate-700">{study.timeline}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-red-600" />
                        <h4 className="font-semibold text-slate-900 text-sm">Challenge</h4>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {study.challenge}
                      </p>
                    </div>

                    {expanded[study.id] && (
                      <>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <h4 className="font-semibold text-slate-900 text-sm">Solution</h4>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {study.solution}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <h4 className="font-semibold text-slate-900 text-sm">Results</h4>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {study.results}
                          </p>
                        </div>

                        {study.position_filled && (
                          <div className="pt-2 border-t border-slate-200">
                            <p className="text-xs text-slate-500 uppercase font-medium mb-1">
                              Positions Filled
                            </p>
                            <p className="text-sm text-slate-700">{study.position_filled}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => toggleExpanded(study.id)}
                    className="mt-4 w-full text-black hover:bg-slate-100"
                  >
                    {expanded[study.id] ? 'Show Less' : 'Read Full Story'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
