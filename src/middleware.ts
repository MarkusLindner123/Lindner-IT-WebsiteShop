import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Reine next-intl Middleware: "/" = Deutsch (localePrefix "as-needed"),
// "/de/..." wird auf "/..." normalisiert, "/en" und "/pl" bleiben mit Präfix.
//
// WICHTIG: Hier keine eigenen Locale-Redirects mehr ergänzen. Eine frühere
// Version schickte erkannte Locales auf "/de" — das prallte an der
// "as-needed"-Normalisierung ab und erzeugte eine Endlosschleife
// ("/" → "/de" → "/" → ...), wodurch Google die Seite nicht indexieren konnte.
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
