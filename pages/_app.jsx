import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import '../styles/main.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <div className="bg-gray-200 w-full h-full">
        <Layout>
          <Head>
            <title>Next.js + MongoDB Apppointments</title>
          </Head>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  );
}
