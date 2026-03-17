// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com"
//       }
//     ]
//   }
// };

// export default nextConfig;












import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/dashboard`,
      },
      {
        source: "/dashboard/:path*",
        destination: `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/dashboard/:path*`,
      },
    ];
  },
};

export default nextConfig;