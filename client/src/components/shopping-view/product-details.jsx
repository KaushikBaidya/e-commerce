import React from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ShoppingCartIcon, Send, StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/products-slice";

const ProductDetails = ({ open, setOpen, productDetails }) => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { cartItems } = useSelector((state) => state.shopCart);

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

	const handleDialogClose = () => {
		setOpen(false);
		dispatch(setProductDetails());
	};

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
						<h2 className="text-xl font-bold mb-4">Reviews</h2>
						<div className="grid gap-6">
							<div className="flex gap-4">
								<Avatar className={"w-12 h-12 border-2"}>
									<AvatarFallback>FU</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<div className="flex items-center gap-2">
										<h3 className="font-bold">Username</h3>
									</div>
									<div className="flex items-center gap-0.5">
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											This is a good quality t-shirt
										</p>
									</div>
								</div>
							</div>
							<div className="flex gap-4">
								<Avatar className={"w-12 h-12 border-2"}>
									<AvatarFallback>FU</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<div className="flex items-center gap-2">
										<h3 className="font-bold">Username</h3>
									</div>
									<div className="flex items-center gap-0.5">
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											This is a good quality t-shirt
										</p>
									</div>
								</div>
							</div>
							<div className="flex gap-4">
								<Avatar className={"w-12 h-12 border-2"}>
									<AvatarFallback>FU</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<div className="flex items-center gap-2">
										<h3 className="font-bold">Username</h3>
									</div>
									<div className="flex items-center gap-0.5">
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
										<StarIcon className="w-4 h-4 fill-yellow-500" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											This is a good quality t-shirt
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-6 flex gap-2">
							<Input placeholder="Write a review..." />
							<Button>
								<Send className="w-6 h-6" />
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ProductDetails;
