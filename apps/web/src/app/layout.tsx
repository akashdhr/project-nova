import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/config/brand";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <body className={`font-sans antialiased min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
