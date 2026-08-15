import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@supabase/ssr", "pdf-parse", "mammoth", "pdfjs-dist"],
};

export default nextConfig;
