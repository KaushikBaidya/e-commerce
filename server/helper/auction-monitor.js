const AuctionProduct = require("../models/Auction");
const { getIO } = require("../helper/socket");

function startAuctionMonitor() {
	setInterval(async () => {
		const now = new Date();

		const upcomingToRunning = await AuctionProduct.find({
			status: "upcoming",
			startTime: { $lte: now },
		});

		const runningToClosed = await AuctionProduct.find({
			status: "running",
			endTime: { $lte: now },
		});

		for (const auction of upcomingToRunning) {
			auction.status = "running";
			auction.isActive = true;
			await auction.save();
			getIO().emit("auctionStatusUpdate", {
				auctionId: auction._id,
				status: "running",
			});
		}

		for (const auction of runningToClosed) {
			auction.status = "closed";
			auction.isActive = false;

			if (auction.bidHistory.length > 0) {
				auction.isSold = true;
			} else {
				auction.isSold = false;
			}
			await auction.save();
			getIO().emit("auctionStatusUpdate", {
				auctionId: auction._id,
				status: "closed",
				isSold: auction.isSold,
			});
		}
	}, 5000);
}

module.exports = { startAuctionMonitor };
