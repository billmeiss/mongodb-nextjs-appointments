import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCurrentUser } from '../lib/hooks';

export default ({ children }) => {
  const [user, { mutate }] = useCurrentUser();
  const [drop, setDrop] = useState(false);
  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE'
    });
    mutate(null);
  };
  return (
    <>
    <Head>
      <title>Next.js + MongoDB Appointments</title>
      <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
    </Head>
    <div className="bg-cover bg-center min-h-screen" style={{backgroundImage: "url(" + `${require("../public/table-5.jpg")}` + ")"}}> 
      <header>
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 lg:bg-transparent py-6 px-10">
          <div className="flex items-center flex-shrink-0 text-gray-100 mr-6">
            <span className="font-semibold text-xl flex flex-row tracking-tight text-shadow-lg text-gray-200">
              <div className="flex items-center lg:hidden block">
                <button 
                  onClick={() => {
                    drop ? setDrop(false) : setDrop(true)
                  }}
                  type="button"
                  className="inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out" aria-label="Main menu" aria-expanded="false"
                >
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Link href="/">
                <a className="ml-5 sm:items-stretch sm:justify-start">
                  <h1 className="hidden sm:block md:block">Next.js + MongoDB Appointments</h1>
                  <h1 className="md:hidden lg:hidden sm:hidden block">Appointments</h1>
                </a>
              </Link>
            </span>
          </div>
          {drop ? 
          <div className="lg:hidden">
            {!user ? (
            <>
              <div className="w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow" />
                <div>
                  <div className="text-sm lg:flex-grow">
                    <Link href="/signup">
                      <a href="#responsive-header" className="font-semibold text-shadow-lg block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-gray-100 mr-4">
                        Sign Up
                      </a>
                    </Link>
                    <Link href="/login">
                      <a href="#" className="font-base text-shadow-lg inline-block text-sm px-4 py-2 leading-none border rounded text-gray-100 border-gray-100 hover:border-transparent hover:text-gray-100 hover:bg-purple-400 mt-4 lg:mt-0">Sign In</a>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow" />
                <div>
                  <div className="text-sm lg:flex-grow">
                    <Link href="/">
                      <button onClick={handleLogout} className="font-semibold text-shadow-lg block mt-4 lg:bg-transparent p-2 lg:w-auto lg:inline-block lg:mt-0 text-gray-100 hover:text-white mr-4">
                        Logout
                      </button>
                    </Link>
                    <Link href="/user/[userId]" as={`/user/${user._id}`}>
                      <a className="font-semibold block-shadow inline-block shadow-sm w-full lg:w-auto text-sm px-4 py-2 leading-none border rounded text-gray-100 border-gray-100 hover:border-transparent hover:text-gray-100 hover:font-semibold hover:bg-green-300 mt-4 lg:mt-0">Profile</a>
                    </Link>
                  </div>
                </div>
              </div>
            </>)}
          </div>
          :
          null}
          {!user ? (
            <>
              <div className="hidden w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow" />
                <div>
                  <div className="text-sm lg:flex-grow">
                    <Link href="/signup">
                      <a href="#responsive-header" className="font-semibold text-shadow-lg block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-gray-100 mr-4">
                        Sign Up
                      </a>
                    </Link>
                    <Link href="/login">
                      <a href="#" className="font-base text-shadow-lg inline-block text-sm px-4 py-2 leading-none border rounded text-gray-100 border-gray-100 hover:border-transparent hover:text-gray-100 hover:bg-purple-400 mt-4 lg:mt-0">Sign In</a>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="hidden w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow" />
                <div>
                  <div className="text-sm lg:flex-grow">
                    <Link href="/">
                      <button onClick={handleLogout} className="font-semibold text-shadow-lg block mt-4 lg:bg-transparent p-2 lg:w-auto lg:inline-block lg:mt-0 text-gray-100 hover:text-white mr-4">
                        Logout
                      </button>
                    </Link>
                    <Link href="/user/[userId]" as={`/user/${user._id}`}>
                      <a className="font-semibold block-shadow inline-block shadow-sm w-full lg:w-auto text-sm px-4 py-2 leading-none border rounded text-gray-100 border-gray-100 hover:border-transparent hover:text-gray-100 hover:font-semibold hover:bg-green-300 mt-4 lg:mt-0">Profile</a>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>
      </header>

      <main className="px-10">{children}</main>
    </div>
    </>
  );
}