import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, CalendarDays, User, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const AuctionProductTile = ({ auctionProduct, handleGetProductDetails }) => {
	// const { user } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	return (
		<Card className="w-full max-w-sm mx-auto shadow-md">
			<div onClick={() => handleGetProductDetails(auctionProduct?._id)}>
				<div className="relative">
					<img
						src={auctionProduct?.image}
						alt={auctionProduct?.title}
						className="w-full h-[300px] object-cover rounded-t-lg"
					/>
				</div>

				<CardContent className="p-4 space-y-4">
					<h2 className="text-2xl font-bold">{auctionProduct?.title}</h2>

					<div className="flex items-center justify-between text-muted-foreground">
						<span className="text-sm flex items-center gap-1">
							<User className="w-4 h-4" />
							<span className="font-medium">{auctionProduct?.artist}</span>
						</span>
						<Badge
							variant={auctionProduct?.isActive ? "default" : "secondary"}
							className={
								auctionProduct?.isActive ? "bg-green-500" : "bg-red-500"
							}
						>
							{auctionProduct?.isActive ? "Active" : "Inactive"}
						</Badge>
					</div>

					<div className="grid grid-cols-2 gap-3 text-sm">
						<div className="flex flex-col">
							<span className="text-muted-foreground">Starting Bid</span>
							<span className="font-semibold text-lg">
								৳ {auctionProduct?.startingBid}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-muted-foreground">Current Bid</span>
							<span className="font-semibold text-lg">
								৳ {auctionProduct?.currentBid || auctionProduct?.startingBid}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-muted-foreground">Bid Increment</span>
							<span className="font-medium">
								৳ {auctionProduct?.bidIncrement}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-muted-foreground flex items-center gap-1">
								<CalendarDays className="w-4 h-4" />
								Start Time
							</span>
							<span>
								{format(new Date(auctionProduct?.startTime), "PPP p")}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="text-muted-foreground flex items-center gap-1">
								<Clock className="w-4 h-4" />
								End Time
							</span>
							<span>{format(new Date(auctionProduct?.endTime), "PPP p")}</span>
						</div>
					</div>
				</CardContent>
			</div>
			<CardFooter>
				<Button
					onClick={() =>
						navigate(`/shop/auction-product-details/${auctionProduct?._id}`)
					}
					className="w-full"
				>
					View Details
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AuctionProductTile;
