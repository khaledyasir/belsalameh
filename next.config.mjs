/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Hide the on-screen dev indicator badge.
  devIndicators: false,
  // Phase 0 scaffold: keep builds unblocked by lint. Re-enable (remove this)
  // once the lint pass is part of CI.
  eslint: { ignoreDuringBuilds: true },
  // Keep the public site fast on constrained airport Wi-Fi: modern formats only.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
