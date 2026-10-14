import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const allow = "/";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow },
      { userAgent: "GPTBot", allow },
      { userAgent: "OAI-SearchBot", allow },
      { userAgent: "PerplexityBot", allow },
      { userAgent: "ClaudeBot", allow },
      { userAgent: "Google-Extended", allow },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
