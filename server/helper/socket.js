let io;

const initSocket = (server) => {
	const { Server } = require("socket.io");

	io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);

		socket.on("joinAuction", (auctionId) => {
			socket.join(auctionId);
			console.log(`User ${socket.id} joined auction ${auctionId}`);
		});

		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
		});
	});
};

const getIO = () => {
	if (!io) throw new Error("Socket.io not initialized!");
	return io;
};

module.exports = { initSocket, getIO };
