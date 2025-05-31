import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/oders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import Unauthorized from "./pages/unauthorized";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import StripeSuccess from "./pages/shopping-view/StripeSuccess";
import SearchProducts from "./pages/shopping-view/search";
import AuctionProductsView from "./pages/admin-view/auction-products";
import AuctionPage from "./pages/shopping-view/AuctionPage";
import AuctionCheckout from "./pages/shopping-view/auction-checkout";
import AuctionStripeSuccess from "./pages/shopping-view/AuctionStripeSuccess";
import AdminAuctionOrders from "./pages/admin-view/AdminAuctionOrders";
import AdminUsers from "./pages/admin-view/AdminUsers";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import Loading from "./components/common/loading-component";
import AllNotifications from "./pages/admin-view/AllNotifications";
import VerifyEmail from "./pages/auth/verify-email";
import VerifyTokenPage from "./pages/auth/verify-token";

function App() {
	const { user, isAuthenticated, isLoading } = useSelector(
		(state) => state.auth
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(checkAuth());
	}, [dispatch]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col overflow-hidden bg-white">
			<Routes>
				<Route
					path="/auth"
					element={
						<CheckAuth isAuthenticated={isAuthenticated} user={user}>
							<AuthLayout />
						</CheckAuth>
					}
				>
					<Route path="login" element={<AuthLogin />} />
					<Route path="register" element={<AuthRegister />} />
				</Route>

				<Route
					path="/admin"
					element={
						<CheckAuth isAuthenticated={isAuthenticated} user={user}>
							<AdminLayout />
						</CheckAuth>
					}
				>
					<Route path="dashboard" element={<AdminDashboard />} />
					<Route path="products" element={<AdminProducts />} />
					<Route path="auction-products" element={<AuctionProductsView />} />
					<Route path="orders" element={<AdminOrders />} />
					<Route path="auction-orders" element={<AdminAuctionOrders />} />
					<Route path="features" element={<AdminFeatures />} />
					<Route path="users" element={<AdminUsers />} />
					<Route path="notifications" element={<AllNotifications />} />
				</Route>

				<Route path="/" element={<ShoppingLayout />}>
					{/* Public routes */}
					<Route path="/" element={<ShoppingHome />} />
					<Route path="shop/listing" element={<ShoppingListing />} />
					<Route path="shop/auction" element={<AuctionPage />} />
					<Route path="shop/search" element={<SearchProducts />} />
					<Route path="forgot-password" element={<ForgotPassword />} />
					<Route path="reset-password/:token" element={<ResetPassword />} />
					<Route path="verify-email" element={<VerifyEmail />} />
					<Route path="verify/:token" element={<VerifyTokenPage />} />

					{/* Protected routes */}
					<Route
						path="shop/checkout"
						element={
							<CheckAuth isAuthenticated={isAuthenticated} user={user}>
								<ShoppingCheckout />
							</CheckAuth>
						}
					/>
					<Route
						path="auction/checkout/:id"
						element={
							<CheckAuth isAuthenticated={isAuthenticated} user={user}>
								<AuctionCheckout />
							</CheckAuth>
						}
					/>
					<Route
						path="auction/stripe-success"
						element={
							<CheckAuth isAuthenticated={isAuthenticated} user={user}>
								<AuctionStripeSuccess />
							</CheckAuth>
						}
					/>
					<Route
						path="shop/account"
						element={
							<CheckAuth isAuthenticated={isAuthenticated} user={user}>
								<ShoppingAccount />
							</CheckAuth>
						}
					/>
					<Route
						path="shop/stripe-success"
						element={
							<CheckAuth isAuthenticated={isAuthenticated} user={user}>
								<StripeSuccess />
							</CheckAuth>
						}
					/>
				</Route>

				<Route path="*" element={<NotFound />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
			</Routes>
		</div>
	);
}

export default App;
