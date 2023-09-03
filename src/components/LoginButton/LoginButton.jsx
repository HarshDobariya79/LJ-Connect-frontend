import React from 'react';
import googleIcon from '../../assets/images/LoginPage/google.png';

const handleLoginClick = () => {
  const { REDIRECT_URI, CLIENT_ID, ACCESS_TYPE } = process.env;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${REDIRECT_URI}&prompt=consent&response_type=code&client_id=${CLIENT_ID}&scope=openid%20email%20profile&access_type=${ACCESS_TYPE}`;
  window.location.href = googleAuthUrl;
};

function LoginButton({ text }) {
  return (
    <button
      onClick={handleLoginClick}
      className="bg-[#EBEBEB] hover:bg-[#CECECE] text-[#494949] font-bold xl:py-2 lg:py-1 px-4 rounded w-2/3 mb-7 flex justify-start items-center"
    >
      <img src={googleIcon} alt="Google Icon" className="relative left-0 w-2 xl:w-5 lg:w-3 inline" />
      <span className="flex-1 text-center mr-5 font-[500]">{text}</span>
    </button>
  );
}

export default LoginButton;
