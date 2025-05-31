import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;

const GoogleLoginButton = () => {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        window.location.href = GOOGLE_AUTH_URL;
      }}
    >
      <FaGoogle />
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
