import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Onboarding/Navbar/Navbar";
import { Roboto } from "next/font/google"
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: "andromeda",
  description: "",
  verification: { google: "lu8WIOtJxUBccG-EoS8dRiQSBv6nxM2P6O55MzlZYvM" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <meta name="google-site-verification" content="lu8WIOtJxUBccG-EoS8dRiQSBv6nxM2P6O55MzlZYvM" />
      <body>
        <main>
          {children}
        </main>
        <Toaster richColors/>
      </body>
    </html>
  );
}
