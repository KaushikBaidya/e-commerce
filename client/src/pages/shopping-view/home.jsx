import React from "react";
import Hero from "@/components/shopping-view/home/Hero";
import CreatorsPick from "@/components/shopping-view/home/CreatorsPick";
import FeaturedGallery from "@/components/shopping-view/home/FeaturedGallery";
import NewArivals from "@/components/shopping-view/home/NewArivals";

const ShoppingHome = () => {
	return (
		<>
			<Hero />
			<CreatorsPick />
			<NewArivals />
			<FeaturedGallery />
		</>
	);
};

export default ShoppingHome;
