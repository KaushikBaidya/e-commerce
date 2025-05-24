import React, { useEffect, useState } from "react";
import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { Label } from "../ui/label";

import logo from "@/assets/logo.png";

const MenuItems = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const handleNavigate = (getCurrentItem) => {
		sessionStorage.removeItem("filters");
		const currentFilter =
			getCurrentItem.id !== "home"
				? getCurrentItem.id !== "products" &&
				  getCurrentItem.id !== "auction" &&
				  getCurrentItem.id !== "search" && {
						category: [getCurrentItem.id],
				  }
				: null;

		sessionStorage.setItem("filters", JSON.stringify(currentFilter));

		location.pathname.includes("filters") && currentFilter !== null
			? setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`))
			: navigate(getCurrentItem.path);
	};

	return (
		<nav className="flex flex-col lg:flex-row mb-3 lg:mb-0 lg:items-center gap-5 p-6">
			{shoppingViewHeaderMenuItems.map((item) => (
				<Label
					onClick={() => handleNavigate(item)}
					key={item.id}
					className="text-base cursor-pointer"
				>
					<span>{item.label}</span>
				</Label>
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
			{/* <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
				<Button
					onClick={() => setOpenCartSheet(true)}
					variant="outline"
					size="icon"
				>
					<ShoppingCart className="h-6 w-6" />
					<span className="sr-only">cart</span>
				</Button>
				<CartWrapper
					setOpenCartSheet={setOpenCartSheet}
					cartItems={
						cartItems && cartItems.items && cartItems.items.length > 0
							? cartItems.items
							: []
					}
				/>
			</Sheet> */}
			{user === null ? (
				<Link to="/auth/login">
					<Button variant="outline">Login</Button>
				</Link>
			) : (
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
			)}
		</div>
	);
};

const ShoppingHeader = () => {
	return (
		<header className="fixed top-0 z-40 w-full bg-background border-b">
			<div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
				<div className="flex items-center">
					<Link to="/" className="flex items-center gap-2">
						<img src={logo} alt="logo" className="h-8 w-8" />
						<span className="font-bold uppercase text-xl">Galería</span>
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
				</div>
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
