import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";

const ShoppingLayout = () => {
	return (
		<div className="flex flex-col bg-white overflow-hidden">
			<ShoppingHeader />
			<main className="flex flex-col w-full py-16">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default ShoppingLayout;
