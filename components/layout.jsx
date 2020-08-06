import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCurrentUser } from '../lib/hooks';

export default ({ children }) => {
  const [user, { mutate }] = useCurrentUser();
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
        <nav className="flex items-center justify-between flex-wrap bg-transparent py-6 px-10">
          <div className="flex items-center flex-shrink-0 text-gray-100 mr-6">
            <span className="font-semibold text-xl tracking-tight">
              <Link href="/">
                <a>
                  <h1 className="text-shadow-lg">Next.js + MongoDB Appointments</h1>
                </a>
              </Link>
            </span>
          </div>
          {!user ? (
            <>
              <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
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
              <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow" />
                <div>
                  <div className="text-sm lg:flex-grow">
                    <Link href="/">
                      <button onClick={handleLogout} className="font-semibold text-shadow-lg block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-gray-100 mr-4">
                        Logout
                      </button>
                    </Link>
                    <Link href="/user/[userId]" as={`/user/${user._id}`}>
                      <a className="font-semibold block-shadow inline-block shadow-sm text-sm px-4 py-2 leading-none border rounded text-gray-100 border-gray-100 hover:border-transparent hover:text-gray-100 hover:font-semibold hover:bg-green-300 mt-4 lg:mt-0">Profile</a>
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