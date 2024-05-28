import type { Metadata } from "next";
import "../globals.css";
import { Roboto } from "@next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

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
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();

  if (!isLoggedIn) redirect("/");

  return (
    <html lang="en" className={roboto.className}>
      <body>
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
