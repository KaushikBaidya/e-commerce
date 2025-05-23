import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
	userName: "",
	email: "",
	password: "",
};

const AuthRegister = () => {
	const [formData, setFormData] = useState(initialState);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = (e) => {
		e.preventDefault();
		dispatch(registerUser(formData)).then((data) => {
			if (data?.payload?.success) {
				toast.success(data?.payload?.message, {
					action: {
						label: "X",
					},
				});
				navigate("/auth/login");
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
					Register
				</h1>
				<p className="mt-2 ">
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
			/>
			<Link className="font-medium text-primary mt-8 hover:underline" to="/">
				Go home
			</Link>
		</div>
	);
};

export default AuthRegister;
