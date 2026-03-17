/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/dashboard",  // Tells the dashboard app it is served under /dashboard path
  assetPrefix: "/dashboard", // Required so assets (JS, CSS) are also served correctly under /dashboard
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;

