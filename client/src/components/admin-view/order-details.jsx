import React, { useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllOrdersForAdmin,
	updateOrderStatus,
} from "@/store/admin/order-slice";
import { fetchOrderDetailsForAdmin } from "@/store/admin/order-slice";

const initialFormData = {
	status: "",
};

const AdminOrderDetails = ({ orderDetails }) => {
	const [formData, setFormData] = useState(initialFormData);
	const { user } = useSelector((state) => state.auth);

	const dispatch = useDispatch();

	const handleUpdateStatus = (event) => {
		event.preventDefault();

		const { status } = formData;

		dispatch(
			updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
		).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchOrderDetailsForAdmin(orderDetails?._id));
				dispatch(getAllOrdersForAdmin());
				setFormData(initialFormData);
				toast.success(data?.payload?.message, {
					action: {
						label: "X",
					},
				});
			}
		});
	};
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
						<div className="font-semibold">Order details</div>
						<ul className="grid gap-3">
							<li className="flex items-center justify-between">
								<span>Product</span> <span>Quantity</span>
								<span>Price</span>
							</li>
						</ul>
					</div>
				</div>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<div className="font-semibold">Shipping Address</div>
						<div className="grid grid-cols-2 gap-1 text-muted-foreground">
							<span>{user.userName}</span>
							<span>{orderDetails?.addressInfo?.address}</span>
							<span>{orderDetails?.addressInfo?.city}</span>
							<span>{orderDetails?.addressInfo?.pincode}</span>
							<span>{orderDetails?.addressInfo?.phone}</span>
							<span>{orderDetails?.addressInfo?.notes}</span>
						</div>
					</div>
				</div>

				<div>
					<CommonForm
						formControls={[
							{
								label: "Order Status",
								name: "status",
								componentType: "select",
								options: [
									{ id: "pending", label: "Pending" },
									{ id: "in-progress", label: "In Progress" },
									{ id: "shipped", label: "Shipped" },
									{ id: "cancelled", label: "Cancelled" },
									{ id: "delivered", label: "Delivered" },
								],
							},
						]}
						formData={formData}
						setFormData={setFormData}
						buttonText="Update Status"
						onSubmit={handleUpdateStatus}
					/>
				</div>
			</div>
		</div>
	);
};

export default AdminOrderDetails;
