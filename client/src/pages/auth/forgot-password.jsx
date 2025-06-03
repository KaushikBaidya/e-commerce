import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import ForgottonePassword from '../../assets/undraw_forgot-password_odai.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        email,
      });
      toast.success(res.data.message || 'Reset link sent successfully!', {
        action: {
          label: 'close',
        },
      });
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.', {
        action: {
          label: 'close',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 place-items-center min-h-[60vh] p-5">
      <div>
        <img
          src={ForgottonePassword}
          alt="Forgot Password"
          className="hidden lg:block w-full h-auto max-w-md mx-auto"
        />
      </div>
      <div>
        <div className="flex flex-col items-start gap-2 mb-6">
          <h2 className="text-2xl font-medium">Forgot Password?</h2>
          <p>Enter your email address to receive a link to reset your password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
