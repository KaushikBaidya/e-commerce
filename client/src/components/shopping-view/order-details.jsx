import React from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";

const ShoppingOrderDetails = () => {
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
			</div>
		</div>
	);
};

export default ShoppingOrderDetails;
