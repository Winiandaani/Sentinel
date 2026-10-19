import { Orbitron, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

// Load the three fonts from Google Fonts
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// The browser tab title and description
export const metadata = {
  title: "Sentinel — AI Content Detector",
  description: "Detect AI-generated videos, photos and text.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${jetbrains.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}