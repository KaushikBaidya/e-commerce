import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import CommonForm from '@/components/common/common-form-component';
import { Separator } from '@/components/ui/separator';
import { registerFormControls } from '@/config';
import { registerUser } from '@/store/auth-slice';
import GoogleLoginButton from './google-login-button';

const registerValidationSchema = Yup.object({
  userName: Yup.string().required('User Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])/,
      'Password must contain at least one letter and one special character'
    ),
});

const AuthRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      userName: '',
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

  const onSubmit = async (formData) => {
    try {
      const result = await dispatch(registerUser(formData));

      if (result?.payload?.success) {
        toast.success(result.payload.message, {
          action: { label: 'close' },
        });
        reset();
        navigate('/verify-email');
      } else {
        toast.error(result.payload?.message || 'Registration failed', {
          action: { label: 'close' },
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration', {
        action: { label: 'close' },
      });
    }
  };

  const onError = (errors) => {
    console.log('Form validation errors:', errors);

    Object.values(errors).forEach((error) => {
      if (error?.message) {
        toast.error(error.message, {
          action: { label: 'close' },
        });
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Register</h1>
        <p className="mt-2">
          Already have an account?
          <Link className="font-medium text-primary ml-2 hover:underline" to="/auth/login">
            Login
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={registerFormControls}
        methods={methods}
        onSubmit={handleSubmit(onSubmit, onError)}
        buttonText="Create Account"
        isBtnDisabled={isSubmitting}
      />

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

export default AuthRegister;
