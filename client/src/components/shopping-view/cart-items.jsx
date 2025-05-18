import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

const CartItems = ({ cartItem }) => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	const handleUpdateQty = (getCartItem, type) => {
		dispatch(
			updateCartQuantity({
				userId: user?.id,
				productId: getCartItem?.productId,
				quantity:
					type === "increase"
						? getCartItem?.quantity + 1
						: getCartItem?.quantity - 1,
			})
		).then((data) => {
			if (data?.payload?.success) {
				toast.success("Product quantity updated");
			}
		});
	};

	const handleCartItemDelete = (getCartItem) => {
		dispatch(
			deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
		).then((data) => {
			if (data?.payload?.success) {
				toast.success("Product removed from cart");
			}
		});
	};

	return (
		<div className="flex items-center space-x-4">
			<img
				src={cartItem?.image}
				alt={cartItem?.title}
				className="w-16 h-16 rounded-full"
			/>
			<div className="flex-1">
				<h3 className="font-semibold">{cartItem?.title}</h3>
				<div className="flex items-center mt-2 gap-5">
					<Button
						variant={"outline"}
						size={"icon"}
						className={"w-8 h-8 rounded-full"}
						disabled={cartItem?.quantity === 1}
						onClick={() => handleUpdateQty(cartItem, "decrease")}
					>
						<Minus className="w-4 h-4" />
						<span className="sr-only">Decrease</span>
					</Button>
					<span className="font-semibold">{cartItem?.quantity}</span>
					<Button
						variant={"outline"}
						size={"icon"}
						className={"w-8 h-8 rounded-full"}
						onClick={() => handleUpdateQty(cartItem, "increase")}
					>
						<Plus className="w-4 h-4" />
						<span className="sr-only">Increase</span>
					</Button>
				</div>
			</div>
			<div className="flex flex-col items-end">
				<p className="font-semibold">
					$
					{(
						(cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
						cartItem?.quantity
					).toFixed(2)}
				</p>
				<Trash2
					onClick={() => handleCartItemDelete(cartItem)}
					className="cursor-pointer mt-1 text-red-600"
					size={20}
				/>
			</div>
		</div>
	);
};

export default CartItems;
