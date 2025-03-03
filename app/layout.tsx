import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { UtensilsCrossed } from "lucide-react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pantry to Plate - AI Recipe Suggestions",
  description: "Get AI-powered recipe suggestions based on ingredients you have at home",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-green-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <UtensilsCrossed className="w-6 h-6 mr-2" />
              Pantry to Plate
            </Link>
            <div className="flex space-x-4">
              <Link href="/" className="hover:text-green-200 transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-green-200 transition-colors">
                About
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

