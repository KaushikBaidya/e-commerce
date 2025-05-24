import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import Address from "@/components/shopping-view/address";
import { createNewOrder } from "@/store/shop/auction-checkout-slice";
import { fetchAllAuctionProducts } from "@/store/shop/auction-products-slice";

const AuctionCheckout = () => {
	const dispatch = useDispatch();
	const { id: auctionId } = useParams();
	const { user } = useSelector((state) => state.auth);
	const { checkoutUrl } = useSelector((state) => state.auctionCheckout);
	const { auctionProductList } = useSelector(
		(state) => state.shopAuctionProducts
	);

	const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
	const [isPaymentStart, setIsPaymentStart] = useState(false);

	const auctionItem = auctionProductList.find((p) => p._id === auctionId);

	useEffect(() => {
		dispatch(fetchAllAuctionProducts());
	}, [dispatch]);

	useEffect(() => {
		if (checkoutUrl) {
			window.location.href = checkoutUrl;
		}
	}, [checkoutUrl]);

	const handleAuctionCheckout = () => {
		if (!auctionItem) {
			toast("Auction item not found.");
			return;
		}

		if (!currentSelectedAddress) {
			toast("Please select a shipping address.");
			return;
		}

		if (auctionItem.highestBidder !== user?.id) {
			toast("You are not the highest bidder for this item.");
			return;
		}

		const orderData = {
			userId: user?.id,
			addressInfo: {
				addressId: currentSelectedAddress._id,
				address: currentSelectedAddress.address,
				city: currentSelectedAddress.city,
				pincode: currentSelectedAddress.pincode,
				phone: currentSelectedAddress.phone,
				notes: currentSelectedAddress.notes,
			},
			auctionProductId: auctionItem._id,
			orderStatus: "pending",
			paymentMethod: "stripe",
			paymentStatus: "unpaid",
			orderDate: new Date(),
		};

		dispatch(createNewOrder(orderData)).then((res) => {
			if (res?.payload?.success) {
				setIsPaymentStart(true);
			}
		});
	};

	if (!auctionItem) {
		return (
			<div className="p-5">
				<p className="text-center text-gray-500">Loading auction item...</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-6 p-5">
			<div>
				<h3 className="text-lg font-semibold mb-2">Select Shipping Address</h3>
				<Address
					selectedId={currentSelectedAddress}
					setCurrentSelectedAddress={setCurrentSelectedAddress}
				/>
			</div>
			<div className="flex flex-col items-center gap-4">
				<img
					src={auctionItem.image}
					alt={auctionItem.title}
					className="w-full h-full object-cover rounded border"
				/>
				<div>
					<h2 className="text-2xl font-semibold">{auctionItem.title}</h2>
					<p className="text-xl text-green-600">
						Winning Bid: ৳ {auctionItem.currentBid.toLocaleString()}
					</p>
				</div>
				<Button onClick={handleAuctionCheckout} className="w-full mt-4">
					<CreditCard className="mr-2" />
					{isPaymentStart ? "Redirecting to Stripe..." : "Pay Now with Stripe"}
				</Button>
			</div>
		</div>
	);
};

export default AuctionCheckout;
