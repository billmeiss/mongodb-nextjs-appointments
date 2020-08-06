import React from 'react';
import Head from 'next/head';
import nextConnect from 'next-connect';
import database from '../../middlewares/database';

export default function EmailVerifyPage({ success }) {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <div className="flex flex-col items-center">
        <p className="text-xl mt-10 font-semibold bg-white p-5 rounded">{success ? 'Thanks for verifying your email. You may continue with your life.' : 'This link may have expired.'}</p>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const handler = nextConnect();
  handler.use(database);
  await handler.apply(ctx.req, ctx.res);

  const { token } = ctx.query;
  const { value: tokenDoc } = await ctx.req.db
    .collection('tokens')
    .findOneAndDelete({ token, type: "emailVerify"});

  if (!tokenDoc) {
    return { props: { success: false } };
  }

  await ctx.req.db
    .collection('users')
    .updateOne({ _id: tokenDoc.userId }, { $set: { emailVerified: true } });

  return { props: { success: true } };
}