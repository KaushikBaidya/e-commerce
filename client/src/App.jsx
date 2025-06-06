import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './components/admin-view/layout';
import AuthLayout from './components/auth/layout';
import CheckAuth from './components/common/check-auth';
import Loading from './components/common/loading-component';
import ShoppingLayout from './components/shopping-view/layout';
import AdminAuctionOrders from './pages/admin-view/AdminAuctionOrders';
import AdminProducts from './pages/admin-view/AdminProducts';
import AdminUsers from './pages/admin-view/AdminUsers';
import AllNotifications from './pages/admin-view/AllNotifications';
import AuctionProductsView from './pages/admin-view/AuctionProductsView';
import AuctionWinners from './pages/admin-view/AuctionWinners';
import Feedbacks from './pages/admin-view/Feedbacks';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminFeatures from './pages/admin-view/features';
import AdminOrders from './pages/admin-view/oders';
import ForgotPassword from './pages/auth/forgot-password';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import ResetPassword from './pages/auth/reset-password';
import VerifyEmail from './pages/auth/verify-email';
import VerifyTokenPage from './pages/auth/verify-token';
import NotFound from './pages/not-found';
import AuctionPage from './pages/shopping-view/AuctionPage';
import AuctionStripeSuccess from './pages/shopping-view/AuctionStripeSuccess';
import StripeSuccess from './pages/shopping-view/StripeSuccess';
import AboutUsPage from './pages/shopping-view/about-us';
import ShoppingAccount from './pages/shopping-view/account';
import AuctionCheckout from './pages/shopping-view/auction-checkout';
import ShoppingCheckout from './pages/shopping-view/checkout';
import Contact from './pages/shopping-view/contact';
import ShoppingHome from './pages/shopping-view/home';
import ShoppingListing from './pages/shopping-view/listing';
import SearchProducts from './pages/shopping-view/search';
import Unauthorized from './pages/unauthorized';
import { checkAuth } from './store/auth-slice';

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white font-dmSans">
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
          <Route path="auction-winners" element={<AuctionWinners />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="notifications" element={<AllNotifications />} />
        </Route>

        <Route path="/" element={<ShoppingLayout />}>
          {/* Public routes */}
          <Route path="/" element={<ShoppingHome />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="shop/listing" element={<ShoppingListing />} />
          <Route path="shop/auction" element={<AuctionPage />} />
          <Route path="shop/search" element={<SearchProducts />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="verify/:token" element={<VerifyTokenPage />} />
          <Route path="contact" element={<Contact />} />

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
