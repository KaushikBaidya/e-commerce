import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';

import AdminAuctionProductsSlice from './admin/auction-products-slice';
import AdminFeedbackSlice from './admin/feedback-slice';
import adminNotificationSlice from './admin/notification-slice';
import AdminOrderSlice from './admin/order-slice';
import AdminProductsSlice from './admin/products-slice';
import AdminUserSlice from './admin/user-slice';

import ShopAddressSlice from './shop/address-slice';
import ShoppingAuctionProductsSlice from './shop/auction-products-slice';
import ShoppingCartSlice from './shop/cart-slice';
import shopFeedbackSlice from './shop/feedback-slice';
import shopOrderSlice from './shop/order-slice';
import ShoppingProductsSlice from './shop/products-slice';
import shopReviewSlice from './shop/review-slice';
import shopSearchSlice from './shop/search-slice';

import AuctionCheckoutSlice from './shop/auction-checkout-slice';
import AuctionSlice from './shop/auction-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: AdminProductsSlice,
    adminAuctionProduct: AdminAuctionProductsSlice,
    adminOrder: AdminOrderSlice,
    adminUser: AdminUserSlice,
    adminNotifications: adminNotificationSlice,
    adminFeedback: AdminFeedbackSlice,

    shopProducts: ShoppingProductsSlice,
    shopAuctionProducts: ShoppingAuctionProductsSlice,
    shopCart: ShoppingCartSlice,
    shopAddress: ShopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    shopFeedback: shopFeedbackSlice,

    shopAuction: AuctionSlice,
    auctionCheckout: AuctionCheckoutSlice,
  },
});

export default store;
