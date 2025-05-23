import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { CalendarDays, Clock, User } from "lucide-react";
import { toast } from "sonner";
import {
	fetchAuctionProductDetails,
	fetchAllAuctionProducts,
} from "@/store/shop/auction-products-slice";
import { placeAuctionBid } from "@/store/shop/auction-slice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AuctionDetails = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { auctionProductDetails } = useSelector(
		(state) => state.shopAuctionProducts
	);

	useEffect(() => {
		if (id) {
			dispatch(fetchAuctionProductDetails(id));
		}
	}, [dispatch, id]);

	const handlePlaceBid = (productId) => {
		if (!user || user.role !== "user") {
			return toast.error("Please login to place bid");
		}

		const item = auctionProductDetails;
		if (!item) return toast.error("No auction item found");

		const now = new Date();
		if (new Date(item.startTime) > now)
			return toast.error("Auction hasn't started yet");
		if (new Date(item.endTime) < now)
			return toast.error("Auction has already ended");

		const nextBid = (item.currentBid || item.startingBid) + item.bidIncrement;

		dispatch(
			placeAuctionBid({
				userId: user.id,
				auctionId: productId,
				bidAmount: nextBid,
			})
		)
			.then((data) => {
				if (data?.payload?.success) {
					dispatch(fetchAuctionProductDetails(id));
					toast.success("Bid placed successfully");
				} else {
					toast.error("Failed to place bid");
				}
			})
			.catch(() => toast.error("Something went wrong"));
	};

	if (!auctionProductDetails)
		return <div className="text-center py-20">Loading...</div>;

	return (
		<div className="container mx-auto py-10 px-4 md:px-0">
			<div className="grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden shadow-xl max-w-3xl mx-auto bg-white">
				<div className="relative flex flex-col gap-4 h-80">
					<img
						src={auctionProductDetails.image}
						alt={auctionProductDetails.title}
						className="w-full h-full object-cover"
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
					<div className="p-4">
						<Button
							onClick={() => handlePlaceBid(auctionProductDetails._id)}
							className="w-full"
							disabled={!user}
						>
							{user ? `Place Bid` : `Register to Bid`}
						</Button>
					</div>
				</div>

				<div className="p-6 space-y-5">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold">
							{auctionProductDetails.title}
						</h1>
						<div className="flex items-center gap-2 text-muted-foreground">
							<User className="w-5 h-5" />
							<span className="font-medium">
								{auctionProductDetails.artist}
							</span>
						</div>
					</div>

					<p className="text-gray-700">{auctionProductDetails.description}</p>

					<div className="grid grid-cols-2 gap-4 text-sm">
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
							<span className="text-md font-semibold">
								৳ {auctionProductDetails.bidIncrement}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="flex items-center gap-1 text-gray-500">
								<CalendarDays className="w-4 h-4" /> Starts
							</span>
							<span>
								{format(new Date(auctionProductDetails.startTime), "PPPp")}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="flex items-center gap-1 text-gray-500">
								<Clock className="w-4 h-4" /> Ends
							</span>
							<span>
								{format(new Date(auctionProductDetails.endTime), "PPPp")}
							</span>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2">Bid History</h3>
						{auctionProductDetails.bidHistory.length ? (
							<ul className="divide-y text-sm border rounded-md bg-gray-50">
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
			</div>
		</div>
	);
};

export default AuctionDetails;

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import {
// 	fetchAllAuctionProducts,
// 	fetchAuctionProductDetails,
// } from "@/store/shop/auction-products-slice";
// import { CalendarDays, Clock, User } from "lucide-react";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";

// const AuctionDetails = () => {
// 	const { id } = useParams();
// 	const dispatch = useDispatch();
// 	// const navigate = useNavigate();
// 	const { user } = useSelector((state) => state.auth);
// 	const { auctionProductList, auctionProductDetails } = useSelector(
// 		(state) => state.shopAuctionProducts
// 	);

// 	const handlePlaceBid = (getCurrentProductId) => {
// 		if (!user || user?.role !== "user") {
// 			return toast.error("Please login to place bid");
// 		}

// 		const auctionItem = auctionProductDetails;

// 		const now = new Date();
// 		if (new Date(auctionItem.startTime) > now) {
// 			return toast.error("Auction hasn't started yet");
// 		}
// 		if (new Date(auctionItem.endTime) < now) {
// 			return toast.error("Auction has already ended");
// 		}

// 		const baseBid = auctionItem.currentBid || auctionItem.startingBid;
// 		const nextBid = baseBid + auctionItem.bidIncrement;

// 		dispatch(
// 			placeAuctionBid({
// 				userId: user.id,
// 				auctionId: getCurrentProductId,
// 				bidAmount: nextBid,
// 			})
// 		)
// 			.then((data) => {
// 				if (data?.payload?.success) {
// 					dispatch(fetchAllAuctionProducts());
// 					toast.success("Bid placed successfully");
// 				} else {
// 					toast.error("Failed to place bid");
// 				}
// 			})
// 			.catch(() => toast.error("Something went wrong"));
// 	};

// 	useEffect(() => {
// 		if (id) {
// 			dispatch(fetchAuctionProductDetails(id));
// 		}
// 	}, [dispatch, id]);

// 	console.log("auctionProductDetails", auctionProductDetails);

// 	return (
// 		<div className="min-h-screen container mx-auto py-10">
// 			<Card className="w-full max-w-sm mx-auto shadow-md">
// 				<div>
// 					<div className="relative">
// 						<img
// 							src={auctionProductDetails?.image}
// 							alt={auctionProductDetails?.title}
// 							className="w-full h-[300px] object-cover rounded-t-lg"
// 						/>
// 					</div>

// 					<CardContent className="p-4 space-y-4">
// 						<h2 className="text-2xl font-bold">
// 							{auctionProductDetails?.title}
// 						</h2>

// 						<div className="flex items-center justify-between text-muted-foreground">
// 							<span className="text-sm flex items-center gap-1">
// 								<User className="w-4 h-4" />
// 								<span className="font-medium">
// 									{auctionProductDetails?.artist}
// 								</span>
// 							</span>
// 							<Badge
// 								variant={
// 									auctionProductDetails?.isActive ? "default" : "secondary"
// 								}
// 								className={
// 									auctionProductDetails?.isActive
// 										? "bg-green-500"
// 										: "bg-red-500"
// 								}
// 							>
// 								{auctionProductDetails?.isActive ? "Active" : "Inactive"}
// 							</Badge>
// 						</div>

// 						<div className="grid grid-cols-2 gap-3 text-sm">
// 							<div className="flex flex-col">
// 								<span className="text-muted-foreground">Starting Bid</span>
// 								<span className="font-semibold text-lg">
// 									৳ {auctionProductDetails?.startingBid}
// 								</span>
// 							</div>
// 							<div className="flex flex-col">
// 								<span className="text-muted-foreground">Current Bid</span>
// 								<span className="font-semibold text-lg">
// 									৳{" "}
// 									{auctionProductDetails?.currentBid ||
// 										auctionProductDetails?.startingBid}
// 								</span>
// 							</div>
// 							<div className="flex flex-col">
// 								<span className="text-muted-foreground">Bid Increment</span>
// 								<span className="font-medium">
// 									৳ {auctionProductDetails?.bidIncrement}
// 								</span>
// 							</div>
// 							<div className="flex flex-col">
// 								<span className="text-muted-foreground flex items-center gap-1">
// 									<CalendarDays className="w-4 h-4" />
// 									Start Time
// 								</span>
// 								{auctionProductDetails?.startTime && (
// 									<span>
// 										{format(new Date(auctionProductDetails.startTime), "PPP p")}
// 									</span>
// 								)}
// 							</div>
// 							<div className="flex flex-col">
// 								<span className="text-muted-foreground flex items-center gap-1">
// 									<Clock className="w-4 h-4" />
// 									End Time
// 								</span>
// 								{auctionProductDetails?.endTime && (
// 									<span>
// 										{format(new Date(auctionProductDetails.endTime), "PPP p")}
// 									</span>
// 								)}
// 							</div>
// 						</div>
// 					</CardContent>
// 				</div>
// 				<CardFooter>
// 					{user === null ? (
// 						<Button className="w-full opacity-60 cursor-not-allowed">
// 							Register to bid
// 						</Button>
// 					) : (
// 						<Button onClick={() => handlePlaceBid(id)} className="w-full">
// 							{/* <ShoppingCartIcon /> */}
// 							Place Bid
// 						</Button>
// 					)}
// 				</CardFooter>
// 			</Card>
// 		</div>
// 	);
// };

// export default AuctionDetails;
