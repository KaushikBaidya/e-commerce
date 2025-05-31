import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { CalendarDays, Clock, Gavel, RefreshCw, User } from "lucide-react";
import { toast } from "sonner";
import {
	fetchAuctionProductDetails,
	resetAuctionProductDetails,
} from "@/store/shop/auction-products-slice";
import { placeAuctionBid } from "@/store/shop/auction-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

const AuctionDetails = ({ open, setOpen, auctionProductDetails }) => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	const handleDialogClose = () => {
		setOpen(false);
		dispatch(resetAuctionProductDetails());
	};

	const handlePlaceBid = (productId) => {
		if (!user || user.role !== "user") {
			return toast.error("Please login to place bid", {
				action: {
					label: "close",
				},
			});
		}

		const item = auctionProductDetails;
		if (!item)
			return toast.error("No auction item found", {
				action: {
					label: "close",
				},
			});

		if (item.highestBidder === user.id) {
			toast.error("You are already the highest bidder", {
				action: {
					label: "close",
				},
			});
			return;
		}

		const now = new Date();
		if (new Date(item.startTime) > now)
			return toast.error("Auction hasn't started yet", {
				action: {
					label: "close",
				},
			});
		if (new Date(item.endTime) < now)
			return toast.error("Auction has already ended", {
				action: {
					label: "close",
				},
			});

		const nextBid = item.currentBid
			? item.currentBid + item.bidIncrement
			: item.startingBid;

		dispatch(
			placeAuctionBid({
				userId: user.id,
				auctionId: productId,
				bidAmount: nextBid,
			})
		)
			.then((data) => {
				if (data?.payload?.success) {
					dispatch(fetchAuctionProductDetails(auctionProductDetails._id));
					toast.success("Bid placed successfully", {
						action: {
							label: "close",
						},
					});
				} else {
					toast.error("Failed to place bid", {
						action: {
							label: "close",
						},
					});
				}
			})
			.catch(() =>
				toast.error("Something went wrong", {
					action: {
						label: "close",
					},
				})
			);
	};

	if (!auctionProductDetails)
		return <div className="text-center py-20">Loading...</div>;

	return (
		<Dialog open={open} onOpenChange={handleDialogClose}>
			<DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[65vw] max-h-[80vh] overflow-y-auto">
				{/* Image & Bid Button Section */}
				<div className="relative flex flex-col gap-4">
					<div className="relative w-full sm:h-80 md:h-full mt-4">
						<img
							src={auctionProductDetails.image}
							alt={auctionProductDetails.title}
							className="w-full h-[500px] object-cover rounded-md"
						/>
						<div className="absolute top-4 right-4">
							<Badge
								className={`text-white px-3 py-1 rounded-full ${
									auctionProductDetails.isActive ? "bg-green-600" : "bg-red-500"
								}`}
							>
								{auctionProductDetails.isActive ? "Active" : "Inactive"}
							</Badge>
						</div>
					</div>
					<div className="px-4 md:px-0">
						<Button
							onClick={() => handlePlaceBid(auctionProductDetails._id)}
							disabled={!user}
							className="w-full"
						>
							<Gavel />
							{user ? `Place Bid` : `Register to Bid`}
						</Button>
					</div>
				</div>

				{/* Details Section */}
				<div className="p-4 space-y-5">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
						<DialogTitle className="text-2xl md:text-3xl font-bold">
							{auctionProductDetails.title}
						</DialogTitle>
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<User className="w-4 h-4" />
							<span className="font-medium">
								{auctionProductDetails.artist}
							</span>
						</div>
					</div>

					<p className="text-sm text-gray-700">
						{auctionProductDetails.description}
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div className="flex flex-col">
							<span className="text-gray-500">Starting Bid</span>
							<span className="font-bold text-lg text-primary">
								৳ {auctionProductDetails.startingBid}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-gray-500">Current Bid</span>
							<span className="font-bold text-lg text-primary">
								৳ {auctionProductDetails.currentBid}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-gray-500">Bid Increment</span>
							<span className="font-bold text-lg text-primary">
								৳ {auctionProductDetails.bidIncrement}
							</span>
						</div>
					</div>

					<div>
						<h3 className="text-base md:text-lg font-semibold mb-2">
							Bid History
						</h3>
						{auctionProductDetails.bidHistory.length ? (
							<ul className="divide-y text-sm border rounded-md bg-gray-50 h-[300px] overflow-y-auto">
								{auctionProductDetails.bidHistory
									.slice()
									.reverse()
									.map((bid) => (
										<li
											key={bid._id}
											className="flex justify-between items-center px-3 py-2"
										>
											<span>Bidder: {bid.bidder.slice(-6)}</span>
											<span className="font-medium">৳ {bid.amount}</span>
										</li>
									))}
							</ul>
						) : (
							<p className="text-gray-500 text-sm italic">No bids yet</p>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AuctionDetails;
