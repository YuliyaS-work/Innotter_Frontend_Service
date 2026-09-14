export const loginInitialValues = {
  login: localStorage.getItem('remembered_login') ?? '',
  password: '',
  rememberMe: Boolean(localStorage.getItem('remembered_login')),
};
