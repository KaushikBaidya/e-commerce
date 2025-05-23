import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BannerOne from "../../assets/banner-1.webp";
import BannerTwo from "../../assets/banner-2.webp";
import BannerThree from "../../assets/banner-3.webp";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import AuctionProductTile from "@/components/shopping-view/auction-product-tile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	fetchAuctionProductDetails,
	fetchAllAuctionProducts,
} from "@/store/shop/auction-products-slice";

const AuctionPage = () => {
	const [currrentSlide, setCurrentSlide] = useState(0);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { auctionProductList, auctionProductDetails } = useSelector(
		(state) => state.shopAuctionProducts
	);

	const slides = [BannerOne, BannerTwo, BannerThree];

	function handleGetProductDetails(getCurrentProductId) {
		dispatch(fetchAuctionProductDetails(getCurrentProductId));
	}

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	useEffect(() => {
		dispatch(fetchAllAuctionProducts());
	}, [dispatch]);

	return (
		<div className="flex flex-col min-h-screen">
			<div className="relative w-full h-[600px] overflow-hidden">
				{slides.map((slide, index) => (
					<img
						key={index}
						src={slide}
						alt="Banner"
						className={`${
							index === currrentSlide ? "opacity-100" : "opacity-0"
						} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
					/>
				))}
				<Button
					variant={"outline"}
					size={"icon"}
					onClick={() =>
						setCurrentSlide(
							(prev) => (prev - 1 + slides.length) % slides.length
						)
					}
					className={
						"absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 rounded-full h-12 w-12"
					}
				>
					<ChevronLeftIcon className="h-6 w-6" />
				</Button>
				<Button
					variant={"outline"}
					size={"icon"}
					onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
					className={
						"absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 rounded-full h-12 w-12"
					}
				>
					<ChevronRightIcon className="h-6 w-6" />
				</Button>
			</div>
			<section className="py-10">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl text-slate-700 font-semibold text-center mb-8">
						Auction Products
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{auctionProductList &&
							auctionProductList.map((product, index) => (
								<AuctionProductTile
									key={index}
									auctionProduct={product}
									handleGetProductDetails={handleGetProductDetails}
								/>
							))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default AuctionPage;
