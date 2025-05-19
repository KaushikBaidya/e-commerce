import { Button } from "@/components/ui/button";
import BannerOne from "../../assets/banner-1.webp";
import BannerTwo from "../../assets/banner-2.webp";
import BannerThree from "../../assets/banner-3.webp";
import {
	Airplay,
	BabyIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CloudLightning,
	Heater,
	Images,
	Shirt,
	ShirtIcon,
	ShoppingBasket,
	UmbrellaIcon,
	WashingMachine,
	WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchAllFilteredProducts,
	fetchProductDetails,
} from "@/store/shop/products-slice";
import ShopProductTile from "@/components/shopping-view/shop-product-tile";
import { useNavigate } from "react-router-dom";
import ProductDetails from "@/components/shopping-view/product-details";

const categoriesWithIcon = [
	{ id: "men", label: "Men", icon: ShirtIcon },
	{ id: "women", label: "Women", icon: CloudLightning },
	{ id: "kids", label: "Kids", icon: BabyIcon },
	{ id: "accessories", label: "Accessories", icon: WatchIcon },
	{ id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
	{ id: "nike", label: "Nike", icon: Shirt },
	{ id: "adidas", label: "Adidas", icon: WashingMachine },
	{ id: "puma", label: "Puma", icon: ShoppingBasket },
	{ id: "levi", label: "Levi's", icon: Airplay },
	{ id: "zara", label: "Zara", icon: Images },
	{ id: "h&m", label: "H&M", icon: Heater },
];

const ShoppingHome = () => {
	const [currrentSlide, setCurrentSlide] = useState(0);
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { productList, productDetails } = useSelector(
		(state) => state.shopProducts
	);

	const slides = [BannerOne, BannerTwo, BannerThree];

	const handleNavigateToListingPage = (getCurrentItem, section) => {
		sessionStorage.removeItem("filters");
		const currentFilter = {
			[section]: [getCurrentItem.id],
		};
		sessionStorage.setItem("filters", JSON.stringify(currentFilter));
		navigate("/shop/listing");
	};

	function handleGetProductDetails(getCurrentProductId) {
		dispatch(fetchProductDetails(getCurrentProductId));
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
		if (productDetails !== null) {
			setOpenDetailsDialog(true);
		}
	}, [productDetails]);

	useEffect(() => {
		dispatch(
			fetchAllFilteredProducts({
				filterParams: {},
				sortParams: "price-lowtohigh",
			})
		);
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
			<section className="py-12 bg-gray-50 space-y-5">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl text-slate-700 font-bold text-center mb-8">
						Shop by Category
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
						{categoriesWithIcon.map((category, index) => (
							<Card
								onClick={() =>
									handleNavigateToListingPage(category, "category")
								}
								className={"cursor-pointer hover:shadow-lg transition-shadow"}
								key={index}
							>
								<CardContent className={"flex flex-col items-center p-6"}>
									<category.icon className="w-10 h-10 text-primary" />
									<h3 className="text-lg font-medium mt-2">{category.label}</h3>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
			<section className="py-12 bg-gray-50 space-y-5">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl text-slate-700 font-bold text-center mb-8">
						Shop by Brand
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{brandsWithIcon.map((brand, index) => (
							<Card
								onClick={() => handleNavigateToListingPage(brand, "brand")}
								className={"cursor-pointer hover:shadow-lg transition-shadow"}
								key={index}
							>
								<CardContent className={"flex flex-col items-center p-6"}>
									<brand.icon className="w-10 h-10 text-primary" />
									<h3 className="text-lg font-medium mt-2">{brand.label}</h3>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="pb-10">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl text-slate-700 font-bold text-center mb-8">
						Featured Products
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
						{productList &&
							productList.map((product, index) => (
								<ShopProductTile
									handleGetProductDetails={handleGetProductDetails}
									product={product}
									key={index}
									btnHide={true}
								/>
							))}
					</div>
				</div>
			</section>
			{productDetails !== null ? (
				<ProductDetails
					open={openDetailsDialog}
					setOpen={setOpenDetailsDialog}
					productDetails={productDetails}
				/>
			) : null}
		</div>
	);
};

export default ShoppingHome;
