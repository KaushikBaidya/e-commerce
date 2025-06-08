import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const VerifyTokenPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email/${token}`
        );
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message);
        } else {
          setStatus('error');
          setMessage(res.data.message);
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage('Invalid or expired token. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === 'loading' && (
          <div className="animate-pulse text-blue-500 text-lg font-medium">
            Verifying your email...
          </div>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-800 mb-2">Email Verified Successfully!</h2>
            <p className="text-gray-600">{message}</p>
            <Button variant="link" href="/auth/login"></Button>
          </>
        )}

        {status === 'error' && (
          <>
            <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-medium text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyTokenPage;
