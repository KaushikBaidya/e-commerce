const { getIO } = require("./socket");
const AuctionProduct = require("../models/Auction");

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
			await auction.save();
			getIO().emit("auctionStatusUpdate", {
				auctionId: auction._id,
				status: "closed",
			});
		}
	}, 5000);
}

module.exports = { startAuctionMonitor };
