// app/not-found.tsx
import LocaleLayout from "./[locale]/layout";
import NotFoundPage from "./[locale]/not-found";
import { routing } from "@/i18n/routing";

export default async function RootNotFound() {
  const locale = routing.defaultLocale;

  return (
    <LocaleLayout params={Promise.resolve({ locale })}>
      <NotFoundPage />
    </LocaleLayout>
  );
}
