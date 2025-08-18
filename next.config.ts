import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Bei Bedarf weitere Optionen setzen
  reactStrictMode: true,
  output: "export", // ✅ enables static HTML export
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);