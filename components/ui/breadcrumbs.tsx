"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbSchema } from "@/lib/seo";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  useEffect(() => {
    const breadcrumbItems = [
      { name: "Home", url: "/" },
      ...items
        .filter((item) => item.href)
        .map((item) => ({
          name: item.label,
          url: item.href!,
        })),
    ];

    const schema = generateBreadcrumbSchema(breadcrumbItems);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [items, pathname]);

  const allItems = [
    { label: "Home", href: "/" },
    ...items,
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isFirst = index === 0;

        return (
          <div key={index} className="flex items-center">
            {isFirst && <Home className="w-4 h-4" />}
            {!isFirst && index > 0 && <ChevronRight className="w-4 h-4" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? "text-gray-900 dark:text-gray-100 font-medium" : ""}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
