import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Bei Bedarf weitere Optionen setzen
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);