import React, { useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";

const initialFormData = {
	status: "",
};

const AdminOrderDetails = () => {
	const [formData, setFormData] = useState(initialFormData);
	const handleUpdateStatus = (event) => {
		event.preventDefault();
	};
	return (
		<div className="max-w-[800px]">
			<div className="grid gap-6">
				<div className="grid gap-2">
					<div className="flex items-center justify-between mt-6">
						<p className="font-medium">Order Id</p>
						<Label>#1234</Label>
					</div>
					<div className="flex items-center justify-between mt-2">
						<p className="font-medium">Order Date</p>
						<Label>12/05/2025</Label>
					</div>
					<div className="flex items-center justify-between mt-2">
						<p className="font-medium">Order Price</p>
						<Label>$ 1000</Label>
					</div>
					<div className="flex items-center justify-between mt-2">
						<p className="font-medium">Order Status</p>
						<Label>In Progress</Label>
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
							<span>John Doe</span>
							<span>123 Main St</span>
							<span>Anytown, USA</span>
							<span>12345</span>
							<span>(123) 456-7890</span>
							<span>In front of the store</span>
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
						buttonText="Update"
						onSubmit={handleUpdateStatus}
					/>
				</div>
			</div>
		</div>
	);
};

export default AdminOrderDetails;
