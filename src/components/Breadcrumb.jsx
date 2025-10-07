import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbItems = [
    { name: 'Home', path: '/' }
  ];

  if (pathSegments.length > 0) {
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const formattedName = segment
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();

      breadcrumbItems.push({
        name: formattedName,
        path: path
      });
    });
  }

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-slate-400 mx-2" />
              )}
              {isLast ? (
                <span className="text-slate-600 font-medium">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-slate-500 hover:text-black transition-colors duration-200 flex items-center gap-1"
                >
                  {index === 0 && <Home className="h-4 w-4" />}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
