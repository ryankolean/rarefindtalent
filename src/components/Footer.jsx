import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Logo from "@/components/Logo";
import { Linkedin, Mail, Phone } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Contingency Placement", href: "/ContingencyPlacement" },
      { name: "Contract Services", href: "/ContractServices" },
      { name: "Resume Services", href: "/ResumeServices" }
    ],
    company: [
      { name: "About", href: "/About" },
      { name: "Pricing", href: "/Pricing" },
      { name: "Testimonials", href: "/#testimonials" }
    ],
    contact: [
      { icon: Mail, text: "contact@rarefindtalent.com", href: "mailto:contact@rarefindtalent.com" },
      { icon: Phone, text: "(555) 123-4567", href: "tel:+15551234567" },
      { icon: Linkedin, text: "Connect on LinkedIn", href: "https://www.linkedin.com" }
    ]
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <Link to="/" className="text-white">
                <Logo className="h-8 w-auto" />
              </Link>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Connecting top talent with exceptional opportunities through personalized recruiting services.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={createPageUrl("BookConsultation")}
                  className="text-sm hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-2 text-sm">Stay Updated</h3>
            <NewsletterSignup compact />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {currentYear} Rare Find Talent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
