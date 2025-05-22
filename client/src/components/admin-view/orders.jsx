import React, { useState } from "react";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import AdminOrderDetails from "./order-details";

const AdminOrdersList = () => {
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold pt-4 px-2">
					All Orders
				</CardTitle>
			</CardHeader>
			<CardContent>
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
						<TableRow>
							<TableCell> @_45d5d58ffsfers </TableCell>
							<TableCell> 01/25/2023 </TableCell>
							<TableCell> Delivered </TableCell>
							<TableCell> $ 1,000 </TableCell>
							<TableCell className="flex justify-end">
								<Dialog
									open={openDetailsDialog}
									onOpenChange={setOpenDetailsDialog}
								>
									<DialogTrigger asChild>
										<Button>
											<View className="mr-2" /> View Details
										</Button>
									</DialogTrigger>
									<DialogContent>
										<AdminOrderDetails />
									</DialogContent>
								</Dialog>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default AdminOrdersList;
