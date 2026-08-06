import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Domain-Konsolidierung: lindner-tech.com ist die einzige indexierbare Domain.
  async redirects() {
    return [
      // Die Vercel-Produktions-Domain lieferte dieselben Inhalte aus
      // (gesplittete Ranking-Signale). 308 = permanent, vererbt die Linkkraft.
      {
        source: '/:path*',
        has: [{type: 'host', value: 'markuslindner.vercel.app'}],
        destination: 'https://lindner-tech.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Preview-Deployments (*.vercel.app) gehören nie in den Index — greift
      // auch für robots.txt/sitemap.xml, die die Middleware nicht abdeckt.
      {
        source: '/:path*',
        has: [{type: 'host', value: '.*\\.vercel\\.app'}],
        headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
