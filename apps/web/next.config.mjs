/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure that the monorepo packages are transpiled
  transpilePackages: ["@skillx/shared", "@skillx/database", "@skillx/config", "lucide-react"],
};

export default nextConfig;
