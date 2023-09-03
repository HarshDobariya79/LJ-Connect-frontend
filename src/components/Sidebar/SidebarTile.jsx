import React from 'react';
import { Link } from 'react-router-dom';

function SidebarTile(props) {
  const { path, title } = props;
  return (
    <li key={title}>
      <Link to={path}>
        <button
          className={`w-full ease-in-out transition duration-100 text-left p-2 rounded-lg ${
            path === window.location.pathname ? 'bg-oceanic-blue text-white' : 'text-gray-700 hover:text-white'
          } hover:bg-gray-100 hover:bg-oceanic-blue group`}
        >
          <span className="ml-3">{title}</span>
        </button>
      </Link>
    </li>
  );
}

export default SidebarTile;
