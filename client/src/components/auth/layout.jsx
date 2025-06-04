import { Outlet } from 'react-router-dom';
import Logo from '../../assets/logo-dark.png';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#0D0E0D] w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-primary-foreground text-5xl">
          <h1 className="font-medium tracking-tight">Welcome to</h1>
          <img src={Logo} alt="Logo" className="h-32 mb-4" />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 text-foreground">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
