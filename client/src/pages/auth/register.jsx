import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import GoogleLoginButton from "./google-login-button";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";

const registerValidationSchema = Yup.object({
	userName: Yup.string().required("User Name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string()
		.required("Password is required")
		.min(6, "Password must be at least 6 characters")
		.matches(
			/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])/,
			"Password must contain at least one letter and one special character"
		),
});

const initialState = {
	userName: "",
	email: "",
	password: "",
};

const AuthRegister = () => {
	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await registerValidationSchema.validate(formData, { abortEarly: false });
			setErrors({});

			const result = await dispatch(registerUser(formData));

			if (result?.payload?.success) {
				toast.success(result.payload.message, {
					action: {
						label: <XIcon />,
					},
				});

				navigate("/auth/login");
			} else {
				toast.error(result.payload.message, {
					action: {
						label: <XIcon />,
					},
				});
			}
		} catch (validationError) {
			if (validationError.inner) {
				const formattedErrors = {};
				validationError.inner.forEach((err) => {
					formattedErrors[err.path] = err.message;
				});
				setErrors(formattedErrors);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto w-full max-w-md space-y-6">
			<div className="text-center">
				<h1 className="text-4xl font-extrabold tracking-tight text-foreground">
					Register
				</h1>
				<p className="mt-2">
					Already have an account?
					<Link
						className="font-medium text-primary ml-2 hover:underline"
						to="/auth/login"
					>
						Login
					</Link>
				</p>
			</div>

			<CommonForm
				formControls={registerFormControls}
				buttonText={"Create Account"}
				formData={formData}
				setFormData={setFormData}
				onSubmit={onSubmit}
				isBtnDisabled={isSubmitting}
				errors={errors}
			/>

			<div className="flex items-center gap-4 my-6">
				<Separator className="flex-1" />
				<span className="text-gray-500 text-sm">Or</span>
				<Separator className="flex-1" />
			</div>

			<div className="w-full flex flex-col justify-center gap-5">
				<GoogleLoginButton />
				<Link
					className="font-medium text-center text-primary mt-8 hover:underline"
					to="/"
				>
					Go home
				</Link>
			</div>
		</div>
	);
};

export default AuthRegister;
