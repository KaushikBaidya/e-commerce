import CreatorsPick from "@/components/home/CreatorsPick";
import FeaturedGallery from "@/components/home/FeaturedGallery";
import Hero from "@/components/home/Hero";
import NewArivals from "@/components/home/NewArivals";
import React from "react";

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
