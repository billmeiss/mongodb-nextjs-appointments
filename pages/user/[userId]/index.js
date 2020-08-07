import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Error from 'next/error';
import middleware from '../../../middlewares/middleware';
import { useCurrentUser } from '../../../lib/hooks';
import Appointments from '../../../components/appointment/appointments';
import { getUser } from '../../../lib/db';

export default function UserPage({ data }) {
  const user = JSON.parse(data);
  if (!user) return <Error statusCode={404} />;
  const {
    name, email, bio, profilePicture,
  } = user || {};
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === user._id;
  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div className="w-full flex flex-col lg:flex-row items-center ">
        <div className="m-2 lg:m-10">
          <div className="bg-gray-100 h-full w-screen sm:w-full md:w-full lg:w-full rounded-lg border border-gray-100 rounded shadow-lg justify-between leading-normal">
            <img className="h-full w-full bg-cover" src={profilePicture} alt={name} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl text-gray-900 mb-2"> 
                {name}
              </div>
              <div className="mb-3">
                {isCurrentUser && (
                <Link href="/settings">
                  <button type="button" className="inline-block bg-green-200 hover:bg-green-300 rounded-full px-3 py-1 text-sm font-semibold text-green-700">
                    <svg className="fill-current block inline -mt-1 w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    <span>Edit</span>
                  </button>
                </Link>
                )}
              </div>
              <p className="font-semibold text-gray-600 text-md">Bio</p>
              <p className="text-gray-800 text-md font-semibold mb-4">{bio ? bio : 'No Bio Found :('}</p>
              <p className="text-gray-500 text-md font-semibold">
                {email ? {email} : 'Email has not been verified yet'}
              </p>
            </div>
          </div>
        </div>
        <div className="m-10 flex w-full flex-col items-center">
          <p className="font-bold text-xl rounded-lg shadow px-3 py-1 bg-green-200 text-green-800 mb-4">My Appointments</p>
          <Appointments creatorId={user._id} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await middleware.apply(context.req, context.res);
  const res = await getUser(context.req, context.params.userId);
  const data = await JSON.stringify(res);
  if (!data) context.res.statusCode = 404;
  return {
    props: {
      data
    }, // will be passed to the page component as props
  };
}