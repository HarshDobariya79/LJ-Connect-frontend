import React from 'react';
import Logo from '../../assets/images/logo.png';
import SidebarTile from './SidebarTile';
import logout from '../../utils/logout';

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function Sidebar(props) {
  const role = props?.role;
  const config = [
    {
      role: ['admin', 'hod', 'staff', 'student', 'guest'],
      title: 'Dashboard',
      path: '/dashboard',
    },
    {
      role: ['admin'],
      title: 'Manage Staff',
      path: '/staff',
    },
    {
      role: ['admin'],
      title: 'Student',
      path: '/student',
    },
    {
      role: ['admin'],
      title: 'Manage Branch',
      path: '/branch',
    },
    {
      role: ['admin', 'hod'],
      title: 'Faculty Allocation',
      path: '/faculty-allocation',
    },
    {
      role: ['admin', 'hod'],
      title: 'Manage Batch',
      path: '/batch',
    },
  ];

  const applyConfig = config.filter((obj) => obj?.role.includes(role));

  return (
    <div className="flex flex-col justify-between w-1/6 max-h-screen overscroll-y-none min-h-screen relative">
      <div className="flex flex-col">
        <img src={Logo} alt="LJ Logo" className="w-4/5 mt-3 mx-auto" />
        <hr className="w-[90%] mx-auto mb-6 mt-3" />
        <ul className="space-y-2 font-medium mx-3 h-full">
          {applyConfig?.map(({ title, path }) => (
            <SidebarTile path={path} title={title} />
          ))}
        </ul>
      </div>
      <div className="flex flex-col p-4 space-y-2">
        <div className="flex justify-start space-x-5 items-center p-1">
          {props?.profilePhoto ? (
            <img src={props?.profilePhoto} alt="user profile" className="w-1/4 rounded-full" />
          ) : (
            <div className="w-1/4 bg-gray-100 aspect-square rounded-full animate-pulse" />
          )}

          {console.log(props?.name)}
          {props?.name ? (
            <div className="flex flex-col justify-start">
              <div className="font-bold">{props?.name}</div>
              <div className="">{toTitleCase(props?.role)}</div>
            </div>
          ) : (
            <div className="w-3/4 h-4/5 bg-gray-100 rounded animate-pulse" />
          )}
        </div>
        <button onClick={logout} className="bg-gray-500 hover:bg-gray-600 rounded-lg w-full mx-auto p-1 text-white">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
