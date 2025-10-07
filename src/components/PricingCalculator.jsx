import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingCalculator() {
  const [serviceType, setServiceType] = useState("");
  const [annualSalary, setAnnualSalary] = useState(100000);
  const [contractHours, setContractHours] = useState(120);
  const [coachingSessions, setCoachingSessions] = useState(1);

  const calculatePrice = () => {
    switch (serviceType) {
      case "contingency":
        return (annualSalary * 0.15).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      case "contract":
        const hourlyRate = 85;
        return (contractHours * hourlyRate).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      case "coaching":
        const sessionRate = 125;
        return (coachingSessions * sessionRate).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
      default:
        return "$0";
    }
  };

  const getDescription = () => {
    switch (serviceType) {
      case "contingency":
        return "Based on 15% of the hired candidate's first-year base compensation. You only pay when we successfully place a candidate.";
      case "contract":
        return `Based on $85/hour for project-based consulting work. Minimum commitment of 120 hours.`;
      case "coaching":
        return "Career coaching and resume services at $125 per 60-minute session. Package discounts available.";
      default:
        return "Select a service type to see pricing details.";
    }
  };

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Pricing Calculator
        </CardTitle>
        <p className="text-sm text-slate-600 mt-2">
          Get an estimate for our services based on your needs
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service Type
            </label>
            <Select onValueChange={setServiceType} value={serviceType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contingency">Contingency Placement</SelectItem>
                <SelectItem value="contract">Contract Services</SelectItem>
                <SelectItem value="coaching">Career Coaching</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {serviceType === "contingency" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expected Annual Salary: ${annualSalary.toLocaleString()}
              </label>
              <Slider
                value={[annualSalary]}
                onValueChange={(value) => setAnnualSalary(value[0])}
                min={30000}
                max={300000}
                step={5000}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>$30,000</span>
                <span>$300,000</span>
              </div>
            </motion.div>
          )}

          {serviceType === "contract" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estimated Hours: {contractHours}
              </label>
              <Slider
                value={[contractHours]}
                onValueChange={(value) => setContractHours(value[0])}
                min={120}
                max={500}
                step={10}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>120 hours (min)</span>
                <span>500 hours</span>
              </div>
            </motion.div>
          )}

          {serviceType === "coaching" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Sessions
              </label>
              <Select
                onValueChange={(value) => setCoachingSessions(parseInt(value))}
                value={coachingSessions.toString()}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Session</SelectItem>
                  <SelectItem value="3">3 Sessions (5% discount)</SelectItem>
                  <SelectItem value="5">5 Sessions (10% discount)</SelectItem>
                  <SelectItem value="10">10 Sessions (15% discount)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {serviceType && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50 rounded-lg p-6 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-700">Estimated Investment:</span>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <span className="text-3xl font-bold text-black">{calculatePrice()}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  {getDescription()}
                </p>
              </div>
            </motion.div>
          )}

          <Button
            className="w-full bg-black text-white hover:bg-slate-800 h-12"
            disabled={!serviceType}
          >
            Request Detailed Quote
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Prices are estimates. Final pricing may vary based on specific requirements and can be discussed during your consultation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
