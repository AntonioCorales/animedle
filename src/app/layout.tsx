import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AnimeDle",
  description: "Adivina el anime a partir de las diferentes pistas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ApolloWrapper>{children}</ApolloWrapper>
        </QueryProvider>
        <footer className="w-full flex flex-row justify-center items-center gap-2 text-xs text-slate-400 text-center bg-gray-900">
          <div className="m-auto w-full  max-w-lg flex flex-col lg:flex-row lg:justify-between lg:max-w-2xl">
            <span>Desarrollado por: Kkuuhaku</span>
            <span>Versión: 1.0.0</span>
            <span>
              Contiene datos de:{" "}
              <a
                href="https://anilist.co/"
                className="hover:text-sky-500"
                target="_blank"
                rel="noreferrer noopener"
              >
                AniList API
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
