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

import { useDispatch, useSelector } from "react-redux";

import { fetchAuctionItems } from "@/store/shop/auction-slice";

const MyBids = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { auctionItems } = useSelector((state) => state.shopAuction);

	useEffect(() => {
		dispatch(fetchAuctionItems(user?.id));
	}, [dispatch]);

	console.log(auctionItems);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold pt-4 px-2">
					My Bid History
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Artwork</TableHead>
							<TableHead>Your Bid</TableHead>
							<TableHead>Current Bid</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>
								<span className="sr-only">Details</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{auctionItems.length ? (
							auctionItems.map((item) => {
								const isLeading = item.userBid >= item.currentBid;
								return (
									<TableRow key={item.id}>
										<TableCell className="flex items-center gap-3">
											<img
												src={item.image}
												alt={item.title}
												className="h-10 w-10 object-cover rounded-md border"
											/>
											<span>{item.title}</span>
										</TableCell>
										<TableCell>৳ {item.userBid.toLocaleString()}</TableCell>
										<TableCell>৳ {item.currentBid.toLocaleString()}</TableCell>
										<TableCell>
											<span
												className={`font-medium ${
													isLeading ? "text-green-600" : "text-red-500"
												}`}
											>
												{isLeading ? "Leading" : "Outbid"}
											</span>
										</TableCell>
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={4} className="text-center text-gray-500">
									You haven't placed any bids yet.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default MyBids;
