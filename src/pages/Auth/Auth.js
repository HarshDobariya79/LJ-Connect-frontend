import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { sendCodeToServer } from "../../actions/authActions";
import { useAuth } from "../../hooks/useAuth";

const extractCodeAndDispatch = (dispatch, setIsLoggedIn, redirect) => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    dispatch(sendCodeToServer(code, setIsLoggedIn, redirect));
  } else {
    redirect();
  }
};


const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/home" } };
  const { setIsLoggedIn } = useAuth();
  console.error(from);
  
  const redirect = () => {
    navigate(from)
  }

  useEffect(() => {
    extractCodeAndDispatch(dispatch, setIsLoggedIn, redirect);
  }, [dispatch, navigate]);
};

export default Auth;
