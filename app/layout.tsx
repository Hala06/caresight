// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Hackathon App",
  description: "Built with Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        
        {children}
      </body>
    </html>
  );
}
