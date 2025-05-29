import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GoogleLoginButton from "./google-login-button";
import { Separator } from "@/components/ui/separator";
import * as Yup from "yup";

const loginValidationSchema = Yup.object({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string()
		.required("Password is required")
		.min(6, "Password must be at least 6 characters"),
});

const initialState = {
	email: "",
	password: "",
};

const AuthLogin = () => {
	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await loginValidationSchema.validate(formData, { abortEarly: false });
			setErrors({});

			const result = await dispatch(loginUser(formData));

			if (result?.payload?.success) {
				toast.success(result.payload.message, {
					action: {
						label: "close",
					},
				});
				navigate("/");
			} else {
				toast.error(result.payload.message || "Login failed", {
					action: {
						label: "close",
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
			<div className="flex flex-col justify-start gap-2">
				<h1 className="text-4xl font-extrabold tracking-tight text-foreground">
					Login
				</h1>
				<p className="mt-2">
					Don't have an account?
					<Link
						className="font-medium text-primary ml-2 hover:underline"
						to="/auth/register"
					>
						Register
					</Link>
				</p>
			</div>

			<CommonForm
				formControls={loginFormControls}
				buttonText={"Sign in"}
				formData={formData}
				setFormData={setFormData}
				onSubmit={onSubmit}
				isBtnDisabled={isSubmitting}
				errors={errors}
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

export default AuthLogin;
