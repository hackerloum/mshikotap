import React from 'react'

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Cookie Policy
      </h1>
      
      <div className="max-w-4xl mx-auto prose prose-lg">
        <p>
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small pieces of text sent to your web browser by a website you visit. 
          A cookie file is stored in your web browser and allows the Service or a third-party to 
          recognize you and make your next visit easier and the Service more useful to you.
        </p>
        
        <h2>2. How We Use Cookies</h2>
        <p>
          When you use and access the Service, we may place a number of cookie files in your web browser.
          We use cookies for the following purposes:
        </p>
        <ul>
          <li>To enable certain functions of the Service</li>
          <li>To provide analytics</li>
          <li>To store your preferences</li>
          <li>To enable advertisements delivery, including behavioral advertising</li>
        </ul>
        <p>
          We use both session and persistent cookies on the Service and we use different 
          types of cookies to run the Service:
        </p>
        <ul>
          <li>
            <strong>Essential cookies.</strong> We may use essential cookies to authenticate users and prevent fraudulent 
            use of user accounts.
          </li>
          <li>
            <strong>Preferences cookies.</strong> We may use preferences cookies to remember information that changes the 
            way the Service behaves or looks, such as the "remember me" functionality.
          </li>
          <li>
            <strong>Analytics cookies.</strong> We may use analytics cookies to track information how the 
            Service is used so that we can make improvements.
          </li>
          <li>
            <strong>Advertising cookies.</strong> These cookies collect information about your visit to our website, 
            the content you viewed, the links you followed and information about your browser, device, and IP address.
          </li>
        </ul>
        
        <h2>3. Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-party cookies to report usage 
          statistics of the Service, deliver advertisements on and through the Service, and so on.
        </p>
        
        <h2>4. What Are Your Choices Regarding Cookies</h2>
        <p>
          If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, 
          please visit the help pages of your web browser.
        </p>
        <p>
          Please note, however, that if you delete cookies or refuse to accept them, you might not be able to 
          use all of the features we offer, you may not be able to store your preferences, and some of our 
          pages might not display properly.
        </p>
        
        <h2>5. Where Can You Find More Information About Cookies</h2>
        <p>
          You can learn more about cookies at the following third-party websites:
        </p>
        <ul>
          <li>
            <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">
              AllAboutCookies
            </a>
          </li>
          <li>
            <a href="https://www.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
              Network Advertising Initiative
            </a>
          </li>
        </ul>
        
        <h2>6. Changes to This Cookie Policy</h2>
        <p>
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting 
          the new Cookie Policy on this page.
        </p>
        
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about our Cookie Policy, please contact us at cookies@mshikotap.com.
        </p>
      </div>
    </div>
  )
} 