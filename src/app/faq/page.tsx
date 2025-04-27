'use client'

import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function FAQPage() {
  const faqs = [
    {
      question: "What is MshikoTap?",
      answer: "MshikoTap is a platform where users can complete simple tasks like watching videos, following social media accounts, filling surveys, or visiting websites to earn money."
    },
    {
      question: "How much can I earn on MshikoTap?",
      answer: "Earnings vary based on the tasks you complete. Simple tasks may pay $0.10-$1.00, while more complex tasks like surveys can pay $1-$5 depending on length and requirements."
    },
    {
      question: "How do I get paid?",
      answer: "When you complete tasks, the reward amount is added to your MshikoTap wallet. You can request a withdrawal to your mobile money account once you reach the minimum threshold of $5."
    },
    {
      question: "How long does it take to receive payment?",
      answer: "Withdrawals are typically processed within 24 hours after admin approval. Most users receive their payments within a few hours of approval."
    },
    {
      question: "Is MshikoTap available worldwide?",
      answer: "Yes, MshikoTap is available globally. However, some tasks might be region-specific, and payment methods may vary by country."
    },
    {
      question: "How does the referral system work?",
      answer: "You can earn additional rewards by inviting friends to join MshikoTap. When someone signs up using your referral code and completes tasks, you'll receive bonus rewards."
    },
    {
      question: "Is there a minimum withdrawal amount?",
      answer: "Yes, the minimum withdrawal amount is $5. This helps us keep processing fees reasonable."
    },
    {
      question: "What payment methods do you support?",
      answer: "We currently support mobile money as our primary payment method. Additional payment options may be added in the future."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team by emailing support@mshikotap.com or through the contact form on our website."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>
      
      <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
        Find answers to common questions about MshikoTap. If you can't find what you're looking for, 
        please contact our support team.
      </p>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border-b border-gray-200 py-4"
          >
            <button 
              className="flex w-full items-center justify-between text-left font-medium text-gray-900 focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <FaChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <FaChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="mt-2 text-gray-600">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <a href="/contact" className="btn-primary inline-block">
          Contact Us
        </a>
      </div>
    </div>
  )
} 