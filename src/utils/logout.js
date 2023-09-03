const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  setTimeout(() => {
    window.location = '/login';
  }, 500); // This delay depends on useEffect of useAuth.
};

export default logout;
