import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Roboto } from "@next/font/google"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: "romeo",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <Navbar/>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
