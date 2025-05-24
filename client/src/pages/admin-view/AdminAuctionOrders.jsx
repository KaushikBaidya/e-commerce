import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getAllAuctionOrdersForAdmin } from "@/store/admin/order-slice";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

const AdminAuctionOrders = () => {
	const { orderList } = useSelector((state) => state.adminOrder);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllAuctionOrdersForAdmin());
	}, [dispatch]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold pt-4 px-2">
					Auction Orders List
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>Image</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>User ID</TableHead>
							<TableHead>Payment</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orderList && orderList.length > 0 ? (
							orderList.map((order, index) => (
								<TableRow key={order._id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>
										<img
											src={order.image}
											alt={order.title}
											className="w-16 h-16 object-cover rounded"
										/>
									</TableCell>
									<TableCell>{order.title}</TableCell>
									<TableCell>{order.userId}</TableCell>
									<TableCell className="capitalize">
										{order.paymentMethod}
									</TableCell>
									<TableCell>
										<span
											className={`px-2 py-1 rounded text-xs font-medium ${
												order.paymentStatus === "paid"
													? "bg-green-100 text-green-700"
													: "bg-yellow-100 text-yellow-700"
											}`}
										>
											{order.paymentStatus}
										</span>
									</TableCell>
									<TableCell>${order.totalAmount}</TableCell>
									<TableCell>
										{format(new Date(order.orderDate), "PPpp")}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-4">
									No auction orders found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default AdminAuctionOrders;

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table } from "@/components/ui/table";
// import { getAllAuctionOrdersForAdmin } from "@/store/admin/order-slice";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const AdminAuctionOrders = () => {
// 	const { orderList } = useSelector((state) => state.adminOrder);
// 	const dispatch = useDispatch();

// 	console.log("======>", orderList);

// 	useEffect(() => {
// 		dispatch(getAllAuctionOrdersForAdmin());
// 	}, [dispatch]);
// 	return (
// 		<Card>
// 			<CardHeader>
// 				<CardTitle className="text-xl font-semibold pt-4 px-2">
// 					Auction Orders List
// 				</CardTitle>
// 			</CardHeader>
// 			<CardContent>
// 				<Table></Table>
// 			</CardContent>
// 		</Card>
// 	);
// };

// export default AdminAuctionOrders;
