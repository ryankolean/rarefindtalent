import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="mb-8">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-9xl font-bold text-slate-900 mb-4"
          >
            404
          </motion.h1>
          <h2 className="text-3xl font-semibold text-slate-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            className="bg-black text-white hover:bg-slate-800 h-12 px-8 w-full sm:w-auto"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 h-12 px-8 w-full sm:w-auto"
          >
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              to="/ContingencyPlacement"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Contingency Placement
            </Link>
            <span className="text-slate-400">•</span>
            <Link
              to="/ContractServices"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Contract Services
            </Link>
            <span className="text-slate-400">•</span>
            <Link
              to="/ResumeServices"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Resume Services
            </Link>
            <span className="text-slate-400">•</span>
            <Link
              to="/About"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              About
            </Link>
            <span className="text-slate-400">•</span>
            <Link
              to="/BookConsultation"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
