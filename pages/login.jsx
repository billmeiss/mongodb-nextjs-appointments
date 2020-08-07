import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCurrentUser } from '../lib/hooks';

const LoginPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [user, { mutate }] = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.replace('/');
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg('Incorrect username or password. Try again!');
    }
    setIsUpdating(false);
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className="flex items-center flex-row lg:flex-col min-w-screen w-full lg:max-w-full lg:flex pt-4">
        <form onSubmit={onSubmit} className="bg-white shadow-lg rounded mb-8">
          <div className="w-full rounded border-t-4 border-purple-400 bg-purple-100">
            <h1 className="block text-purple-800 px-8 pt-4 pb-4 text-lg font-bold mb-2">Sign In</h1>
          </div>
          <div className="px-4 lg:px-8 pt-6 pb-8">
            {errorMsg ? <p className="text-red-500 text-xs italic">{errorMsg}</p> : null}
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
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
                <input
                  className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="******************"
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col md:flex-row lg:flex-row sm:flex-row items-center justify-between bg-gray-100 px-8 pt-4 pb-4 rounded shadow">
            {isUpdating 
              ?
              <button type="submit" className="shadow opacity-50 cursor-not-allowed bg-purple-200 hover:bg-purple-300 text-purple-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Log In
              </button>
              :
              <button type="submit" className="shadow bg-purple-200 hover:bg-purple-300 text-purple-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Log In
              </button>
            }
              <Link href="/forgot-password">
                <a className="text-shadow inline-block mt-4 sm:mt-0 md:mt-0 lg:mt-0 align-baseline font-bold text-sm text-purple-500 hover:text-purple-800">
                  Forgot Password?
                </a>
              </Link>
            </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;