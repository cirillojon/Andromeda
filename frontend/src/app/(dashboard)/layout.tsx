import type { Metadata } from "next";
import "../globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Libre_Franklin } from "next/font/google";
import { Rubik } from "next/font/google";
import "./styles.css";
import DashboardNavBar from "@/components/Dashboard/DashboardNavBar";
import CustomerSupportChat from "@/components/Dashboard/Support/CustomerSupportChat";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});
const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});
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
    <html lang="en" className="fixed w-screen h-screen">
      <body className={libre_franklin.variable + " " + rubik.variable}>
        <DashboardNavBar/>
        <main>{children}</main>
        <CustomerSupportChat/>
        <Toaster richColors />
      </body>
    </html>
  );
}
