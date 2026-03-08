import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meraki Admin Dashboard",
  description: "Admin dashboard for Meraki Restaurant backend"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}

