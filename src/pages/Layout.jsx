

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === createPageUrl("Home");

  const navigation = [
    { name: "Services", href: "#services" },
    { name: "Meet Krysta", href: "#meet-krysta" },
    { name: "Why Krysta", href: "#why-krysta" },
    { name: "Recommendations", href: "#recommendations" }
  ];

  const handleNavClick = (e, href) => {
    if (isHomePage) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const NavLink = ({ href, name }) => {
    if (isHomePage) {
      return (
        <a
          href={href}
          onClick={(e) => handleNavClick(e, href)}
          className="krysta-nav text-slate-800 hover:text-black transition-colors duration-200"
        >
          {name}
        </a>
      );
    }
    // Fallback for other pages if needed
    return (
      <Link
        to={createPageUrl(`Home`)+href}
        className="krysta-nav text-slate-800 hover:text-black transition-colors duration-200"
      >
        {name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Neuton:ital,wght@0,400;0,700;1,400;1,700&display=swap');
          
          html {
            scroll-behavior: smooth;
          }

          body {
            font-family: 'Neuton', Georgia, Times New Roman, serif;
            padding-top: 80px; /* Header height offset */
            background-color: #FFFFFF;
            color: #1f2937;
          }
          
          .krysta-nav {
            font-size: 16px;
            font-weight: 400;
          }
          
          .krysta-brand {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 1px;
          }
        `}
      </style>

      {/* Header */}
      <header className="bg-white py-5 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 border-b border-slate-100">
        <nav className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="krysta-brand text-black">
              RARE FIND TALENT
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <NavLink key={item.name} href={item.href} name={item.name} />
              ))}
              <Link
                to={createPageUrl("BookConsultation")}
                className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors duration-200"
              >
                Book a Consultation
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-black"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-6 pb-4 border-t border-slate-100">
              <div className="flex flex-col space-y-4 pt-4">
                {navigation.map((item) => {
                  if (isHomePage) {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="krysta-nav text-slate-800 hover:text-black transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    );
                  }
                  return (
                     <Link
                        key={item.name}
                        to={createPageUrl(`Home`)+item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="krysta-nav text-slate-800 hover:text-black transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                  );
                })}
                <Link
                  to={createPageUrl("BookConsultation")}
                  className="bg-black text-white px-5 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors duration-200 text-center mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

