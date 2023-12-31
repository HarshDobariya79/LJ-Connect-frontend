import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const Auth = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      api
        .post(process.env.GOOGLE_LOGIN_V1, {
          code,
        })
        .then((response) => {
          if (response?.status === 200) {
            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            setIsLoggedIn(true);
            navigate('/dashboard');
          }
        })
        .catch((error) => {
          console.error(`Login request failed: ${error}`);
          navigate('/login');
        });
    } else {
      navigate('/dashboard');
    }
  }, []);
};

export default Auth;
