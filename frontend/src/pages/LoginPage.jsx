import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';

// Thin wrapper so /login (and the axios 401 redirect) renders the same
// LoginModal used everywhere else, instead of a separate full-page component.
// Closing the modal (Esc, backdrop click, X button) sends the user home.
export function LoginPage() {
  const navigate = useNavigate();

  return (
    <LoginModal
      open={true}
      onClose={() => navigate('/')}
    />
  );
}

export default LoginPage;