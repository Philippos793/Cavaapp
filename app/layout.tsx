import "./globals.css"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Cavaapp",
  description: "Smart bar inventory management for restaurants and bars",
  applicationName: "Cavaapp",
  authors: [{ name: "Cavaapp" }],
  keywords: [
    "bar inventory",
    "restaurant inventory",
    "cava management",
    "bar stock system",
    "restaurant software",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0f172a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="el">
      <body className="bg-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}