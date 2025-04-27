import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Link from 'next/link';
import { FaYoutube, FaTiktok, FaInstagram, FaClipboardList, FaGlobe, FaMobileAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero section */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Complete Tasks, Earn Real Money
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Mshiko Tap makes it easy to earn money by completing simple online tasks 
            like watching videos, taking surveys, and testing websites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/how-it-works" className="btn-secondary text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Task types section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ways to Earn</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center p-8">
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaYoutube className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Watch YouTube Videos</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get paid to watch YouTube videos and provide feedback or engagement.
              </p>
            </div>
            
            <div className="card text-center p-8">
              <div className="bg-black bg-opacity-10 dark:bg-opacity-30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaTiktok className="h-8 w-8 text-black dark:text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">TikTok Tasks</h3>
              <p className="text-gray-600 dark:text-gray-300">
                View TikTok content and earn money for your time and engagement.
              </p>
            </div>
            
            <div className="card text-center p-8">
              <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaInstagram className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instagram Tasks</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Interact with Instagram content and get paid for your time.
              </p>
            </div>
            
            <div className="card text-center p-8">
              <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaClipboardList className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Take Surveys</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your opinion through surveys and get rewarded for your feedback.
              </p>
            </div>
            
            <div className="card text-center p-8">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Website Visits</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visit websites, explore content, and earn money for your time.
              </p>
            </div>
            
            <div className="card text-center p-8">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaMobileAlt className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Test Apps</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try out new apps and provide feedback to earn rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up for free and complete your profile to start earning.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Tasks</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose from a variety of tasks that match your interests.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Withdraw your earnings through multiple payment methods.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              Start Earning Now
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 