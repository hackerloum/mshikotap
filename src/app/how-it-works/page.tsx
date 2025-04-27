import React from 'react'
import { FaMoneyBillWave, FaTasks, FaUserPlus, FaWallet } from 'react-icons/fa'

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Sign Up",
      description: "Create your free account with email or phone number.",
      icon: <FaUserPlus className="h-10 w-10" />
    },
    {
      title: "Complete Tasks",
      description: "Browse available tasks and complete them to earn rewards.",
      icon: <FaTasks className="h-10 w-10" />
    },
    {
      title: "Earn Money",
      description: "Get instant rewards added to your wallet after task completion.",
      icon: <FaMoneyBillWave className="h-10 w-10" />
    },
    {
      title: "Withdraw",
      description: "Request payouts to your mobile money account within 24 hours.",
      icon: <FaWallet className="h-10 w-10" />
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        How MshikoTap Works
      </h1>
      
      <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
        MshikoTap makes it easy to earn money by completing simple tasks online. 
        Here's how you can start earning with just a few taps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {steps.map((step, index) => (
          <div key={index} className="card flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Task Types</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold mb-2">Watch Videos</h3>
            <p className="text-gray-600">Watch promotional videos, ads, or tutorials to earn rewards.</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold mb-2">Follow Social Media Accounts</h3>
            <p className="text-gray-600">Follow brands and creators on social media platforms to earn rewards.</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold mb-2">Fill Surveys</h3>
            <p className="text-gray-600">Complete surveys and share your opinions to earn rewards.</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold mb-2">Visit Websites</h3>
            <p className="text-gray-600">Visit and interact with websites to earn rewards.</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Earning?</h2>
        <a href="/auth/signup" className="btn-primary inline-block">
          Create Your Account
        </a>
      </div>
    </div>
  )
} 