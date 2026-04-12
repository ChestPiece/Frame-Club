import type { Metadata } from "next";
import { Bebas_Neue, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { GSAPProvider } from "@/components/providers/gsap-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-technical",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "The Frame Club",
  description: "Where Speed Meets Art",
  icons: {
    icon: "/FrameClub.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable, bebasNeue.variable, spaceGrotesk.variable, "font-sans")}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <GSAPProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </GSAPProvider>
      </body>
    </html>
  );
}
