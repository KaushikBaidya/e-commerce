const Auction = require("../../models/Auction");

const placeBid = async (req, res) => {
	try {
		const { userId, auctionId, bidAmount } = req.body;

		// Basic validation
		if (
			!userId ||
			!auctionId ||
			typeof bidAmount !== "number" ||
			bidAmount <= 0
		) {
			return res.status(400).json({
				success: false,
				message: "userId, auctionId and a valid bidAmount are required",
			});
		}

		// Fetch auction
		const auction = await Auction.findById(auctionId);
		if (!auction) {
			return res
				.status(404)
				.json({ success: false, message: "Auction not found" });
		}

		// Time and status check
		const now = new Date();
		if (
			!auction.isActive ||
			now < new Date(auction.startTime) ||
			now > new Date(auction.endTime)
		) {
			return res.status(400).json({
				success: false,
				message: "Auction is not active or has ended",
			});
		}

		// Calculate minimum allowed bid
		const minimumAllowedBid = auction.currentBid
			? auction.currentBid + auction.bidIncrement
			: auction.startingBid;

		if (bidAmount < minimumAllowedBid) {
			return res.status(400).json({
				success: false,
				message: `Bid must be at least ৳${minimumAllowedBid}`,
			});
		}

		// Update currentBid and highestBidder
		auction.currentBid = bidAmount;
		auction.highestBidder = userId;

		// Add to bid history
		auction.bidHistory.push({
			bidder: userId,
			amount: bidAmount,
			time: now,
		});

		await auction.save();

		res.status(200).json({
			success: true,
			message: "Bid placed successfully",
			data: {
				currentBid: auction.currentBid,
				highestBidder: auction.highestBidder,
				bidHistory: auction.bidHistory,
			},
		});
	} catch (error) {
		console.error("placeBid error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const fetchBidItems = async (req, res) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			return res
				.status(400)
				.json({ success: false, message: "User ID is required" });
		}

		// Find all auctions where the user has placed any bid
		const auctions = await Auction.find({ "bidHistory.bidder": userId });

		if (!auctions || auctions.length === 0) {
			return res
				.status(404)
				.json({ success: false, message: "No auction items found" });
		}

		// Build response with highest user bid per item
		const items = auctions.map((item) => {
			const userBids = item.bidHistory.filter(
				(bid) => bid.bidder.toString() === userId
			);

			const highestUserBid = userBids.length
				? Math.max(...userBids.map((b) => b.amount))
				: null;

			return {
				id: item._id,
				image: item.image,
				title: item.title,
				currentBid: item.currentBid,
				userBid: highestUserBid,
			};
		});

		return res.status(200).json({ success: true, data: items });
	} catch (error) {
		console.error("fetchBidItems error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

// const fetchBidItems = async (req, res) => {
// 	try {
// 		const { userId } = req.params;

// 		if (!userId) {
// 			return res
// 				.status(400)
// 				.json({ success: false, message: "User ID is required" });
// 		}

// 		// Find auctions where user has placed a bid
// 		const auctions = await Auction.find({ "bidHistory.bidder": userId });

// 		if (!auctions || auctions.length === 0) {
// 			return res
// 				.status(404)
// 				.json({ success: false, message: "No auction items found" });
// 		}

// 		// Map response data
// 		const items = auctions.map((item) => {
// 			const userBid = item.bidHistory.find(
// 				(bid) => bid.bidder.toString() === userId
// 			);
// 			return {
// 				id: item._id,
// 				image: item.image,
// 				title: item.title,
// 				currentBid: item.currentBid,
// 				userBid: userBid?.amount || null,
// 			};
// 		});

// 		return res.status(200).json({ success: true, data: items });
// 	} catch (error) {
// 		console.error("fetchBidItems error:", error);
// 		return res.status(500).json({ success: false, message: "Server error" });
// 	}
// };

module.exports = { placeBid, fetchBidItems };
