'use client'

import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Your message has been sent! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Contact Us
      </h1>
      
      <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
        Have questions or feedback? We'd love to hear from you. Fill out the form below 
        or use one of our contact methods.
      </p>

      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="lg:w-1/3">
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <FaEnvelope className="h-6 w-6 text-primary mt-1 mr-4" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">info@mshikotap.com</p>
                  <p className="text-gray-600">support@mshikotap.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaPhone className="h-6 w-6 text-primary mt-1 mr-4" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">Monday-Friday, 9am-5pm</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaMapMarkerAlt className="h-6 w-6 text-primary mt-1 mr-4" />
                <div>
                  <h3 className="font-medium">Office</h3>
                  <p className="text-gray-600">123 Business Avenue</p>
                  <p className="text-gray-600">Tech City, TC 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input-field mt-1 w-full"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input-field mt-1 w-full"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="input-field mt-1 w-full"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="payment">Payment Issue</option>
                  <option value="task">Task Problem</option>
                  <option value="suggestion">Suggestion</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="input-field mt-1 w-full"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="btn-primary w-full md:w-auto"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 