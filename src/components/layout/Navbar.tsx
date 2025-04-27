'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaUser } from 'react-icons/fa'

export default function Navbar() {
  const pathname = usePathname()
  
  // Only show simple navbar on dashboard pages since dashboard has its own navigation
  const isDashboard = pathname?.startsWith('/dashboard')
  
  if (isDashboard) {
    return (
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              MshikoTap
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              MshikoTap
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <Link 
                  href="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/' 
                      ? 'text-primary bg-gray-50' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/how-it-works" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/how-it-works' 
                      ? 'text-primary bg-gray-50' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  How It Works
                </Link>
                <Link 
                  href="/faq" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/faq' 
                      ? 'text-primary bg-gray-50' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/login" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/auth/login' 
                  ? 'text-primary bg-gray-50' 
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Login
            </Link>
            <Link 
              href="/auth/signup" 
              className="btn-primary flex items-center"
            >
              <FaUser className="mr-2" /> Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 