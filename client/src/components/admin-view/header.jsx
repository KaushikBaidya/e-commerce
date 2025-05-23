import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, Bell, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setOpen }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/auth/login");
	};

	return (
		<header className="flex items-center justify-between px-4 py-3 bg-background border-b">
			<Button onClick={() => setOpen(true)} className={"lg:hidden sm:block"}>
				<AlignJustify />
				<span className="sr-only">Admin Panel</span>
			</Button>
			<div className="flex flex-1 justify-end gap-2">
				<Button variant={"ghost"}>
					<Bell size={30} />
				</Button>
				<Button
					onClick={handleLogout}
					className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow"
				>
					<LogOut />
					logout
				</Button>
			</div>
		</header>
	);
};

export default AdminHeader;
