import React, { useState } from 'react';
import { useCurrentUser, useUsers } from '../../lib/hooks';
import Link from 'next/link';
import moment from 'moment';

export default function AppointmentEditor() {
  const [user] = useCurrentUser();

  const users = useUsers();

  const [msg, setMsg] = useState(null);

  if (!user) {
    return (
      <div className="text-lg text-gray-600 font-semibold">
        Please 
        <Link href="/login">
          <a className="text-gray-800 font-bold"> sign in </a>
        </Link>
        to post
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      date: e.currentTarget.date.value,
      note: e.currentTarget.note.value,
      partnerId: e.currentTarget.partner.value
    };
    if (!e.currentTarget.date.value) return;
    e.currentTarget.date.value = '';
    e.currentTarget.note.value = '';
    e.currentTarget.partner.value = '';
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setMsg('Sent!')
      setTimeout(() => setMsg(null), 5000);
    }
  }

  return (
    <>

      {msg ? <div className="bg-green-100 border w-auto shadow border-green-200 mb-5 text-green-800 px-3 py-2 rounded relative w-auto flex flex-col self-center" role="alert">
        <strong className="font-bold text-center">{msg}</strong>
      </div> : null}
      <form onSubmit={handleSubmit} className="w-full max-w-sm" autoComplete="off">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-700 font-semibold md:text-right mb-1 md:mb-0 pr-4" htmlFor="date">
              Date and Time
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border border-gray-300 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" 
              name="date"
              type="datetime-local"
              min={moment().format('YYYY-MM-DDTHH:mm')}
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
              className="bg-gray-200 appearance-none border border-gray-300 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" 
              name="note"
              type="text"
              placeholder="Let's hang out"
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
                    <option className="text-gray-800 font-semibold rounded" key={user._id} value={user._id}>{user.name}</option>
                  );
                })}
              </select>
            </div>
          </>
          : null}
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button className="shadow bg-green-400 hover:bg-green-300 focus:shadow-outline focus:outline-none text-white font-semibold py-2 px-4 rounded-lg" type="submit">
              Create Appointment
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
