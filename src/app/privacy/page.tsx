import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Privacy Policy
      </h1>
      
      <div className="max-w-4xl mx-auto prose prose-lg">
        <p>
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2>1. Introduction</h2>
        <p>
          At MshikoTap, we respect your privacy and are committed to protecting your personal data.
          This Privacy Policy will inform you about how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.
        </p>
        
        <h2>2. Information We Collect</h2>
        <p>
          We may collect, use, store, and transfer different kinds of personal data about you, including:
        </p>
        <ul>
          <li>Identity Data: includes first name, last name, username</li>
          <li>Contact Data: includes email address and telephone numbers</li>
          <li>Financial Data: includes payment information and transaction history</li>
          <li>Technical Data: includes IP address, browser type and version, location</li>
          <li>Usage Data: includes information about how you use our website and services</li>
        </ul>
        
        <h2>3. How We Use Your Information</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul>
          <li>To register you as a new user</li>
          <li>To process and deliver rewards</li>
          <li>To manage our relationship with you</li>
          <li>To improve our website, services, and user experience</li>
          <li>To administer and protect our business and website</li>
          <li>To deliver relevant content and advertisements to you</li>
        </ul>
        
        <h2>4. Data Security</h2>
        <p>
          We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, 
          or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, and contractors 
          who have a business need to know.
        </p>
        
        <h2>5. Data Retention</h2>
        <p>
          We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
          including for the purposes of satisfying any legal, accounting, or reporting requirements.
        </p>
        
        <h2>6. Your Legal Rights</h2>
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
        </p>
        <ul>
          <li>Request access to your personal data</li>
          <li>Request correction of your personal data</li>
          <li>Request erasure of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Request restriction of processing your personal data</li>
          <li>Request transfer of your personal data</li>
          <li>Right to withdraw consent</li>
        </ul>
        
        <h2>7. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
        
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@mshikotap.com.
        </p>
      </div>
    </div>
  )
} 