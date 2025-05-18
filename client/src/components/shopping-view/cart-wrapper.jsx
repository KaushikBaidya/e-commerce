import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";

const CartWrapper = () => {
	return (
		<SheetContent className="sm:max-w-md px-4">
			<SheetHeader>
				<SheetTitle className="text-pretty text-xl">Your Cart</SheetTitle>
			</SheetHeader>
			<div className="mt-8 space-y-4"></div>
			<div className="mt-8 space-y-4">
				<div className="flex justify-between">
					<span className="font-bold">Total Amount</span>
					<span className="font-bold">$1050</span>
				</div>
			</div>
			<Button className="w-full mt-6">Checkout</Button>
		</SheetContent>
	);
};

export default CartWrapper;
