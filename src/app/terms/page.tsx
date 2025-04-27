import React from 'react'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Terms of Service
      </h1>
      
      <div className="max-w-4xl mx-auto prose prose-lg">
        <p>
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to MshikoTap! These Terms of Service govern your use of our website and services.
          By accessing or using MshikoTap, you agree to be bound by these Terms. Please read them carefully.
        </p>
        
        <h2>2. Definitions</h2>
        <p>
          "Platform" refers to the MshikoTap website and services.
          "User", "You", and "Your" refers to you, the person accessing this platform and accepting these terms.
          "Company", "We", "Us", and "Our" refers to MshikoTap.
          "Service" refers to the task completion and reward system offered through the Platform.
        </p>
        
        <h2>3. Account Registration</h2>
        <p>
          You must register for an account to access certain features of the Platform.
          You agree to provide accurate and complete information when creating your account.
          You are responsible for maintaining the security of your account credentials.
          You may not share your account with others.
        </p>
        
        <h2>4. Task Completion and Rewards</h2>
        <p>
          Users may earn rewards by completing tasks on the Platform.
          All tasks must be completed according to the provided instructions.
          Rewards will be credited to your account upon successful verification of task completion.
          We reserve the right to decline rewards for incomplete or fraudulent task completions.
        </p>
        
        <h2>5. Withdrawals</h2>
        <p>
          Rewards earned can be withdrawn according to our withdrawal policy.
          The minimum withdrawal amount is $5.
          Withdrawals are subject to review and approval.
          Withdrawals are typically processed within 24 hours of approval.
        </p>
        
        <h2>6. Prohibited Activities</h2>
        <p>
          Users may not engage in any of the following activities:
          - Using automated systems to complete tasks
          - Creating multiple accounts
          - Providing false information for task completion
          - Attempting to manipulate or abuse the reward system
          - Any other activity that violates these Terms or applicable law
        </p>
        
        <h2>7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account for violation of these Terms.
          Upon termination, your right to use the Platform will immediately cease.
          All provisions of these Terms which by their nature should survive termination shall survive.
        </p>
        
        <h2>8. Changes to Terms</h2>
        <p>
          We may revise these Terms at any time. By continuing to use the Platform after changes become effective, you agree to be bound by the revised Terms.
        </p>
        
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@mshikotap.com.
        </p>
      </div>
    </div>
  )
} 