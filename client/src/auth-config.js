var authConfig = {
  baseUrl: "http://localhost:5000/api",
  loginURL: '/users/login',
  tokenName: 'token',
  authHeader: 'Authorization',
  authToken: '',
  logoutRedirect: '#/home'
}

export default authConfig;
