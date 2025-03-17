import React from 'react';

const SupportScreen = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">Support</h1>
        </div>
      </header>
      
      <main className="flex-grow max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="font-medium text-gray-700 md:w-32">Email:</div>
              <a href="mailto:shawket.4@icloud.com" className="text-blue-600 hover:text-blue-800">
                shawket.4@icloud.com
              </a>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="font-medium text-gray-700 md:w-32">Phone:</div>
              <a href="tel:+201061856523" className="text-blue-600 hover:text-blue-800">
                +201061856523
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800">How do I reset my password?</h3>
              <p className="text-gray-600 mt-1">
                You can reset your password by tapping on "Forgot Password" on the login screen and following the instructions sent to your email.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">How do I update my account information?</h3>
              <p className="text-gray-600 mt-1">
                Go to Settings {'>'} Account {'>'} Personal Information to update your account details.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">How do I cancel my subscription?</h3>
              <p className="text-gray-600 mt-1">
                To cancel your subscription, please go to your Apple ID settings in the App Store, select Subscriptions, find our app, and tap Cancel Subscription.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 App Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SupportScreen;