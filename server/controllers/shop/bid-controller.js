const Auction = require("../../models/Auction");
const {
	createNotificationService,
} = require("../admin/notification-controller");
const sanitize = require("mongo-sanitize");
const { getIO } = require("../../helper/socket");

const placeBid = async (req, res) => {
	try {
		const userId = sanitize(req.body.userId);
		const auctionId = sanitize(req.body.auctionId);
		const bidAmount = sanitize(req.body.bidAmount);

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

		const auction = await Auction.findById(auctionId);
		if (!auction) {
			return res
				.status(404)
				.json({ success: false, message: "Auction not found" });
		}

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

		if (auction.highestBidder?.toString() === userId) {
			return res.status(400).json({
				success: false,
				message: "You are already the highest bidder",
			});
		}

		let minimumAllowedBid;
		if (auction.currentBid) {
			minimumAllowedBid = auction.currentBid + auction.bidIncrement;
			if (bidAmount < minimumAllowedBid) {
				return res.status(400).json({
					success: false,
					message: `Bid must be at least ৳${minimumAllowedBid}`,
				});
			}
		} else {
			if (bidAmount !== auction.startingBid) {
				return res.status(400).json({
					success: false,
					message: `First bid must be exactly ৳${auction.startingBid}`,
				});
			}
		}

		const updatedAuction = await Auction.findOneAndUpdate(
			{
				_id: auctionId,
				isActive: true,
				startTime: { $lte: now },
				endTime: { $gte: now },
				$or: [
					{ currentBid: { $lt: bidAmount } },
					{ currentBid: { $exists: false } },
				],
			},
			{
				$set: {
					currentBid: bidAmount,
					highestBidder: userId,
				},
				$push: {
					bidHistory: {
						bidder: userId,
						amount: bidAmount,
						time: now,
					},
				},
			},
			{ new: true }
		);

		if (!updatedAuction) {
			return res.status(400).json({
				success: false,
				message:
					"Bid failed — another user may have placed a higher bid already",
			});
		}

		await createNotificationService({
			title: "New Bid Placed",
			message: `User ${userId} placed a new bid of ৳${bidAmount} on auction ${auction.title}`,
			type: "auction",
		});

		const io = getIO();

		io.to(auctionId).emit("newBid", {
			auctionId,
			currentBid: updatedAuction.currentBid,
			highestBidder: updatedAuction.highestBidder,
			bidHistory: updatedAuction.bidHistory,
		});

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
		const userId = sanitize(req.params.userId);

		if (!userId) {
			return res
				.status(400)
				.json({ success: false, message: "User ID is required" });
		}

		const auctions = await Auction.find({ "bidHistory.bidder": userId });

		if (!auctions || auctions.length === 0) {
			return res
				.status(404)
				.json({ success: false, message: "No auction items found" });
		}

		const items = auctions.map((item) => {
			const userBids = item.bidHistory
				.filter((bid) => bid.bidder.toString() === userId)
				.sort((a, b) => new Date(b.time) - new Date(a.time));
			const highestUserBid = userBids.length
				? Math.max(...userBids.map((b) => b.amount))
				: null;

			return {
				id: item._id,
				image: item.image,
				title: item.title,
				currentBid: item.currentBid,
				userBid: highestUserBid,
				lastBidTime: userBids[0]?.time || null,
			};
		});

		return res.status(200).json({ success: true, data: items });
	} catch (error) {
		console.error("fetchBidItems error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = { placeBid, fetchBidItems };
