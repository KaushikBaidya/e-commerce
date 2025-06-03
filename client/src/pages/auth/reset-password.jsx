import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Password from '../../assets/undraw_secure-login_m11a.svg';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', {
        action: {
          label: 'close',
        },
      });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password/${token}`,
        { password }
      );
      toast.success(res.data.message || 'Password reset successful!', {
        action: {
          label: 'close',
        },
      });
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/auth/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.', {
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
        <img src={Password} alt="" className="hidden lg:block w-full h-auto max-w-md mx-auto" />
      </div>

      <div className="w-full flex flex-col p-5">
        <h2 className="text-2xl font-semibold mb-6">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
              className="w-full px-4 py-2 border rounded"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 border rounded"
            />
            <span
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
