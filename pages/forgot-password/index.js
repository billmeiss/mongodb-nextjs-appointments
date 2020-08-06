import React, { useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';

const ForgetPasswordPage = () => {
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(e);
    
    setIsUpdating(true);

    const body = {
      email: e.currentTarget.email.value
    };

    const res = await fetch('/api/user/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    setIsUpdating(false);

    if (res.status === 200) Router.replace('/');

  };

  return (
    <>
      <Head>
        <title>Password Reset</title>
      </Head>
      <div className="flex items-center flex-col max-w-sm w-full lg:max-w-full lg:flex pt-4">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded mb-8">
          <div className="w-full rounded border-t-4 border-purple-400 bg-purple-100">
              <h1 className="block text-purple-800 px-8 pt-4 text-lg font-bold">Forgot your password?</h1>
              <p className="block text-purple-800 px-8 pt-4 pb-4 text-md font-semibold mb-2">No Stress. Enter your email below</p>
            </div>
            <div className="px-8 pt-6 pb-8">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                  Email
                  <input
                    className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email address"
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-100 px-8 pt-4 pb-4 rounded shadow">
              {isUpdating 
                ?
                <button type="submit" className="shadow opacity-50 cursor-not-allowed bg-purple-200 hover:bg-purple-300 text-purple-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Send
                </button>
                :
                <button type="submit" className="shadow bg-purple-200 hover:bg-purple-300 text-purple-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Send
                </button>
              }
              </div>
        </form>
      </div>
    </>
  );
};

export default ForgetPasswordPage;