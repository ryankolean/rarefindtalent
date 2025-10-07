

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import Logo from "@/components/Logo";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/" || location.pathname === createPageUrl("Home");

  const navigation = [
    { name: "Home", href: "/", type: "link" },
    {
      name: "Services",
      type: "dropdown",
      items: [
        { name: "All Services", href: "#services" },
        { name: "Contingency Placement", href: "/ContingencyPlacement" },
        { name: "Contract Services", href: "/ContractServices" },
        { name: "Resume Services", href: "/ResumeServices" }
      ]
    },
    { name: "About", href: "/About", type: "link" },
    { name: "Pricing", href: "/Pricing", type: "link" },
    { name: "Contact", href: "/BookConsultation", type: "link" }
  ];

  const [servicesDropdownOpen, setServicesDropdownOpen] = React.useState(false);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      if (isHomePage) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      } else {
        window.location.href = createPageUrl('Home') + href;
      }
    }
  };

  const NavLink = ({ item }) => {
    if (item.type === 'dropdown') {
      return (
        <div className="relative group">
          <button
            className="krysta-nav text-slate-800 hover:text-black transition-colors duration-200 flex items-center gap-1"
            onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
          >
            {item.name}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.items.map((subItem) => {
              if (subItem.href.startsWith('#')) {
                return (
                  <a
                    key={subItem.name}
                    href={subItem.href}
                    onClick={(e) => handleNavClick(e, subItem.href)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                  >
                    {subItem.name}
                  </a>
                );
              }
              return (
                <Link
                  key={subItem.name}
                  to={subItem.href}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                >
                  {subItem.name}
                </Link>
              );
            })}
          </div>
        </div>
      );
    }

    if (item.href.startsWith('#')) {
      return (
        <a
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
        to={item.href}
        className="krysta-nav text-slate-800 hover:text-black transition-colors duration-200"
      >
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
          
          html {
            scroll-behavior: smooth;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding-top: 64px; /* Header height offset */
            background-color: #FFFFFF;
            color: #1f2937;
          }

          @media (min-width: 768px) {
            body {
              padding-top: 80px;
            }
          }
          
          .krysta-nav {
            font-size: 15px;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
          }
          
          .krysta-brand {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 1px;
            font-family: 'Inter', sans-serif;
          }

          h1, h2, h3, h4, h5, h6 {
            font-family: 'Playfair Display', Georgia, serif;
          }

          :root {
            --color-primary: #0f172a;
            --color-primary-hover: #1e293b;
            --color-accent: #0ea5e9;
            --color-accent-hover: #0284c7;
            --color-text: #1f2937;
            --color-text-light: #64748b;
          }
        `}
      </style>

      {/* Header */}
      <header className="bg-white py-4 sm:py-5 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 border-b border-slate-100">
        <nav className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center text-black hover:text-slate-700 transition-colors">
              <Logo className="h-7 sm:h-8 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-black h-12 w-12 touch-manipulation"
              >
                {mobileMenuOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <Menu className="h-7 w-7" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-6 pb-4 border-t border-slate-100">
              <div className="flex flex-col space-y-4 pt-4">
                {navigation.map((item) => {
                  if (item.type === 'dropdown') {
                    return (
                      <div key={item.name} className="space-y-2">
                        <div className="krysta-nav text-slate-800 font-medium">{item.name}</div>
                        <div className="pl-4 space-y-2">
                          {item.items.map((subItem) => {
                            if (subItem.href.startsWith('#')) {
                              return (
                                <a
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={(e) => {
                                    handleNavClick(e, subItem.href);
                                    setMobileMenuOpen(false);
                                  }}
                                  className="block text-sm text-slate-700 hover:text-black transition-colors"
                                >
                                  {subItem.name}
                                </a>
                              );
                            }
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-sm text-slate-700 hover:text-black transition-colors"
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (item.href.startsWith('#')) {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          handleNavClick(e, item.href);
                          setMobileMenuOpen(false);
                        }}
                        className="krysta-nav text-slate-800 hover:text-black transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="krysta-nav text-slate-800 hover:text-black transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {!isHomePage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

