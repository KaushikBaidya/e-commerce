import { FaCheckCircle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import VarificationImg from '../../assets/undraw_authentication_tbfc.svg';

const VerifyEmail = () => {
  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center px-4">
      <img src={VarificationImg} alt="Verify Email" className="w-60 mx-auto mb-6" />

      <div className="flex justify-center mb-4">
        <MdEmail className="text-blue-600 text-5xl" />
      </div>

      <h1 className="text-2xl font-semibold text-gray-800 mb-3">Verify Your Email</h1>

      <p className="text-gray-600 mb-6">
        We've sent a verification link to your email. Please check your inbox and click the link to
        activate your account.
      </p>

      <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
        <FaCheckCircle />
        <p>If you don’t see the email, check your spam folder.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
