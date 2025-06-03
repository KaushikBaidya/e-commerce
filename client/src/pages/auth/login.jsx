import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import CommonForm from '@/components/common/common-form-component';
import { Separator } from '@/components/ui/separator';
import { loginFormControls } from '@/config';
import { loginUser } from '@/store/auth-slice';
import GoogleLoginButton from './google-login-button';

const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onError = (errors) => {
    console.log('Validation errors:', errors);
  };

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data));

      if (result?.payload?.success) {
        toast.success(result.payload.message, { action: { label: 'close' } });
        // navigate('/');
      } else {
        toast.error(result.payload?.message || 'Login failed', {
          action: { label: 'close' },
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login', {
        action: { label: 'close' },
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="flex flex-col justify-start gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Login</h1>
        <p className="mt-2">
          Don't have an account?
          <Link className="font-medium text-primary ml-2 hover:underline" to="/auth/register">
            Register
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={loginFormControls}
        methods={methods}
        onSubmit={handleSubmit(onSubmit, onError)}
        isBtnDisabled={isSubmitting}
        buttonText="Sign in"
      />

      <Link to="/forgot-password" className="text-sm hover:underline pt-4">
        Forgot Password
      </Link>

      <div className="flex items-center gap-4 my-6">
        <Separator className="flex-1" />
        <span className="text-gray-500 text-sm">Or</span>
        <Separator className="flex-1" />
      </div>

      <div className="w-full flex flex-col justify-center gap-5">
        <GoogleLoginButton />
        <Link className="font-medium text-center text-primary mt-8 hover:underline" to="/">
          Go home
        </Link>
      </div>
    </div>
  );
};

export default AuthLogin;
