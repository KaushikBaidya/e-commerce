import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductsSlice from "./admin/products-slice";
import ShoppingProductsSlice from "./shop/products-slice";
import ShoppingCartSlice from "./shop/cart-slice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		adminProducts: AdminProductsSlice,
		shopProducts: ShoppingProductsSlice,
		shopCart: ShoppingCartSlice,
	},
});

export default store;
