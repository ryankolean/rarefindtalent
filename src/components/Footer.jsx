import React from "react";
import Logo from "@/components/Logo";
import { Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Contingency Placement" },
      { name: "Contract Services" },
      { name: "Resume Services" }
    ],
    company: [
      { name: "About" },
      { name: "Contact" }
    ],
    contact: [
      { icon: Mail, text: "contact@rarefindtalent.com" },
      { icon: Phone, text: "(248) 812-2425" },
      { icon: Linkedin, text: "Connect on LinkedIn" }
    ]
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <div className="text-white">
                <Logo className="h-8 w-auto" />
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Connecting top talent with exceptional opportunities through personalized recruiting services.
            </p>
            <div className="flex gap-4">
              <span
                className="text-slate-400 cursor-default"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((item) => (
                <li key={item.name}>
                  <span className="text-sm cursor-default">
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <span className="text-sm cursor-default">
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <span className="text-sm flex items-center gap-2 cursor-default">
                      <Icon className="h-4 w-4" />
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {currentYear} Rare Find Talent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
