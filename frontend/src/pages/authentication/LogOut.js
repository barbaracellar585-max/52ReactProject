const LogOut = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default LogOut;
