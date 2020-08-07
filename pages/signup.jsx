import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { useCurrentUser } from '../lib/hooks';

const SignupPage = () => {
  const [user, { mutate }] = useCurrentUser();
  const [errorMsg, setErrorMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // call when user is authenticated
  useEffect(() => {
    // redirect to home
    if (user) Router.replace('/');
  }, [user]);

  const handleSubmit = async (e) => {
    console.log(isUpdating);
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value
    };
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.status === 201) {
      const userObj = await res.json();
      // passing user obj to state
      mutate(userObj);
    } else {
      setErrorMsg(await res.text());
    }
    setIsUpdating(false);
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <div className="flex items-center flex-row md:flex-col lg:flex-col max-w-screen lg:max-w-full pt-4">
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded mb-8">
          {errorMsg ? <p className="px-8 pt-6 pb-8 mb-2 text-red-500 text-xs italic">{errorMsg}</p> : null}
          <div className="w-full rounded border-t-4 border-green-400 bg-green-100">
            <h1 className="block text-green-800 px-8 pt-4 pb-4 text-lg font-bold mb-2">Sign up</h1>
          </div>
          <div className="px-4 w-full lg:px-8 pt-6 pb-8">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                Full Name
                <input
                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email
                <input
                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email address"
                />
              </label>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold" htmlFor="password">
                Password
                <input
                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="******************"
                />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-100 px-8 pt-4 pb-4 rounded shadow">
            {isUpdating
              ?
              <button className="opacity-50 cursor-not-allowed bg-green-200 hover:bg-green-300 text-green-700 font-bold py-2 px-4 rounded focus:outline-none focus:bg-white focus:border-green-500" type="submit">
              Join
              </button>
              :
              <button className="bg-green-200 hover:bg-green-300 text-green-700 font-bold py-2 px-4 rounded focus:outline-none focus:bg-white focus:border-green-500" type="submit">
              Join
              </button>
            }
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupPage;