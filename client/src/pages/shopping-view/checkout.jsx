import Address from "@/components/shopping-view/address";
import accImg from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import CartItems from "@/components/shopping-view/cart-items";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";

const ShoppingCheckout = () => {
	const { cartItems } = useSelector((state) => state.shopCart);
	const { user } = useSelector((state) => state.auth);
	const { checkoutUrl } = useSelector((state) => state.shopOrder); // Stripe URL
	const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
	const [isPaymentStart, setIsPaymentStart] = useState(false);
	const dispatch = useDispatch();

	const totalCartAmount =
		cartItems && cartItems.items && cartItems.items.length > 0
			? cartItems.items.reduce(
					(sum, currentItem) =>
						sum +
						(currentItem?.salePrice > 0
							? currentItem?.salePrice
							: currentItem?.price) *
							currentItem?.quantity,
					0
			  )
			: 0;

	const handleStripeCheckout = () => {
		if (cartItems.items.length === 0) {
			toast("Your cart is empty. Please add items to proceed");
			return;
		}

		if (currentSelectedAddress === null) {
			toast("Please select one address to proceed.");
			return;
		}

		const orderData = {
			userId: user?.id,
			cartId: cartItems?._id,
			cartItems: cartItems.items.map((item) => ({
				productId: item?.productId,
				title: item?.title,
				image: item?.image,
				price: item?.salePrice > 0 ? item?.salePrice : item?.price,
				quantity: item?.quantity,
			})),
			addressInfo: {
				addressId: currentSelectedAddress?._id,
				address: currentSelectedAddress?.address,
				city: currentSelectedAddress?.city,
				pincode: currentSelectedAddress?.pincode,
				phone: currentSelectedAddress?.phone,
				notes: currentSelectedAddress?.notes,
			},
			orderStatus: "pending",
			paymentMethod: "stripe", // updated for Stripe
			paymentStatus: "pending",
			totalAmount: totalCartAmount,
			orderDate: new Date(),
			orderUpdateDate: new Date(),
		};

		dispatch(createNewOrder(orderData)).then((data) => {
			if (data?.payload?.success) {
				setIsPaymentStart(true);
			} else {
				setIsPaymentStart(false);
			}
		});
	};

	// Stripe redirect
	useEffect(() => {
		if (checkoutUrl) {
			window.location.href = checkoutUrl;
		}
	}, [checkoutUrl]);

	return (
		<div className="flex flex-col">
			<div className="relative h-[300px] w-full overflow-hidden">
				<img src={accImg} alt={"cover-image"} />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
				<Address
					selectedId={currentSelectedAddress}
					setCurrentSelectedAddress={setCurrentSelectedAddress}
				/>
				<div className="flex flex-col gap-4">
					{cartItems && cartItems.items && cartItems.items.length > 0
						? cartItems.items.map((item, index) => (
								<CartItems key={index} cartItem={item} />
						  ))
						: null}

					<div className="mt-8 space-y-4">
						<div className="flex justify-between">
							<span className="font-bold">Total</span>
							<span className="font-bold">৳ {totalCartAmount}</span>
						</div>
					</div>

					<div className="mt-4 w-full">
						<Button onClick={handleStripeCheckout} className="w-full">
							<CreditCard />
							{isPaymentStart
								? "Redirecting to Stripe..."
								: "Checkout with Stripe"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShoppingCheckout;
