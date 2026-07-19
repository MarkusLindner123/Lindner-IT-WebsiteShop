// Blog-Inhalte für alle Locales. Kein CMS, kein MDX — bewusst einfach:
// Ein neuer Artikel = ein neuer Eintrag in POSTS (alle drei Sprachen pflegen!).
import type { AppLocale } from "@/i18n/routing";

export interface PostSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface PostContent {
  title: string;
  description: string;
  intro: string;
  sections: PostSection[];
  outro: string;
}

export interface Post {
  slug: string;
  date: string; // ISO-Datum
  readingMinutes: number;
  content: Record<AppLocale, PostContent>;
}

export const POSTS: Post[] = [
  {
    slug: "it-sicherheit-kanzleien",
    date: "2026-06-05",
    readingMinutes: 6,
    content: {
      de: {
        title: "IT-Sicherheit für Kanzleien: 5 Maßnahmen mit sofortiger Wirkung",
        description:
          "Mandantendaten sind ein attraktives Ziel für Angreifer. Diese fünf Maßnahmen heben das Sicherheitsniveau Ihrer Kanzlei sofort — ohne Großprojekt.",
        intro:
          "Kanzleien verwalten hochsensible Mandantendaten und unterliegen der berufsrechtlichen Schweigepflicht — ein erfolgreicher Angriff ist hier nicht nur ein IT-Problem, sondern ein Haftungsfall. Die gute Nachricht: Die wirksamsten Schutzmaßnahmen sind keine Großprojekte. Diese fünf Punkte setze ich bei Kanzlei-Kunden zuerst um.",
        sections: [
          {
            heading: "1. Zwei-Faktor-Authentifizierung überall aktivieren",
            paragraphs: [
              "Gestohlene Passwörter sind der häufigste Einstiegspunkt für Angreifer. Mit einem zweiten Faktor — App-Bestätigung oder Hardware-Schlüssel — wird ein gestohlenes Passwort weitgehend wertlos. Priorität haben E-Mail-Konten, Microsoft 365, Kanzleisoftware und das VPN. Der Aufwand liegt bei wenigen Stunden, der Sicherheitsgewinn ist enorm.",
            ],
          },
          {
            heading: "2. Updates konsequent und zeitnah einspielen",
            paragraphs: [
              "Die meisten erfolgreichen Angriffe nutzen Sicherheitslücken aus, für die es längst Updates gibt. Windows, Kanzleisoftware, Browser, Router und NAS-Systeme brauchen einen festen Update-Rhythmus — idealerweise automatisiert und überwacht, damit kein Gerät durchrutscht.",
            ],
          },
          {
            heading: "3. Backups nach der 3-2-1-Regel",
            paragraphs: [
              "Ransomware verschlüsselt heute gezielt auch erreichbare Backups. Deshalb: drei Kopien Ihrer Daten, auf zwei verschiedenen Medien, davon eine außer Haus und vom Netz getrennt. Genauso wichtig: die Wiederherstellung regelmäßig testen. Ein Backup, das nie getestet wurde, ist nur eine Hoffnung.",
            ],
          },
          {
            heading: "4. Das Team gegen Phishing schulen",
            paragraphs: [
              "Die beste Technik hilft nicht, wenn eine täuschend echte 'Mandanten-E-Mail' zum Klick verleitet. Kurze, regelmäßige Schulungen mit echten Beispielen senken die Klickrate drastisch. Wichtig ist eine Kultur, in der Verdachtsfälle sofort und ohne Schuldzuweisung gemeldet werden.",
            ],
          },
          {
            heading: "5. Verschlüsselung und Zugriffsrechte prüfen",
            paragraphs: [
              "Notebooks und Smartphones gehören vollverschlüsselt (BitLocker ist bei Windows Pro dabei), Mandantenkommunikation per E-Mail mindestens transportverschlüsselt. Und intern gilt das Need-to-know-Prinzip: Nicht jede Person in der Kanzlei braucht Zugriff auf jede Akte. Saubere Berechtigungen begrenzen den Schaden, falls doch einmal ein Konto kompromittiert wird.",
            ],
          },
        ],
        outro:
          "Diese fünf Maßnahmen sind in den meisten Kanzleien innerhalb weniger Tage umsetzbar und decken die häufigsten Angriffswege ab. Wenn Sie wissen möchten, wo Ihre Kanzlei steht: Ich führe eine kompakte Bestandsaufnahme durch und priorisiere die Maßnahmen nach Risiko und Aufwand.",
      },
      en: {
        title: "IT Security for Law Firms: 5 Measures with Immediate Impact",
        description:
          "Client data is an attractive target for attackers. These five measures raise your firm's security level immediately — no major project required.",
        intro:
          "Law firms manage highly sensitive client data and are bound by professional confidentiality — a successful attack is not just an IT problem but a liability case. The good news: the most effective protections are not big projects. These are the five things I implement first with law firm clients.",
        sections: [
          {
            heading: "1. Enable two-factor authentication everywhere",
            paragraphs: [
              "Stolen passwords are the most common entry point for attackers. With a second factor — an app confirmation or a hardware key — a stolen password becomes largely worthless. Prioritize email accounts, Microsoft 365, your practice management software and the VPN. It takes a few hours; the security gain is enormous.",
            ],
          },
          {
            heading: "2. Apply updates consistently and promptly",
            paragraphs: [
              "Most successful attacks exploit vulnerabilities for which patches have long existed. Windows, legal software, browsers, routers and NAS systems need a fixed update routine — ideally automated and monitored so no device slips through.",
            ],
          },
          {
            heading: "3. Back up following the 3-2-1 rule",
            paragraphs: [
              "Modern ransomware deliberately encrypts reachable backups too. So: three copies of your data, on two different media, one of them off-site and disconnected from the network. Equally important: test your restores regularly. A backup that has never been tested is just a hope.",
            ],
          },
          {
            heading: "4. Train your team against phishing",
            paragraphs: [
              "The best technology won't help if a convincing 'client email' triggers a click. Short, regular trainings with real examples reduce click rates drastically. What matters is a culture where suspicious messages are reported immediately and without blame.",
            ],
          },
          {
            heading: "5. Review encryption and access rights",
            paragraphs: [
              "Notebooks and smartphones should be fully encrypted (BitLocker ships with Windows Pro), and client communication by email should at least use transport encryption. Internally, apply the need-to-know principle: not everyone in the firm needs access to every file. Clean permissions limit the damage if an account does get compromised.",
            ],
          },
        ],
        outro:
          "In most firms these five measures can be implemented within days and cover the most common attack paths. If you want to know where your firm stands, I offer a compact assessment and prioritize measures by risk and effort.",
      },
      pl: {
        title: "Bezpieczeństwo IT w kancelariach: 5 działań o natychmiastowym efekcie",
        description:
          "Dane klientów to atrakcyjny cel dla atakujących. Te pięć działań od razu podnosi poziom bezpieczeństwa kancelarii — bez wielkiego projektu.",
        intro:
          "Kancelarie zarządzają bardzo wrażliwymi danymi klientów i są związane tajemnicą zawodową — udany atak to nie tylko problem IT, ale kwestia odpowiedzialności prawnej. Dobra wiadomość: najskuteczniejsze zabezpieczenia to nie wielkie projekty. Oto pięć rzeczy, które u klientów z kancelarii wdrażam w pierwszej kolejności.",
        sections: [
          {
            heading: "1. Włącz wszędzie uwierzytelnianie dwuskładnikowe",
            paragraphs: [
              "Skradzione hasła to najczęstsza droga ataku. Z drugim składnikiem — potwierdzeniem w aplikacji lub kluczem sprzętowym — skradzione hasło staje się praktycznie bezwartościowe. Priorytet: konta e-mail, Microsoft 365, oprogramowanie kancelaryjne i VPN. To kilka godzin pracy, a zysk bezpieczeństwa jest ogromny.",
            ],
          },
          {
            heading: "2. Instaluj aktualizacje konsekwentnie i szybko",
            paragraphs: [
              "Większość udanych ataków wykorzystuje luki, na które od dawna istnieją poprawki. Windows, oprogramowanie kancelaryjne, przeglądarki, routery i systemy NAS potrzebują stałego rytmu aktualizacji — najlepiej zautomatyzowanego i monitorowanego, aby żadne urządzenie nie zostało pominięte.",
            ],
          },
          {
            heading: "3. Kopie zapasowe według reguły 3-2-1",
            paragraphs: [
              "Nowoczesny ransomware celowo szyfruje także dostępne kopie zapasowe. Dlatego: trzy kopie danych, na dwóch różnych nośnikach, z czego jedna poza siedzibą i odłączona od sieci. Równie ważne: regularnie testuj odtwarzanie. Kopia zapasowa, której nigdy nie przetestowano, to tylko nadzieja.",
            ],
          },
          {
            heading: "4. Szkol zespół z rozpoznawania phishingu",
            paragraphs: [
              "Najlepsza technologia nie pomoże, jeśli łudząco prawdziwy 'e-mail od klienta' skłoni do kliknięcia. Krótkie, regularne szkolenia na prawdziwych przykładach drastycznie obniżają liczbę kliknięć. Kluczowa jest kultura, w której podejrzane wiadomości zgłasza się od razu i bez obwiniania.",
            ],
          },
          {
            heading: "5. Sprawdź szyfrowanie i uprawnienia dostępu",
            paragraphs: [
              "Laptopy i smartfony powinny być w pełni zaszyfrowane (BitLocker jest częścią Windows Pro), a komunikacja z klientami e-mailem — przynajmniej z szyfrowaniem transportowym. Wewnątrz obowiązuje zasada need-to-know: nie każda osoba w kancelarii potrzebuje dostępu do każdej sprawy. Czyste uprawnienia ograniczają szkody, gdyby jednak doszło do przejęcia konta.",
            ],
          },
        ],
        outro:
          "W większości kancelarii te pięć działań można wdrożyć w kilka dni — pokrywają one najczęstsze drogi ataku. Jeśli chcesz wiedzieć, na jakim etapie jest Twoja kancelaria, przeprowadzam zwięzły audyt i priorytetyzuję działania według ryzyka i nakładu.",
      },
    },
  },
  {
    slug: "backup-3-2-1-regel",
    date: "2026-06-22",
    readingMinutes: 5,
    content: {
      de: {
        title: "Die 3-2-1-Regel: Datensicherung, die im Ernstfall wirklich funktioniert",
        description:
          "Festplatten sterben, Ransomware verschlüsselt, Menschen löschen versehentlich. Die 3-2-1-Regel ist der einfachste Backup-Standard, der alle drei Fälle übersteht.",
        intro:
          "Bei Datenrettungen sehe ich immer dasselbe Muster: Es gab ein Backup — aber es lag auf derselben Festplatte, war Monate alt oder wurde von der Ransomware gleich mitverschlüsselt. Die 3-2-1-Regel ist ein einfacher Standard, der genau diese Fälle verhindert. Sie ist für ein Zwei-Personen-Büro genauso umsetzbar wie für ein Unternehmen mit fünfzig Mitarbeitenden.",
        sections: [
          {
            heading: "Was die Regel besagt",
            bullets: [
              "3 Kopien Ihrer Daten: das Original plus zwei Sicherungen.",
              "2 verschiedene Medien: z. B. NAS im Büro und Cloud-Speicher — nicht zweimal dieselbe USB-Platte.",
              "1 Kopie außer Haus: räumlich getrennt und idealerweise offline bzw. unveränderbar (Immutable Backup).",
            ],
          },
          {
            heading: "Warum eine Kopie offline sein muss",
            paragraphs: [
              "Moderne Ransomware sucht aktiv nach erreichbaren Backups — Netzlaufwerke, NAS-Freigaben, verbundene USB-Platten — und verschlüsselt sie zuerst. Eine Kopie, die physisch getrennt oder technisch unveränderbar ist, ist Ihre letzte Verteidigungslinie. Cloud-Backups mit Versionierung und Löschschutz erfüllen diesen Zweck ebenfalls.",
            ],
          },
          {
            heading: "Der Punkt, den fast alle vergessen: Wiederherstellung testen",
            paragraphs: [
              "Ein Backup ist erst dann ein Backup, wenn die Wiederherstellung nachweislich funktioniert. Mindestens quartalsweise sollten Sie stichprobenartig Dateien zurückholen und einmal im Jahr einen kompletten Wiederherstellungsfall durchspielen: Wie lange dauert es? Fehlt etwas? Kennt jemand außer einer einzigen Person das Verfahren?",
            ],
          },
          {
            heading: "Konkreter Aufbau für ein kleines Unternehmen",
            paragraphs: [
              "Ein bewährtes Setup: Die Arbeitsdaten liegen auf Server oder Microsoft 365. Ein NAS im Büro zieht täglich automatische Sicherungen. Zusätzlich läuft ein verschlüsseltes Cloud-Backup mit Versionierung zu einem europäischen Anbieter. Wichtige Systeme werden als komplettes Image gesichert, damit im Ernstfall nicht nur Dateien, sondern ganze Rechner wiederherstellbar sind.",
            ],
          },
        ],
        outro:
          "Datensicherung ist kein Produkt, das man einmal kauft, sondern ein Prozess mit klaren Zuständigkeiten. Ich richte 3-2-1-Backups für KMU ein — inklusive Automatisierung, Monitoring und dokumentiertem Wiederherstellungsplan.",
      },
      en: {
        title: "The 3-2-1 Rule: Backups That Actually Work When It Matters",
        description:
          "Drives die, ransomware encrypts, people delete by accident. The 3-2-1 rule is the simplest backup standard that survives all three.",
        intro:
          "In data recovery jobs I keep seeing the same pattern: there was a backup — but it lived on the same drive, was months old, or got encrypted by the ransomware along with everything else. The 3-2-1 rule is a simple standard that prevents exactly these cases, and it works for a two-person office just as well as for a company of fifty.",
        sections: [
          {
            heading: "What the rule says",
            bullets: [
              "3 copies of your data: the original plus two backups.",
              "2 different media: e.g. a NAS in the office and cloud storage — not the same USB drive twice.",
              "1 copy off-site: physically separate and ideally offline or immutable.",
            ],
          },
          {
            heading: "Why one copy must be offline",
            paragraphs: [
              "Modern ransomware actively hunts for reachable backups — network shares, NAS exports, connected USB drives — and encrypts them first. A copy that is physically disconnected or technically immutable is your last line of defense. Cloud backups with versioning and delete protection serve the same purpose.",
            ],
          },
          {
            heading: "The step almost everyone skips: testing restores",
            paragraphs: [
              "A backup only becomes a backup once a restore has demonstrably worked. At least quarterly, restore a few sample files; once a year, run through a full recovery scenario: How long does it take? Is anything missing? Does anyone besides a single person know the procedure?",
            ],
          },
          {
            heading: "A concrete setup for a small business",
            paragraphs: [
              "A proven setup: working data lives on a server or in Microsoft 365. A NAS in the office pulls automated daily backups. In addition, an encrypted cloud backup with versioning runs to a European provider. Critical systems are saved as full images, so in an emergency you can restore entire machines, not just files.",
            ],
          },
        ],
        outro:
          "Backup is not a product you buy once — it's a process with clear responsibilities. I set up 3-2-1 backups for SMEs, including automation, monitoring and a documented recovery plan.",
      },
      pl: {
        title: "Reguła 3-2-1: kopie zapasowe, które naprawdę działają w kryzysie",
        description:
          "Dyski się psują, ransomware szyfruje, ludzie kasują przez przypadek. Reguła 3-2-1 to najprostszy standard backupu, który przetrwa wszystkie trzy scenariusze.",
        intro:
          "Przy odzyskiwaniu danych wciąż widzę ten sam schemat: kopia zapasowa istniała — ale leżała na tym samym dysku, miała kilka miesięcy albo została zaszyfrowana przez ransomware razem z resztą. Reguła 3-2-1 to prosty standard, który zapobiega dokładnie tym przypadkom — i sprawdza się zarówno w dwuosobowym biurze, jak i w firmie z pięćdziesięcioma pracownikami.",
        sections: [
          {
            heading: "Co mówi reguła",
            bullets: [
              "3 kopie danych: oryginał plus dwie kopie zapasowe.",
              "2 różne nośniki: np. NAS w biurze i chmura — nie dwa razy ten sam dysk USB.",
              "1 kopia poza siedzibą: fizycznie oddzielona, najlepiej offline lub niezmienialna (immutable).",
            ],
          },
          {
            heading: "Dlaczego jedna kopia musi być offline",
            paragraphs: [
              "Nowoczesny ransomware aktywnie szuka osiągalnych kopii zapasowych — udziałów sieciowych, zasobów NAS, podłączonych dysków USB — i szyfruje je w pierwszej kolejności. Kopia fizycznie odłączona lub technicznie niezmienialna to ostatnia linia obrony. Backup w chmurze z wersjonowaniem i ochroną przed usunięciem spełnia tę samą rolę.",
            ],
          },
          {
            heading: "Krok, który prawie wszyscy pomijają: test odtwarzania",
            paragraphs: [
              "Kopia zapasowa staje się kopią zapasową dopiero wtedy, gdy odtwarzanie zadziałało w praktyce. Co najmniej raz na kwartał przywróć kilka przykładowych plików, a raz w roku przeprowadź pełny scenariusz odzyskiwania: Ile to trwa? Czy czegoś brakuje? Czy procedurę zna ktoś więcej niż jedna osoba?",
            ],
          },
          {
            heading: "Konkretna konfiguracja dla małej firmy",
            paragraphs: [
              "Sprawdzony układ: dane robocze na serwerze lub w Microsoft 365. NAS w biurze codziennie automatycznie pobiera kopie. Dodatkowo działa szyfrowany backup w chmurze z wersjonowaniem u europejskiego dostawcy. Kluczowe systemy zapisywane są jako pełne obrazy, aby w razie awarii dało się odtworzyć całe maszyny, a nie tylko pliki.",
            ],
          },
        ],
        outro:
          "Backup to nie produkt kupowany raz, lecz proces z jasnymi odpowiedzialnościami. Konfiguruję kopie 3-2-1 dla MŚP — wraz z automatyzacją, monitoringiem i udokumentowanym planem odtwarzania.",
      },
    },
  },
  {
    slug: "phishing-erkennen",
    date: "2026-07-12",
    readingMinutes: 5,
    content: {
      de: {
        title: "Phishing erkennen: Der Praxis-Leitfaden für Ihr Team",
        description:
          "Über 90 % der Angriffe beginnen mit einer E-Mail. So erkennen Sie und Ihr Team Phishing-Versuche — inklusive Checkliste für den Verdachtsfall.",
        intro:
          "Die meisten erfolgreichen Angriffe auf kleine Unternehmen beginnen nicht mit einem Hacker vor einem schwarzen Bildschirm, sondern mit einer harmlos aussehenden E-Mail. Als Betreuer eines Falls nach einem erfolgreichen Angriff habe ich gesehen, was ein einziger Klick kosten kann. Dieser Leitfaden macht Ihr Team zur ersten Verteidigungslinie.",
        sections: [
          {
            heading: "Die typischen Warnsignale",
            bullets: [
              "Zeitdruck und Drohung: 'Ihr Konto wird in 24 Stunden gesperrt.'",
              "Absenderadresse, die nur fast stimmt: rechnung@paypa1.com statt paypal.com.",
              "Unerwartete Anhänge — besonders ZIP-, ISO- oder Office-Dateien mit Makros.",
              "Links, deren Ziel nicht zum angezeigten Text passt (vor dem Klick: Mauszeiger darüber halten).",
              "Ungewöhnliche Bitten vom 'Chef': Gutscheinkarten kaufen, dringende Überweisung, neue Kontonummer.",
            ],
          },
          {
            heading: "Warum moderne Phishing-Mails so gut sind",
            paragraphs: [
              "Rechtschreibfehler als Erkennungszeichen sind Vergangenheit. Aktuelle Kampagnen nutzen fehlerfreie Sprache, echte Logos und Informationen aus sozialen Netzwerken oder früheren Datenlecks. Auch QR-Codes in E-Mails und SMS ('Ihr Paket wartet') gehören inzwischen dazu. Entscheidend ist deshalb nicht das Bauchgefühl 'sieht echt aus', sondern der nüchterne Blick auf Absender, Link und Kontext.",
            ],
          },
          {
            heading: "Checkliste für den Verdachtsfall",
            bullets: [
              "Nicht klicken, nichts herunterladen, nicht antworten.",
              "Absender über einen zweiten Kanal verifizieren — Telefonnummer aus dem Adressbuch, nicht aus der E-Mail.",
              "Die E-Mail intern melden, damit Kolleginnen und Kollegen gewarnt sind.",
              "Falls doch geklickt wurde: sofort Passwort ändern, IT informieren, Gerät vom Netz nehmen. Schnelles Melden begrenzt den Schaden — Schuldzuweisungen führen nur dazu, dass der nächste Vorfall verschwiegen wird.",
            ],
          },
          {
            heading: "Technische Schutzmaßnahmen dahinter",
            paragraphs: [
              "Awareness ist die erste Linie, Technik die zweite: Zwei-Faktor-Authentifizierung macht gestohlene Passwörter weitgehend nutzlos, SPF/DKIM/DMARC erschweren gefälschte Absender, moderne Mail-Filter und aktuelle Browser fangen viele Kampagnen ab. Zusammen ergibt das ein System, in dem ein einzelner Fehlklick nicht mehr zur Katastrophe führt.",
            ],
          },
        ],
        outro:
          "Phishing-Resistenz entsteht durch Routine: kurze Schulungen, klare Meldewege und die passende technische Absicherung. Ich biete beides — Awareness-Schulungen für Teams und die technische Härtung Ihrer E-Mail-Umgebung.",
      },
      en: {
        title: "Spotting Phishing: A Practical Guide for Your Team",
        description:
          "Over 90% of attacks start with an email. Here's how you and your team recognize phishing attempts — including a checklist for suspicious cases.",
        intro:
          "Most successful attacks on small businesses don't start with a hacker in front of a black screen — they start with a harmless-looking email. Having handled the aftermath of a successful attack, I've seen what a single click can cost. This guide turns your team into the first line of defense.",
        sections: [
          {
            heading: "The typical warning signs",
            bullets: [
              "Time pressure and threats: 'Your account will be locked in 24 hours.'",
              "Sender addresses that are only almost right: billing@paypa1.com instead of paypal.com.",
              "Unexpected attachments — especially ZIP, ISO or Office files with macros.",
              "Links whose target doesn't match the displayed text (hover before you click).",
              "Unusual requests from 'the boss': buy gift cards, urgent transfer, new bank details.",
            ],
          },
          {
            heading: "Why modern phishing emails are so convincing",
            paragraphs: [
              "Spelling mistakes as a tell are history. Current campaigns use flawless language, real logos and information from social networks or past data leaks. QR codes in emails and text messages ('your parcel is waiting') are now part of the toolkit too. So the deciding factor is not a gut feeling of 'looks legitimate' but a sober look at sender, link and context.",
            ],
          },
          {
            heading: "Checklist for a suspicious message",
            bullets: [
              "Don't click, don't download, don't reply.",
              "Verify the sender through a second channel — a phone number from your address book, not from the email.",
              "Report the email internally so colleagues are warned.",
              "If someone did click: change the password immediately, inform IT, disconnect the device. Fast reporting limits the damage — blame only ensures the next incident stays hidden.",
            ],
          },
          {
            heading: "The technical safety net behind it",
            paragraphs: [
              "Awareness is the first line, technology the second: two-factor authentication makes stolen passwords largely useless, SPF/DKIM/DMARC make sender spoofing harder, and modern mail filters plus up-to-date browsers catch many campaigns. Together this creates a system where a single wrong click no longer turns into a disaster.",
            ],
          },
        ],
        outro:
          "Phishing resistance comes from routine: short trainings, clear reporting paths and the right technical hardening. I offer both — awareness training for teams and hardening of your email environment.",
      },
      pl: {
        title: "Jak rozpoznać phishing: praktyczny przewodnik dla Twojego zespołu",
        description:
          "Ponad 90% ataków zaczyna się od e-maila. Oto jak Ty i Twój zespół rozpoznacie próby phishingu — z checklistą na wypadek podejrzenia.",
        intro:
          "Większość udanych ataków na małe firmy nie zaczyna się od hakera przed czarnym ekranem, lecz od niewinnie wyglądającego e-maila. Obsługując skutki udanego ataku, widziałem, ile może kosztować jedno kliknięcie. Ten przewodnik czyni Twój zespół pierwszą linią obrony.",
        sections: [
          {
            heading: "Typowe sygnały ostrzegawcze",
            bullets: [
              "Presja czasu i groźby: 'Twoje konto zostanie zablokowane w ciągu 24 godzin.'",
              "Adres nadawcy, który zgadza się tylko prawie: faktura@paypa1.com zamiast paypal.com.",
              "Nieoczekiwane załączniki — zwłaszcza pliki ZIP, ISO lub dokumenty Office z makrami.",
              "Linki, których cel nie pasuje do wyświetlanego tekstu (najedź kursorem przed kliknięciem).",
              "Nietypowe prośby od 'szefa': kup karty podarunkowe, pilny przelew, nowy numer konta.",
            ],
          },
          {
            heading: "Dlaczego współczesny phishing jest tak przekonujący",
            paragraphs: [
              "Błędy ortograficzne jako znak rozpoznawczy to przeszłość. Obecne kampanie używają nienagannego języka, prawdziwych logotypów i informacji z sieci społecznościowych lub wcześniejszych wycieków danych. Do zestawu narzędzi należą też kody QR w e-mailach i SMS-ach ('Twoja paczka czeka'). Decyduje więc nie przeczucie 'wygląda prawdziwie', lecz trzeźwe spojrzenie na nadawcę, link i kontekst.",
            ],
          },
          {
            heading: "Checklista na wypadek podejrzanej wiadomości",
            bullets: [
              "Nie klikaj, nie pobieraj, nie odpowiadaj.",
              "Zweryfikuj nadawcę drugim kanałem — numer telefonu z książki adresowej, nie z e-maila.",
              "Zgłoś wiadomość wewnętrznie, aby ostrzec współpracowników.",
              "Jeśli ktoś jednak kliknął: natychmiast zmień hasło, poinformuj IT, odłącz urządzenie od sieci. Szybkie zgłoszenie ogranicza szkody — obwinianie sprawia tylko, że następny incydent zostanie przemilczany.",
            ],
          },
          {
            heading: "Techniczna siatka bezpieczeństwa w tle",
            paragraphs: [
              "Świadomość to pierwsza linia, technologia druga: uwierzytelnianie dwuskładnikowe czyni skradzione hasła w dużej mierze bezużytecznymi, SPF/DKIM/DMARC utrudniają podszywanie się pod nadawcę, a nowoczesne filtry poczty i aktualne przeglądarki wychwytują wiele kampanii. Razem tworzy to system, w którym pojedyncze błędne kliknięcie nie kończy się już katastrofą.",
            ],
          },
        ],
        outro:
          "Odporność na phishing bierze się z rutyny: krótkich szkoleń, jasnych ścieżek zgłaszania i odpowiedniego zabezpieczenia technicznego. Oferuję jedno i drugie — szkolenia dla zespołów oraz techniczne wzmocnienie środowiska e-mail.",
      },
    },
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}
