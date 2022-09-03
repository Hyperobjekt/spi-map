export const EmailError = {
  'auth/email-already-in-use': 'User already exists with that email',
  'auth/invalid-email': 'Email Address is invalid',
};

export const PasswordError = {};

export const FormError = {
  'auth/user-not-found': 'Invalid email or password',
  'auth/wrong-password': 'Invalid email or password',
  '*': 'An unexpected error occurred. Please try again later.',
  'auth/too-many-requests':
    'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later',
};

export const ActionCodeError = {
  'auth/invalid-action-code': 'Code is invalid or expired',
};
