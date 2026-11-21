import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // /retos fue la primera ruta; los enlaces ya compartidos deben seguir funcionando.
  redirects() {
    return [
      { source: "/retos", destination: "/challenges", permanent: true },
      { source: "/retos/:slug", destination: "/challenges/:slug", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
