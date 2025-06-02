const AuctionProduct = require("../models/Auction");
const User = require("../models/User");
const { getIO } = require("../helper/socket");
const nodemailer = require("nodemailer");

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

			if (auction.isSold && auction.highestBidder && !auction.winnerNotified) {
				const user = await User.findById(auction.highestBidder);

				const transporter = nodemailer.createTransport({
					service: "Gmail",
					auth: {
						user: process.env.EMAIL_USER,
						pass: process.env.EMAIL_PASS,
					},
				});

				const userName = user.userName;
				const userEmail = user.email;

				const htmlContent = `
					<!DOCTYPE html>
					<html>
						<head>
							<meta charset="UTF-8">
							<title>🎉 Congratulations! You won the auction!</title>
						</head>
						<body>
							<h1>🎉 Congratulations! You won the auction!</h1>
							<p>Hi ${userName},</p>
							<p>You have won the auction for "${auction.title}".</p>
							<p>Please visit your dashboard for payment and delivery instructions.</p>
							<p>Thank you!</p>
						</body>
					</html>
				`;

				const mailOptions = {
					from: `"Galería" <${process.env.EMAIL_USER}>`,
					to: userEmail,
					subject: `🎉 Congratulations! You won the auction!`,
					text: `Hi ${userName},\n\n\n\nYou have won the auction for "${auction.title}".\n\nPlease visit your dashboard for payment and delivery instructions.\n\nThank you!`,
					html: htmlContent,
				};

				await transporter.sendMail(mailOptions);
				auction.winnerNotified = true;
				await auction.save();
			}
		}
	}, 5000);
}

module.exports = { startAuctionMonitor };
