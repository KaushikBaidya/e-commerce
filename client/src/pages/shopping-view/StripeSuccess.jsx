import { useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "@/store/shop/cart-slice";

function StripeSuccess() {
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const dispatch = useDispatch();

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
					}
				} catch (err) {
					console.error("Order finalization failed:", err);
				}
			};

			finalizeOrder();
			dispatch(fetchCartItems());
		}
	}, [sessionId]);

	return (
		<div className="flex flex-col items-center justify-center mt-20 h-screen">
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
