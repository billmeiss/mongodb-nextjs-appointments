import React from 'react';
import { useCurrentUser } from '../lib/hooks';
import AppointmentEditor from '../components/appointment/editor';
import Appointments from '../components/appointment/appointments';

const IndexPage = () => {
  const [user] = useCurrentUser();

  return (
    <>
      <div className="flex items-center flex-col">
        <div className="flex flex-col text-3xl pt-10 text-shadow-lg">
          <span className="font-semibold text-purple-200">
            Hey,
            {' '}
            {user ? user.name : 'mate'}
            !
          </span>
          <span className="text-gray-200">Have a wonderful day.</span>
        </div>
        <div className="mr-6 items-center w-full mt-8 flex-shrink-0 flex flex-col">
          <div className="p-6 lg:p-10 md:p-8 overflow-y-auto flex flex-col justify-between bg-gray-100
            rounded shadow border-t-4 border-green-300 min-w-64 lg:w-2/5 items-center" 
          >
            <AppointmentEditor />
          </div>
          <div className="max-w-screen-md p-8 items-center mt-8 flex flex-col">
            <Appointments />
          </div>
        </div>
      </div>
    </>
  );
};
export default IndexPage;

