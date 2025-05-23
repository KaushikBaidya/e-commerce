import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
	email: "",
	password: "",
};

const AuthLogin = () => {
	const [formData, setFormData] = useState(initialState);
	const dispatch = useDispatch();
	const onSubmit = (e) => {
		e.preventDefault();

		dispatch(loginUser(formData)).then((data) => {
			if (data?.payload?.success) {
				toast.success(data?.payload?.message, {
					action: {
						label: "X",
					},
				});
			} else {
				toast.error(data?.payload?.message, {
					action: {
						label: "X",
					},
				});
			}
		});
	};
	return (
		<div className="mx-auto w-full max-w-md space-y-6">
			<div className="txt-center">
				<h1 className="text-4xl font-extrabold tracking-tight text-foreground">
					Login
				</h1>
				<p className="mt-2 ">
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
			/>

			<div className="flex flex-col justify-center gap-5">
				<div className="text-center">For Demonstrations Purpose</div>
				<div>
					<h2 className="font-bold">Admin Credentials</h2>
					<p>email : admin@email.com</p>
					<p>password : 123456789</p>
				</div>
				<div>
					<h2 className="font-bold">User Credentials</h2>
					<p>email : newname@email.com</p>
					<p>password : 123456789</p>
				</div>
				<Link className="font-medium text-primary mt-8 hover:underline" to="/">
					Go home
				</Link>
			</div>
		</div>
	);
};

export default AuthLogin;
