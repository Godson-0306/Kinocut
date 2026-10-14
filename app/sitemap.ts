import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["", "/terms", "/privacy"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
  }));
}
