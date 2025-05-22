import { useEffect } from "react";
// import { useDispatch } from "react-redux";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

function StripeSuccess() {
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get("session_id");

	useEffect(() => {
		if (sessionId) {
			const finalizeOrder = async () => {
				try {
					const res = await axios.post(
						"http://localhost:5000/api/shop/order/finalize",
						{
							sessionId,
						}
					);
					if (res.data.success) {
						sessionStorage.removeItem("cartItems");
						console.log("Order finalized and cart cleared.");
					}
				} catch (err) {
					console.error("Order finalization failed:", err);
				}
			};

			finalizeOrder();
		}
	}, [sessionId]);

	return (
		<div className="flex flex-col items-center justify-center mt-20">
			<h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
			<p className="mt-4 text-gray-600">Your order has been placed.</p>
			<div className="my-10 flex items-center justify-center">
				<Link
					to={"/"}
					className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
				>
					Go Home
				</Link>
			</div>
		</div>
	);
}

export default StripeSuccess;
