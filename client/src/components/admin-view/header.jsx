import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { AlignJustify, Bell, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "recharts";
import { fetchAdminNotifications } from "@/store/admin/notification-slice";
import { Separator } from "../ui/separator";

const AdminHeader = ({ setOpen }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);
	const { notifications, isLoading } = useSelector(
		(state) => state.adminNotifications
	);

	console.log("Admin Notifications: ", notifications);

	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/auth/login");
	};

	useEffect(() => {
		if (user !== null) dispatch(fetchAdminNotifications());
	}, [dispatch, user]);

	return (
		<header className="flex items-center justify-between px-4 py-3 bg-background border-b">
			<Button onClick={() => setOpen(true)} className={"lg:hidden sm:block"}>
				<AlignJustify />
				<span className="sr-only">Admin Panel</span>
			</Button>
			<div className="flex flex-1 justify-end gap-6">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<div className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer">
							<Bell size={25} />
							<Label className="sr-only">Notifications</Label>
							{notifications.length > 0 ? (
								<span className="absolute top-[-5px] right-[-10px] font-bold text-sm bg-black text-white rounded-full px-2">
									{notifications.length}
								</span>
							) : (
								""
							)}
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
						<DropdownMenuLabel>Notifications</DropdownMenuLabel>
						{isLoading ? (
							<DropdownMenuItem>Loading...</DropdownMenuItem>
						) : notifications.length > 0 ? (
							notifications.map((notification, index) => (
								<DropdownMenuItem
									className="flex flex-col gap-2 text-sm"
									key={index}
								>
									{notification.message}
									<Separator />
								</DropdownMenuItem>
							))
						) : (
							<DropdownMenuItem>No notifications</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>

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
