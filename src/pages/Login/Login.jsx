import React from "react";
import logo from "../../assets/images/logo.png";
import studentsImg from "../../assets/images/LoginPage/students.png";
import formHeader from "../../assets/images/LoginPage/form-header.svg";
import LoginButton from "../../components/LoginButton/LoginButton";

const Login = () => {
  const loginButtonTypes = ["student", "staff"];
  
  return (
    <div className="flex justify-center items-center h-screen bg-oceanic-blue">
      <div className="w-[75%] h-[75%] bg-white flex flex-col">
        <img
          src={logo}
          alt="Lj University Logo"
          className="self-start mt-4 ml-7 w-1/4"
        />
        <div className="flex flex-row space-x-[7%] h-full w-full justify-center items-center">
          <div className="w-2/5 h-4/5 flex justify-center items-center">
            <img src={studentsImg} alt="Students" className="w-4/6 h-auto" />
          </div>
          <div className="flex justify-center items-start w-4/12 h-fit">
            <div className="flex flex-col justify-start items-center bg-white drop-shadow-xl w-11/12 h-[90%] xl:pb-7 lg:pb-3">
              <img
                src={formHeader}
                alt="Form header image"
                className="w-full"
              />
              <div className="text-[#494949] font-bold mb-6">Login</div>
              {loginButtonTypes.map((buttonType) => (
                <LoginButton key={buttonType} text={buttonType} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
