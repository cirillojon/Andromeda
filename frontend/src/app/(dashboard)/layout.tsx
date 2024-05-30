import type { Metadata } from "next";
import "../globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "andromeda",
  description: "",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={roboto.className}>
      <body>
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
