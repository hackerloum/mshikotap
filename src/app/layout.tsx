import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Navbar, Footer } from '../components/layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MshikoTap - Earn As You Tap',
  description: 'Complete tasks and earn money instantly with MshikoTap',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  )
} 