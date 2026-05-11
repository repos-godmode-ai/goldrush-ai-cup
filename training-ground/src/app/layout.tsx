import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Training Ground — GoldRush Showcase",
  description:
    "Football-themed live portfolio demo: GoldRush Foundational balances, portfolio curve, transaction summary, and token approvals.",
  openGraph: {
    title: "Training Ground — GoldRush Showcase",
    description:
      "Live on-chain squad view powered by GoldRush Foundational API — pitch, roster, charts, approvals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-[family-name:var(--font-body)] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
