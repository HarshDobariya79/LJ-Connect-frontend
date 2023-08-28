import { Outlet } from "react-router-dom";
import { protectedApi } from "../../services/api";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import logout from "../../utils/logout";

const Dashboard = () => {
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    const response = protectedApi
      .post("/auth/v1/profile/")
      .then((response) => {
        if (response?.status === 200) {
          setProfile(response?.data);
        }
      })
      .catch((error) => {
        console.log("request failed: " + error);
        logout();
      });
  }, []);

  return (
    <>
      <div className="flex w-screen max-h-screen">
        <Sidebar
          name={
            profile ? profile?.first_name + " " + profile?.last_name : undefined
          }
          role={profile?.role}
          profilePhoto={profile?.profile_photo}
        />
        {/* <img src={profile?.profile_photo} alt="" /> */}
        <div className="w-5/6 bg-slate-100 divide-x mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
