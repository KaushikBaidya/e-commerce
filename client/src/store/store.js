import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

import AdminProductsSlice from "./admin/products-slice";
import AdminAuctionProductsSlice from "./admin/auction-products-slice";
import AdminOrderSlice from "./admin/order-slice";

import ShoppingProductsSlice from "./shop/products-slice";
import ShoppingAuctionProductsSlice from "./shop/auction-products-slice";
import ShoppingCartSlice from "./shop/cart-slice";
import ShopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";

import AuctionSlice from "./shop/auction-slice";
import AuctionCheckoutSlice from "./shop/auction-checkout-slice";

const store = configureStore({
	reducer: {
		auth: authReducer,

		adminProducts: AdminProductsSlice,
		adminAuctionProduct: AdminAuctionProductsSlice,
		adminOrder: AdminOrderSlice,

		shopProducts: ShoppingProductsSlice,
		shopAuctionProducts: ShoppingAuctionProductsSlice,
		shopCart: ShoppingCartSlice,
		shopAddress: ShopAddressSlice,
		shopOrder: shopOrderSlice,
		shopSearch: shopSearchSlice,

		shopAuction: AuctionSlice,
		auctionCheckout: AuctionCheckoutSlice,
	},
});

export default store;
