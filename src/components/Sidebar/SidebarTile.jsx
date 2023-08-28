import { Link } from "react-router-dom";

const SidebarTile = (props) => {
  return (
    <li key={props?.title}>
      <Link to={props?.path}>
        <button
          className={`w-full ease-in-out transition duration-100 text-left p-2 rounded-lg ${
            props?.path === window.location.pathname
              ? "bg-oceanic-blue text-white"
              : "text-gray-700 hover:text-white"
          } hover:bg-gray-100 hover:bg-oceanic-blue group`}
        >
          <span className="ml-3">{props.title}</span>
        </button>
      </Link>
    </li>
  );
};

export default SidebarTile;
