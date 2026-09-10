/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained build: `next build` emits .next/standalone/ with its own
  // server.js and a minimal node_modules. Deployed as an IIS site via web.config.
  output: "standalone",
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
    // ponytail: script-src keeps 'unsafe-inline'/'unsafe-eval' because Next's
    // hydration/runtime chunks need them without a nonce middleware. Still blocks
    // external script injection, framing, and form hijacking. Tighten with nonces
    // only if a stricter CSP is actually required.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "font-src 'self'",
      "connect-src 'self'",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Static assets in /public churn pre-launch, so a week + revalidate
        // rather than immutable. (/_next/static is already hashed + immutable.)
        source: "/:all*(png|jpg|jpeg|svg|webp|avif|ico|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
