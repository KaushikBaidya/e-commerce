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
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CircleCheckBig } from "lucide-react";
import { fetchAllAuctionProducts } from "@/store/shop/auction-products-slice";

const MyBids = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);

	const { auctionItems } = useSelector((state) => state.shopAuction);
	const { auctionProductList } = useSelector(
		(state) => state.shopAuctionProducts
	);

	console.log(auctionProductList, "auctionProductList");

	const canCheckout = (id) => {
		const product = auctionProductList.find((p) => p._id === id);
		if (!product) return false;
		const auctionEnded = new Date(product.endTime) < new Date();
		const isWinner = product.highestBidder === user?.id;
		return auctionEnded && isWinner;
	};

	const handleNavigate = (id) => {
		navigate(`/auction/checkout`);
	};

	useEffect(() => {
		dispatch(fetchAuctionItems(user?.id));
		dispatch(fetchAllAuctionProducts());
	}, [dispatch]);

	console.log(auctionItems, "auctionItems");

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
								<span className="sr-only">Action</span>
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
										<TableCell className="flex justify-end">
											{canCheckout(item.id) && (
												<Button onClick={() => handleNavigate(item.id)}>
													<CircleCheckBig className="mr-1" /> Checkout
												</Button>
											)}
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
