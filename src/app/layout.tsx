import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/layout/ClientShell";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAGmagdeburg — Healthcare & Population Intelligence",
  description:
    "How demographic changes are affecting healthcare demand in Magdeburg. An editorial data story built on KISS-MD open data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${newsreader.variable} ${ibmPlex.variable}`}>
      <body>
        <LocaleProvider>
          <ClientShell />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
