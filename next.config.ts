import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/Lindner-IT-WebsiteShop",    // GitHub Pages subpath
  assetPrefix: "/Lindner-IT-WebsiteShop/", 
  images: { unoptimized: true },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
