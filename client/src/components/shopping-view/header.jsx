import { HomeIcon, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import CartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";

// import { Avatar, AvatarFallback } from "../ui/avatar";

const MenuItems = () => {
	return (
		<nav className="flex flex-col lg:flex-row mb-3 lg:mb-0 lg:items-center gap-4 p-6">
			{shoppingViewHeaderMenuItems.map((item) => (
				<Link key={item.id} to={item.path} className="text-sm font-medium">
					<span>{item.label}</span>
				</Link>
			))}
		</nav>
	);
};

const HeaderRightContent = () => {
	const [openCartSheet, setOpenCartSheet] = useState(false);
	const { user } = useSelector((state) => state.auth);
	const { cartItems } = useSelector((state) => state.shopCart);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/auth/login");
	};

	useEffect(() => {
		dispatch(fetchCartItems(user?.id));
	}, [dispatch]);

	return (
		<div className="flex flex-col lg:flex-row lg:items-center gap-4 p-6">
			<Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
				<Button
					onClick={() => setOpenCartSheet(true)}
					variant="outline"
					size="icon"
				>
					<ShoppingCart className="h-6 w-6" />
					<span className="sr-only">cart</span>
				</Button>
				<CartWrapper
					cartItems={
						cartItems && cartItems.items && cartItems.items.length > 0
							? cartItems.items
							: []
					}
				/>
			</Sheet>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar className="bg-black">
						<AvatarFallback className="bg-black text-white font-extrabold">
							{user?.userName[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>
						Logged in as{" "}
						<span className="font-bold uppercase">{user?.userName}</span>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => navigate("/shop/account")}>
						<UserCog className="mr-2 h-4 w-4" />
						Account
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

const ShoppingHeader = () => {
	const { isAuthenticated } = useSelector((state) => state.auth);
	return (
		<header className="sticky top-0 z-40 w-full bg-background border-b">
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				<Link to="/shop/home" className="flex items-center gap-2">
					<HomeIcon className="h-6 w-6" />
					<span className="font-bold">Ecommerce</span>
				</Link>
				<Sheet>
					<SheetTrigger>
						<span className="lg:hidden">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle header menu</span>
						</span>
					</SheetTrigger>
					<SheetContent side="left" className="w-full max-w-xs">
						<MenuItems />
						<HeaderRightContent />
					</SheetContent>
				</Sheet>
				<div className="hidden lg:block">
					<MenuItems />
				</div>
				<div className="hidden lg:block">
					<HeaderRightContent />
				</div>
			</div>
		</header>
	);
};

export default ShoppingHeader;
