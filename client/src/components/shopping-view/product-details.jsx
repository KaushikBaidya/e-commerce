import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";

import { ShoppingCartIcon, Send, StarIcon, CircleAlert } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import StarRating from "../common/star-rating";

const ProductDetails = ({ open, setOpen, productDetails }) => {
	const [reviewMsg, setReviewMsg] = useState("");
	const [rating, setRating] = useState(0);

	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { cartItems } = useSelector((state) => state.shopCart);
	const { reviews } = useSelector((state) => state.shopReview);

	const handleAddToCart = (getCurrentProductId, getTotalStock) => {
		if (user === null)
			return toast.error("Please login to add this product to cart");

		let getCartItems = cartItems.items || [];

		if (getCartItems.length) {
			const indexOfCurrentItem = getCartItems.findIndex(
				(item) => item.productId === getCurrentProductId
			);
			if (indexOfCurrentItem > -1) {
				const getQuantity = getCartItems[indexOfCurrentItem].quantity;
				if (getQuantity + 1 > getTotalStock)
					return toast.error("Product stock limit reached");
			}
		}
		dispatch(
			addToCart({
				userId: user?.id,
				productId: getCurrentProductId,
				quantity: 1,
			})
		).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchCartItems(user?.id));
				toast.success("Product is added to cart");
			}
		});
	};

	const handleRatingChange = (value) => {
		setRating(value);
	};

	const handleAddReview = () => {
		dispatch(
			addReview({
				productId: productDetails?._id,
				userId: user?.id,
				userName: user?.userName,
				reviewMessage: reviewMsg,
				reviewValue: rating,
			})
		).then((data) => {
			if (data?.payload?.success) {
				setRating(0);
				setReviewMsg("");
				dispatch(getReviews(productDetails?._id));
				toast.success("Review added successfully");
			} else {
				toast.error(data?.payload?.message);
			}
		});
	};

	const handleDialogClose = () => {
		setOpen(false);
		dispatch(setProductDetails());
		setRating(0);
		setReviewMsg("");
	};

	useEffect(() => {
		if (productDetails !== null) dispatch(getReviews(productDetails?._id));
	}, [productDetails]);

	return (
		<Dialog open={open} onOpenChange={handleDialogClose}>
			<DialogContent className="grid grid-cols-2 gap-8 max-w-[90vw] sm:max-w[80vw] lg:max-w-[65vw]">
				<div className="relative overflow-hidden rounded-lg">
					<img
						src={productDetails.image}
						alt={productDetails.title}
						width={600}
						height={600}
						className="aspect-square object-cover w-full"
					/>
				</div>
				<div className="">
					<div>
						<DialogTitle className="text-3xl font-bold uppercase">
							{productDetails.title}
						</DialogTitle>
						<p className="text-3xl my-4 text-muted-foreground">
							{productDetails.description}
						</p>
					</div>
					<div className="flex items-center justify-between">
						<p
							className={`${
								productDetails?.salePrice > 0 ? "line-through" : ""
							} text-2xl font-semibold text-primary`}
						>
							৳ {productDetails.price}
						</p>
						{productDetails?.salePrice > 0 ? (
							<p className="text-2xl font-semibold text-muted-foreground">
								৳ {productDetails?.salePrice}
							</p>
						) : null}
					</div>

					<div className="flex items-center my-2 gap-2">
						<div className="flex items-center gap-0.5">
							<StarIcon className="w-4 h-4 fill-yellow-500" />
							<StarIcon className="w-4 h-4 fill-yellow-500" />
							<StarIcon className="w-4 h-4 fill-yellow-500" />
							<StarIcon className="w-4 h-4 fill-yellow-500" />
							<StarIcon className="w-4 h-4 fill-yellow-500" />
							<span className="text-muted-foreground">(3.5)</span>
						</div>
					</div>

					<div className="my-5">
						{productDetails?.totalStock === 0 ? (
							<Button className="w-full opacity-60 cursor-not-allowed">
								Out Of Stock
							</Button>
						) : (
							<Button
								onClick={() =>
									handleAddToCart(
										productDetails?._id,
										productDetails?.totalStock
									)
								}
								className={`w-full `}
							>
								<ShoppingCartIcon />
								Add to cart
							</Button>
						)}
					</div>
					<Separator />
					<div className="max-h-[300px] overflow-auto">
						{/* Reviews */}
						<h2 className="text-xl font-bold mb-4">Reviews</h2>
						{reviews && reviews.length > 0 ? (
							reviews.map((review) => (
								<div key={review._id} className="grid gap-6">
									<div className="flex gap-4">
										<Avatar className={"w-12 h-12 border-2 font-semibold"}>
											<AvatarFallback>
												{review.userName[0].toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="grid gap-1">
											<div className="flex items-center gap-2">
												<h3 className="font-bold">{review.userName}</h3>
											</div>
											<div className="flex items-center gap-0.5">
												<StarRating rating={review.reviewValue} />
												{/* <StarIcon className="w-4 h-4 fill-yellow-500" />
												<StarIcon className="w-4 h-4 fill-yellow-500" />
												<StarIcon className="w-4 h-4 fill-yellow-500" />
												<StarIcon className="w-4 h-4 fill-yellow-500" />
												<StarIcon className="w-4 h-4 fill-yellow-500" /> */}
											</div>
											<div>
												<p className="text-sm text-muted-foreground">
													{review.reviewMessage}
												</p>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="flex flex-col items-center justify-center">
								<CircleAlert size={48} color="#d82929" />
								<p>No reviews available</p>
							</div>
						)}

						{/* Write a review */}
						<div className="mt-10 flex flex-col gap-2.5">
							<Label>Write a review</Label>
							<div className="flex gap-1.5">
								<StarRating
									rating={rating}
									handleRatingChange={handleRatingChange}
								/>
							</div>
							<Input
								name="reviewMsg"
								value={reviewMsg}
								onChange={(event) => setReviewMsg(event.target.value)}
								placeholder="Write a review..."
							/>
							<Button
								onClick={handleAddReview}
								disabled={reviewMsg.trim() === ""}
							>
								<Send className="w-6 h-6" /> Submit
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ProductDetails;
