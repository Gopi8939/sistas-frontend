import React from 'react';
import Layout from '../src/components/Partials/Layout';

const ThankYouPage = () => {
  return (
    <Layout>
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white p-8 shadow-md rounded-md h-full w-full max-w-4xl flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-4">Thank you!</h1>
          <p className="text-gray-600 mb-8">
            We've received your request. We will contact you in the next 48-72 hours.
          </p>
        </div>
        <img
          src="/assets/images/thankyou.png"
          alt="Thank you"
          className="w-60 ml-8 hidden md:block"
        />
      </div>
    </div>
    </Layout>
  );
};

export default ThankYouPage;