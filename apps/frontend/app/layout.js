import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Drop - Employee Management System",
  description: "A comprehensive employee management system",
};

import { Toaster } from "../components/ui/toaster";
import { Toaster as SonnerToaster } from "../components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
