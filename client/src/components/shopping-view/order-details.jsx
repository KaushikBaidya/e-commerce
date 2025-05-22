import React from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { useSelector } from "react-redux";

const ShoppingOrderDetails = ({ orderDetails }) => {
	const { user } = useSelector((state) => state.auth);

	console.log(orderDetails);

	return (
		<div className="w-full capitalize">
			<div className="grid gap-6">
				<div className="grid gap-2">
					<div className="flex items-center justify-between mt-6">
						<p className="font-medium">Order ID</p>
						<Label># {orderDetails?._id}</Label>
					</div>
					<div className="flex items-center justify-between mt-2">
						<p className="font-medium">Order Date</p>
						<Label>{orderDetails?.orderDate.split("T")[0]}</Label>
					</div>
					<div className="flex items-center justify-between mt-2">
						<p className="font-medium">Order Price</p>
						<Label>৳ {orderDetails?.totalAmount}</Label>
					</div>

					<div className="flex items-center justify-between mt-2">
						<p className="font-medium">Order Status</p>
						<Label
							className={`py-1 px-3 ${
								orderDetails?.orderStatus === "confirmed"
									? "bg-blue-400"
									: orderDetails?.orderStatus === "pending"
									? "bg-yellow-400"
									: orderDetails?.orderStatus === "in-progress"
									? "bg-orange-500"
									: orderDetails?.orderStatus === "shipped"
									? "bg-purple-500"
									: orderDetails?.orderStatus === "cancelled"
									? "bg-red-500"
									: orderDetails?.orderStatus === "delivered"
									? "bg-green-500"
									: orderDetails?.orderStatus === "rejected"
									? "bg-red-600"
									: "bg-gray-600"
							}`}
						>
							{orderDetails?.orderStatus}
						</Label>
					</div>
					<div className="flex items-center justify-between mt-2">
						<p className="font-medium">Payment Status</p>
						<Label>{orderDetails?.paymentStatus}</Label>
					</div>
				</div>
				<Separator />
				<div className="grid gap-4">
					<div className="grid gap-2">
						<div className="font-medium text-lg text-center">Order Details</div>
						<Separator />
						<ul className="grid gap-3">
							{/* Header Row */}
							<li className="grid grid-cols-3 gap-3 font-semibold border-b pb-2">
								<span className="text-center">Product</span>
								<span className="text-center">Quantity</span>
								<span className="text-center">Price</span>
							</li>

							{/* Item Rows */}
							{orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
								orderDetails.cartItems.map((item, index) => (
									<li
										key={index}
										className="grid grid-cols-3 gap-3 justify-items-center border-b py-1"
									>
										<span className="capitalize">{item.title}</span>
										<span>{item.quantity}</span>
										<span>৳ {item.price}</span>
									</li>
								))
							) : (
								<li className="text-center col-span-3 text-gray-500">
									No items found.
								</li>
							)}
						</ul>
					</div>
				</div>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<div className="font-semibold">Shipping Address</div>
						<div className="grid grid-cols-3 gap-1 text-muted-foreground capitalize">
							<span>{user.userName}</span>
							<span>{orderDetails?.addressInfo?.address}</span>
							<span>{orderDetails?.addressInfo?.city}</span>
							<span>{orderDetails?.addressInfo?.pincode}</span>
							<span>{orderDetails?.addressInfo?.phone}</span>
							<span>{orderDetails?.addressInfo?.notes}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShoppingOrderDetails;
