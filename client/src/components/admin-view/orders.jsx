import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { View } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import AdminOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";

import {
	getAllOrdersForAdmin,
	resetOrderDetails,
	fetchOrderDetailsForAdmin,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import NoItemFound from "../common/no-item-found";

const AdminOrdersList = () => {
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
	const dispatch = useDispatch();
	const { orderList, orderDetails } = useSelector((state) => state.adminOrder);

	function handleFetchOrderDetails(getId) {
		dispatch(fetchOrderDetailsForAdmin(getId));
	}

	useEffect(() => {
		dispatch(getAllOrdersForAdmin());
	}, [dispatch]);

	useEffect(() => {
		if (orderDetails !== null) setOpenDetailsDialog(true);
	}, [orderDetails]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold pt-4 px-2">
					All Orders
				</CardTitle>
			</CardHeader>
			<CardContent>
				{orderList && orderList.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order Id</TableHead>
								<TableHead>Order Date</TableHead>
								<TableHead>Order Status</TableHead>
								<TableHead>Order Price</TableHead>
								<TableHead>
									<span className="sr-only">Details</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orderList.map((order) => (
								<TableRow>
									<TableCell> @_{order?._id}</TableCell>
									<TableCell>{order?.orderDate.split("T")[0]} </TableCell>
									<TableCell>
										<Badge
											className={`py-1 px-3 ${
												order?.orderStatus === "confirmed"
													? "bg-blue-400"
													: order?.orderStatus === "pending"
													? "bg-yellow-400"
													: order?.orderStatus === "in-progress"
													? "bg-orange-500"
													: order?.orderStatus === "shipped"
													? "bg-purple-500"
													: order?.orderStatus === "cancelled"
													? "bg-red-500"
													: order?.orderStatus === "delivered"
													? "bg-green-500"
													: order?.orderStatus === "rejected"
													? "bg-red-600"
													: "bg-gray-600"
											}`}
										>
											{order?.orderStatus}
										</Badge>
									</TableCell>
									<TableCell> ৳ {order?.totalAmount} </TableCell>
									<TableCell className="flex justify-end">
										<Dialog
											open={openDetailsDialog}
											onOpenChange={() => {
												setOpenDetailsDialog(false);
												dispatch(resetOrderDetails());
											}}
										>
											<DialogTrigger asChild>
												<Button
													onClick={() => handleFetchOrderDetails(order?._id)}
												>
													<View className="mr-2" /> View Details
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-[90vw] sm:max-w[80vw] lg:max-w-[50vw]">
												<AdminOrderDetails orderDetails={orderDetails} />
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<NoItemFound />
				)}
			</CardContent>
		</Card>
	);
};

export default AdminOrdersList;
