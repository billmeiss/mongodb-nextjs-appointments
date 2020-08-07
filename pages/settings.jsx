import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useCurrentUser } from '../lib/hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ProfileSection = () => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const nameRef = useRef();
  const bioRef = useRef();
  const profilePictureRef = useRef();
  const [msg, setMsg] = useState({ message: '', isError: false });

  useEffect(() => {
    nameRef.current.value = user.name;
    bioRef.current.value = user.bio;
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    const formData = new FormData();
    if (profilePictureRef.current.files[0]) { formData.append('profilePicture', profilePictureRef.current.files[0]); }
    formData.append('name', nameRef.current.value);
    formData.append('bio', bioRef.current.value);
    const res = await fetch('/api/user', {
      method: 'PATCH',
      body: formData,
    });
    setIsUpdating(false);
    if (res.status === 200) {
      const userData = await res.json();
      mutate({
        user: {
          ...user,
          ...userData.user
        }
      });
      setMsg({ message: 'Profile updated' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (isUpdatingPassword) return;
    setIsUpdatingPassword(true);
    const body = {
      oldPassword: e.currentTarget.oldPassword.value,
      newPassword: e.currentTarget.newPassword.value
    };
    e.currentTarget.oldPassword.value = '';
    e.currentTarget.newPassword.value = '';

    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.status == 200) {
      setMsg({ message: 'Password updated' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
    setIsUpdatingPassword(false);
  };

  async function sendVerificationEmail() {
    if (isVerifying) return;
    setIsVerifying(true);
    const res = await fetch('/api/user/email/verify', {
      method: 'POST'
    });
    if (res.status == 200) {
      setMsg({ message: 'Email sent' })
    } else {
      setMsg({ message: 'An error occured' })
    }
    setIsVerifying(false);
  }

  const handleDelete = async (event) => {
    event.preventDefault();
    const res = await fetch('/api/user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    router.replace('/');
    setIsModal(false);
  }

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <section className="w-auto py-3">
        {isModal ?
          <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      Deactivate Account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                  <button 
                    type="button" 
                    onClick={handleDelete} 
                    className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-200 text-base leading-6 font-medium text-red-700 shadow-sm hover:bg-red-300 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  >
                    Deactivate
                  </button>
                </span>
                <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                  <button 
                    type="button"
                    onClick={() => setIsModal(false)} 
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  >
                    Cancel
                  </button>
                </span>
              </div>
            </div>
          </div>
        :
        null
        }
        {user ? <div className="container mx-auto flex flex-col items-center px-4">
          <div className="min-w-0 break-words bg-gray-100 mb-6 shadow-xl rounded-lg max-w-xl border-t-4 border-purple-300 px-10 py-10">
            {msg.message ? 
            msg.isError ?
            <div className="mt-5 mb-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{msg.message}</strong>
            </div>
            :
            <div className="mt-5 mb-3 bg-green-100 border-l-4 rounded border-green-500 text-green-700 px-4 py-3" role="alert">
              <p className="font-bold">{msg.message}</p>
            </div>
            : null}
            {!user.emailVerified ? (
              <>
              <div className="bg-orange-100 border-l-4 rounded border-orange-500 text-orange-700 p-4" role="alert">
                <p className="font-bold">Your email has not been verified</p>
              </div>
              <div className="flex flex-col mb-4">
                {isVerifying ? 
                <button onClick={sendVerificationEmail} className="mt-5 opacity-50 cursor not allowed bg-purple-200 active:bg-purple-300 text-purple-800 font-bold hover:shadow-md shadow text-md px-4 py-2 rounded-lg outline-none focus:outline-none sm:mr-2 mb-1">
                  Send verification email
                </button>
                :
                <button onClick={sendVerificationEmail} className="mt-5 bg-purple-200 active:bg-purple-300 text-purple-800 font-bold hover:shadow-md shadow text-md px-4 py-2 rounded-lg outline-none focus:outline-none sm:mr-2 mb-1">
                  Send verification email
                </button>
                }
              </div>
              </>
            ) : null}
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <div className="w-1/4 m-5 hidden sm:block md:block lg:block">
                  <p className="text-base font-semibold text-gray-700">Profile</p>
                  <p className="text-sm font-light text-gray-500">This information will be shown publicly</p>
                </div>
                <div className="w-full sm:w-3/4 md:w-3/4 lg:w-3/4 m-5">
                  <div className="flex flex-col">
                    <div>
                      <label className="text-md font-medium leading-normal text-gray-700" htmlFor="name">
                        Name
                        <input 
                          required
                          className="text-md mt-2 font-semibold appearance-none border-2 bg-transparent rounded-lg w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:bg-gray-100 focus:border-purple-500"
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your name"
                          ref={nameRef}
                        />
                      </label>
                      <div className="mt-5 text-gray-900">
                        <label htmlFor="bio">
                          <p className="text-md font-medium leading-normal text-gray-700">Bio</p>
                          <textarea 
                            className="mt-2 font-medium text-md appearance-none border-2 bg-transparent rounded-lg w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:bg-gray-100 focus:border-purple-500"
                            id="bio"
                            name="bio"
                            type="text"
                            placeholder="Tell us who you are"
                            ref={bioRef}
                          />
                        </label>
                      </div>
                      <div className="mt-5 text-gray-700">
                        <label htmlFor="avatar">
                          <p className="text-md font-medium leading-normal text-gray-700">Profile picture</p>
                          <input 
                            type="file"
                            className="bg-transparent mt-2 font-normal text-sm appearance-none border-2 rounded-lg w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:bg-gray-100 focus:border-purple-500"
                            id="avatar"
                            name="avatar"
                            accept="image/png, image/jpeg"
                            ref={profilePictureRef}
                          />
                        </label>
                      </div>
                      {isUpdating ?
                      <button className="opacity-50 mt-8 cursor-not-allowed bg-purple-200 hover:bg-purple-300 text-purple-800 font-bold px-4 py-2 rounded-lg outline-none focus:outline-none sm:mr-2 mb-1" type="submit">Save</button>
                      :
                      <button className="mt-8 bg-purple-200 hover:bg-purple-300 text-purple-800 font-bold shadow-md shadow px-4 py-2 rounded-lg outline-none focus:outline-none sm:mr-2 mb-1" type="submit">Save</button>
                      }
                      </div>
                    </div>
                  </div>
                </div>
            </form>
            <div className="py-5 mt-5 border-t-2 border-gray-300">
              <div className="flex justify-center">
                <div className="m-5 hidden sm:block md:block lg:block w-1/4">
                  <p className="text-base font-semibold text-gray-700">Change password</p>
                </div>
                <div className="m-5 w-full sm:w-3/4 md:w-3/4 lg:w-3/4">
                  <form onSubmit={handleSubmitPasswordChange}>
                    <label htmlFor="oldpassword">
                      <p className="text-md font-semibold leading-normal text-gray-700">Old Password</p>
                      <input
                        className="mt-2 bg-transparent appearance-none border-2 rounded-lg w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:bg-gray-100 focus:border-purple-500"
                        type="password"
                        name="oldPassword"
                        id="oldpassword"
                        required
                      />
                    </label>
                    <label htmlFor="newpassword">
                    <p className="text-md font-semibold leading-normal mt-5 text-gray-700">New Password</p>
                      <input
                        className="mt-2 bg-transparent appearance-none border-2 rounded-lg w-full py-2 px-4 text-gray-900 leading-tight focus:outline-none focus:bg-gray-100 focus:border-purple-500"
                        type="password"
                        name="newPassword"
                        id="newpassword"
                        required
                      />
                    </label>
                    {isUpdatingPassword ?
                    <button className="mt-8 cursor-not-allowed opacity-50 bg-purple-200 hover:bg-purple-300 text-purple-800 font-bold px-4 py-2 rounded-lg outline-none focus:outline-none sm:mr-2 mb-1" type="submit">Change Password</button>
                    :
                    <button className="mt-8 bg-purple-200 hover:bg-purple-300 text-purple-800 font-bold shadow-md shadow px-4 py-2 rounded-lg outline-none focus:outline-none sm:mr-2 mb-1" type="submit">Change Password</button>
                    }
                  </form>
                </div>
              </div>
            </div>
            <div className="mt-5 py-5 border-t-2 border-gray-300 flex justify-center">
              <button onClick={()=>{
                setIsModal(true)
              }}className="mt-8 bg-red-200 hover:bg-red-300 text-red-800 font-bold shadow-md shadow px-4 py-2 rounded-lg outline-none focus:outline-none sm:mr-2 mb-1">
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
        : null}
      </section>
    </>
  );
};

const SettingPage = () => {
  const [user] = useCurrentUser();

  if (!user) {
    return (
      <div className="mr-6 items-center mt-8 flex-shrink-0 flex flex-col">
        <div className="p-8 mb-5 overflow-y-auto flex flex-col justify-between bg-gray-100
        rounded shadow border-t-4 border-green-300"
        >
          <div className="text-lg text-gray-600 font-semibold">
            Please 
            <Link href="/login">
              <a className="text-gray-800 font-bold"> sign in </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <ProfileSection />
    </>
  );
};

export default SettingPage;