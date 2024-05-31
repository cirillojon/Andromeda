import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Onboarding/Navbar/Navbar";
import Footer from "@/components/Onboarding/Footer/Footer";
import { Roboto } from "next/font/google"
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: "andromeda",
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
        <main className="md:-mt-16">
          {children}
        </main>
        <Toaster richColors/>
        <Footer/>
      </body>
    </html>
  );
}
