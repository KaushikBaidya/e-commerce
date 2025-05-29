import React from "react";
import logo from "@/assets/logo.png";

const Loading = () => {
	return (
		<div className="flex items-center justify-center gap-4 h-screen">
			<img src={logo} alt="logo" className="h-20 w-20" />
			<span className="font-bold uppercase text-4xl">Galería</span>
		</div>
	);
};

export default Loading;
