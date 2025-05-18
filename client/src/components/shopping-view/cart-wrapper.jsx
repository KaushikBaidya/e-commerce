import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import CartItems from "./cart-items";
import { ShoppingBasket } from "lucide-react";

const CartWrapper = ({ cartItems }) => {
	const totalCartAmount =
		cartItems && cartItems.length > 0
			? cartItems.reduce(
					(sum, currentItem) =>
						sum +
						(currentItem?.salePrice > 0
							? currentItem?.salePrice
							: currentItem?.price) *
							currentItem?.quantity,
					0
			  )
			: 0;
	return (
		<SheetContent className="sm:max-w-md">
			<SheetHeader>
				<SheetTitle className="text-pretty text-xl">Your Cart</SheetTitle>
			</SheetHeader>
			<div className="mt-2 space-y-4 px-5">
				{cartItems && cartItems.length > 0 ? (
					cartItems.map((item, index) => (
						<CartItems key={index} cartItem={item} />
					))
				) : (
					<div className="flex flex-col items-center justify-center">
						<ShoppingBasket className="w-12 h-12" size={30} />
						<p>Your cart is empty</p>
					</div>
				)}
			</div>
			<div className="mt-8 space-y-4 px-5">
				<div className="flex justify-between">
					<span className="font-bold">Total Amount</span>
					<span className="font-bold">${totalCartAmount}</span>
				</div>
			</div>
			<div className="px-4 mt-4">
				<Button className="w-full">Checkout</Button>
			</div>
		</SheetContent>
	);
};

export default CartWrapper;
