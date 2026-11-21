import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";
import UserProvider from "@/app/context/userContext";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobSmart | Find your next opportunity",
  description:
    "Discover roles that fit your skills and take your career forward.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <QueryProvider>
              <UserProvider>
                {children}
                <Toaster />
              </UserProvider>
            </QueryProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}

