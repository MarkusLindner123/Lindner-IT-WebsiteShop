import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing, type AppLocale } from './i18n/routing';

// next-intl Middleware erstellen
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Normale next-intl Middleware ausführen
  const response = intlMiddleware(request);

  // Prüfen, ob ein Redirect geplant war (z. B. auf /en)
  if (response instanceof NextResponse && response.status === 307) {
    const url = request.nextUrl.clone();

    // Erstes Segment der URL (locale) extrahieren
    const localeSegment = url.pathname.split('/')[1];

    // Prüfen, ob es eine gültige Locale ist
    if (!localeSegment || !routing.locales.includes(localeSegment as AppLocale)) {
      // Immer Default-Locale /de verwenden
      url.pathname = `/de${url.pathname}` as unknown as string;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
