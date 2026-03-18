import "./globals.css"
import type { Metadata } from "next"

export const metadata = {
  title: "Cavaapp",
  description: "Smart bar inventory management",
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}