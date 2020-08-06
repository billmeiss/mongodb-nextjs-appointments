import React, { useState } from 'react';
import Head from 'next/head';
import nextConnect from 'next-connect';
import Router from 'next/router';
import database from '../../middlewares/database';

const ResetPasswordTokenPage = ({ valid, token }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsUpdating(true);

    const body = {
      password: event.currentTarget.password.value,
      token
    };

    const res = await fetch('/api/user/password/reset', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    setIsUpdating(false);

    if (res.status === 200) Router.replace('/');
  }

  return (
    <>
      <Head>
        <title>Forgotten Password</title>
      </Head>
      {valid ? (
        <>
          <div className="flex items-center flex-col max-w-sm w-full lg:max-w-full lg:flex pt-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded mb-8">
              <div className="w-full rounded border-t-4 border-purple-400 bg-purple-100">
                  <h1 className="block text-purple-800 px-8 pt-4 text-lg font-bold">Password Reset</h1>
                  <p className="block text-purple-800 px-8 pt-4 pb-4 text-md font-semibold mb-2">Enter your new password</p>
                </div>
                <div className="px-8 pt-6 pb-8">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                      Password
                      <input
                        className="shadow appearance-none border rounded w-full mt-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="*********"
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
      ) : (
        <p>This link may have been expired</p>
      )}
    </>
  );
};

export async function getServerSideProps(ctx) {
  const handler = nextConnect();
  handler.use(database);
  await handler.apply(ctx.req, ctx.res);
  const { token } = ctx.query;

  const tokenDoc = await ctx.req.db.collection('tokens').findOne({
    token: ctx.query.token,
    type: 'passwordReset'
  });

  return { props: { token, valid: !!tokenDoc } };
}

export default ResetPasswordTokenPage;