import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsSlice from "./admin/products-slice";
import ShoppingProductsSlice from "./shop/products-slice";
import ShoppingCartSlice from "./shop/cart-slice";
import ShopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		adminProducts: AdminProductsSlice,
		shopProducts: ShoppingProductsSlice,
		shopCart: ShoppingCartSlice,
		shopAddress: ShopAddressSlice,
		shopOrder: shopOrderSlice,
	},
});

export default store;
