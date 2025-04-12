import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import Link from "next/link";
import { PageProvider, usePageContext } from "@/components/context";
import OptionsMenu from "@/components/elements/Settings";

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
          <ApolloWrapper>
            <PageProvider>
              <header className="px-2 md:px-0 w-full flex flex-row justify-center items-center gap-2 text-xs text-slate-400 text-center bg-gray-900 py-2">
                <div className="m-auto w-full max-w-lg flex flex-row justify-between lg:flex-row lg:justify-between lg:max-w-screen-lg ">
                  <div className="flex flex-row gap-4 items-center">
                    <Link href={"/"} className="hover:text-sky-400">
                      AnimeDle
                    </Link>
                    <Link href={"/chara-anime"} className="hover:text-sky-400">
                      CharaAnime
                    </Link>
                    <Link href={"/aniquiz"} className="hover:text-sky-400">
                      AniQuiz
                    </Link>
                    <Link href={"/anime-cover"} className="hover:text-sky-400">
                      AniCover
                    </Link>
                  </div>
                  <div>
                    <OptionsMenu />
                  </div>
                </div>
              </header>
              <div className="max-w-screen-lg px-4 m-auto py-5 flex flex-col"
                style={{
                  minHeight: "calc(100dvh - 32px)",
                }}
              >
                {children}
              </div>
              <footer className="w-full flex flex-row justify-center items-center gap-2 text-xs text-slate-100 text-center bg-gray-900 py-1">
                <div className="m-auto w-full max-w-lg flex flex-col lg:flex-row lg:justify-between lg:max-w-screen-lg items-center">
                  <span>Desarrollado por: Kkuuhaku</span>
                  <span>Versión: 1.3.5</span>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-right ">
                      Contiene datos de la lista de{" "}
                      <a
                        className="text-slate-400 hover:text-sky-500"
                        href="https://anilist.co/user/DoubleCReacts/animelist"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        DoubleCReacts
                      </a>
                    </span>
                    <span className="text-right">
                      Datos obtenidos usando:{" "}
                      <a
                        href="https://docs.anilist.co/"
                        className="text-slate-400 hover:text-sky-500"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        AniList API
                      </a>{" "}
                      y{" "}
                      <a
                        href="https://docs.api.jikan.moe/"
                        className="text-slate-400 hover:text-sky-500"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Jikan API
                      </a>
                    </span>
                  </div>
                </div>
              </footer>
            </PageProvider>
          </ApolloWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}

