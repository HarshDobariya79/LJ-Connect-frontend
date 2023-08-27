import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="flex w-screen min-h-screen">
        <div className="w-1/6">Sidebar</div>
        <div className="w-5/6 bg-slate-100 divide-x mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
