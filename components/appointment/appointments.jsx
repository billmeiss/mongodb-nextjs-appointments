import React, { useState, useEffect } from 'react';
import { useSWRInfinite } from 'swr';
import Link from 'next/link';
import { useUser, useUsers, useCurrentUser } from '../../lib/hooks';
import fetcher from '../../lib/fetch';
import moment from 'moment';

function Appointment({ appointment }) {
  const user = useUser(appointment.creatorId);
  const [currentUser] = useCurrentUser();
  const users = useUsers();
  const partner = useUser(appointment.partnerId);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModal, setIsModal] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = {
      date: event.currentTarget.date.value,
      time: event.currentTarget.time.value,
      note: event.currentTarget.note.value,
      partnerId: event.currentTarget.partner.value,
      creatorId: appointment.creatorId,
      appointmentId: appointment._id.toString()
    };
    const res = await fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setIsEditing(false);
    };
    setIsUpdating(false);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const body = {
      appointmentId: appointment._id.toString(),
      creatorId: appointment.creatorId
    };
    const res = await fetch('/api/appointments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setIsModal(false);
  }

  return (
    <div className="max-w-sm shadow-lg w-full lg:max-w-full lg:flex pt-4 mb-4">
      {/* Delete Modal */}
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
                    Delete Appointment
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm leading-5 text-gray-500">
                      Are you sure you want to delete your appointment? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button type="button" onClick={handleDelete} className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-200 text-base leading-6 font-medium text-red-700 shadow-sm hover:bg-red-300 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                  Delete
                </button>
              </span>
              <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                <button type="button" onClick={() => setIsModal(false)} className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                  Cancel
                </button>
              </span>
            </div>
          </div>
        </div>    
      :
      null
      }
      {/* Editing Appointment Card */}
      {isEditing ? 
        user && partner && (
        <>
        <form onSubmit={handleSubmit}>
          <div className="shadow-lg h-auto w-full border-t-4 border-green-300 bg-gray-100 rounded p-6 lg:p-4 flex flex-col justify-between leading-normal">
            <div className="mb-5 flex flex-row-reverse">
              <button onClick={() => {
                isEditing ? setIsEditing(false) : setIsEditing(true)
              }} type="button" className="inline-block shadow bg-red-200 hover:bg-red-300 rounded-full ml-2 px-2 py-1 text-sm font-bold text-red-700">
                <svg fill="none" className="fill-current block inline -mt-1 w-4 h-4 mr-1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                <span>Cancel</span>
              </button>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-700 md:text-right font-semibold mb-1 pr-4" htmlFor="date">
                  Date
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border border-gray-300 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" 
                  name="date"
                  type="date"
                  min={moment().format('YYYY-MM-DD')}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-700 md:text-right font-semibold mb-1 pr-4" htmlFor="date">
                  Time
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border border-gray-300 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" 
                  name="time"
                  type="time"
                  min={moment().format('HH:mm')}
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-700 font-semibold md:text-right mb-1 md:mb-0 pr-4" htmlFor="note">
                  Note
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-200 appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" 
                  id="note"
                  name="note"
                  type="text"
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              {users ? 
              <>
                <div className="md:w-1/3">
                  <label className="block text-gray-700 font-semibold md:text-right mb-1 md:mb-0 pr-4" htmlFor="partner">
                    Partner
                  </label>
                </div>
                <div className="md:w-2/3">
                  <select name="partner" className="form-select rounded h-full py-0 md:pl-2 md:pr-7 font-bold bg-transparent text-gray-900" id="grid-state">
                    {users.map((user) => {
                      return (
                        <option 
                          className="text-gray-800 font-semibold rounded" 
                          key={user._id} 
                          value={user._id}
                        >
                          {user.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
              :
              null}
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3" />
              <div className="md:w-2/3">
                {isUpdating ? 
                  <button type="submit" className="bg-opacity-50 rounded-lg shadow hover:bg-green-300 cursor-not-allowed font-semibold bg-green-100 text-green-800 p-2">Submit</button> 
                  :
                  <button type="submit" className="bg-green-200 rounded-lg font-semibold hover:bg-green-300 shadow text-green-800 p-2">Submit</button> 
                }
              </div>
            </div>
            <div className="flex items-center lg:px-4 lg:pb-2">
              <Link href="/user/[userId]" as={`/user/${user[0]._id}`}>
                <a>
                  <img className="w-10 h-10 rounded-full mr-4 bg-cover shadow-inner mb-1" src={user[0].profilePicture} alt={user[0].name} />
                  <div className="text-sm">
                    <p className="text-green-800 font-semibold leading-none">{user[0].name}</p>
                    <p className="text-gray-600 font-light">Created {moment(appointment.createdAt).fromNow()}</p>
                  </div>
                </a>
              </Link>
            </div>
          </div>
          </form>
        </>
        )
      :
      // Reading Appointment Card
      user && partner && (
        <>
          <div className="h-auto lg:w-48 w-auto lg:border-t-4 lg:border-green-300 shadow-lg flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
            <img className="w-full bg-gray-100 h-full" src={user[0].profilePicture} alt={user[0].name} />
          </div>
          <div className="shadow-lg h-auto w-full lg:border-t-4 lg:border-green-300 hover:bg-gray-200 bg-gray-100 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-4">
              <p className="text-sm text-gray-700 flex flex-wrap items-center">
                with 
                <Link href="/user/[userId]" as={`user/${appointment.partnerId}`}>
                  <a className="p-1 font-semibold text-gray-800 flex flex-row">
                    <img src={partner[0].profilePicture} width="20" height="20" className="shadow-inner ml-1 bg-cover" style={{ borderRadius: '50%', objectFit: 'cover', marginRight: '0.3rem' }} alt={partner[0].name} />
                    {partner[0].name}
                  </a>
                </Link> 
                on 
                <a className="font-semibold text-green-700 p-1">{moment.unix(appointment.date).format('MMMM Do')}</a>
                at 
                <a className="p-1 font-semibold text-green-700">{moment.unix(appointment.date).format('hh:mm a')}</a>
                {currentUser && (appointment.creatorId === currentUser._id.toString() ? 
                <>
                  <div className="flex flex-row">
                    <button onClick={() => {
                      isEditing ? setIsEditing(false) : setIsEditing(true)
                    }} type="button" className="inline-block shadow bg-green-200 hover:bg-green-300 rounded-full lg:ml-2 xl:ml-2 md:ml-2 px-2 py-1 text-sm font-semibold text-green-700">
                      <svg className="fill-current block inline -mt-1 w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button> 
                    <button onClick={() => {
                      isModal ? setIsModal(false) : setIsModal(true)
                    }} type="button" className="inline-block shadow bg-red-200 hover:bg-red-300 rounded-full ml-2 px-2 py-1 text-sm font-semibold text-red-700">
                      <svg className="fill-current block inline -mt-1 w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </>
                : null)}
              </p>
            </div>
            <div className="text-gray-900 font-bold text-xl mb-4">{appointment.note}</div>
            <div className="flex items-center">
              <Link href="/user/[userId]" as={`/user/${user[0]._id}`}>
                <a>
                  <img className="w-10 h-10 rounded-full mr-4 bg-cover shadow-inner mb-1" src={user[0].profilePicture} alt={user[0].name} />
                  <div className="text-sm">
                    <p className="text-green-800 font-semibold leading-none">{user[0].name}</p>
                    <p className="text-gray-600 font-light">Created {moment(appointment.createdAt).fromNow()}</p>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </>
      )
      }
    </div>
  );
}

const PAGE_SIZE = 10;

export function useAppointmentPages({ creatorId } = {}) {
  return useSWRInfinite((index, previousPageData) => {
    // reached the end
    if (previousPageData && previousPageData.posts.length === 0) return null;

    // first page, previousPageData is null
    if (index === 0) {
      return `/api/appointments?limit=${PAGE_SIZE}${
        creatorId ? `&by=${creatorId}` : ''
      }`;
    }

    // using oldest appointments input date as cursor
    // We want to fetch posts which has a date that is
    // before (hence the .getTime() - 1)
    const from = new moment().format('MMMM Do YYYY, h:mm a').toJSON();

    return `/api/appointments?from=${from}&limit=${PAGE_SIZE}${
      creatorId ? `&by=${creatorId}` : ''
    }`;
  }, fetcher, {
    refreshInterval: 10000 // Refresh every 10 seconds
  });
}

export default function Appointments({ creatorId }) {
  const {
    data, error, size, setSize
  } = useAppointmentPages({ creatorId });

  const appointments = data ? data.reduce((acc, val) => [...acc, ...val.appointments], []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0].posts?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.appointments.length < PAGE_SIZE);

  return (
    <div>
      {appointments.map((appointment) => <Appointment key={appointment._id} appointment={appointment} />)}
      {/* Empty State Design */}
      {!isLoadingMore && (appointments.length === 0) ? 
        <div className="rounded shadow-lg w-screen sm:w-full md:w-full lg:w-full p-5 bg-gray-200 text-purple-600">
          <p className="font-semibold text-md text-center">We can't find any appointments.</p>
          <img src="/checking-box.svg" className="w-full h-full" alt='checking boxes' />
          <p className="font-md text-gray-700 text-sm mt-2 text-center">Go break the ice and make an <Link href="/"><a className="text-purple-700 hover:text-purple-800 font-bold">appointment</a></Link></p>
        </div> 
      : null}
      {!isReachingEnd && (
        <button
          type="button"
          className="text-shadow-lg text-lg text-purple-200 hover:text-purple-300 font-bold rounded-lg text-center"
          onClick={() => setSize(size + 1)}
          disabled={isReachingEnd || isLoadingMore}
        >
          {isLoadingMore ? '. . .' : 'Load More'}
        </button>
      )}
    </div>
  );
}