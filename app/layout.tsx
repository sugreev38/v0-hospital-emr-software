import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { RegisterServiceWorker } from "@/app/register-sw"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MediTrack EMR - Hospital Management System",
  description: "A comprehensive hospital management EMR system with offline capabilities",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <RegisterServiceWorker />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
