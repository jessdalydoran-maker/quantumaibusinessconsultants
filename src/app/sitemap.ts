import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/content/services";
import { industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/case-studies";
import { getAllResources } from "@/lib/content/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/industries",
    "/how-it-works",
    "/case-studies",
    "/about",
    "/resources",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
  ];

  const dynamicRoutes = [
    ...services.map((s) => `/services/${s.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    ...caseStudies.map((c) => `/case-studies/${c.slug}`),
  ];

  const resourceRoutes = getAllResources().map((r) => ({
    url: `${site.url}/resources/${r.slug}`,
    lastModified: new Date(r.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const otherRoutes = [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: (route === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  return [...otherRoutes, ...resourceRoutes];
}
