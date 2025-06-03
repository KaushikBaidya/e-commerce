import { fetchCartItems } from '@/store/shop/cart-slice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';

function StripeSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (sessionId) {
      const finalizeOrder = async () => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/shop/order/finalize`, {
            sessionId,
          });
          if (res.data.success) {
            sessionStorage.removeItem('cartItems');
            if (user?.id) {
              dispatch(fetchCartItems(user.id));
            }
          }
        } catch (err) {
          console.error('Order finalization failed:', err);
        }
      };

      finalizeOrder();
    }
  }, [sessionId, dispatch, user]);

  return (
    <div className="flex flex-col items-center justify-center my-20 min-h-[60vh]">
      <h1 className="text-3xl font-semibold text-green-600">Payment Successful!</h1>
      <p className="mt-4 text-gray-600">Your order has been placed.</p>
      <div className="my-10 flex items-center justify-center">
        <Link
          to={'/shop/account'}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Check Your Order
        </Link>
      </div>
    </div>
  );
}

export default StripeSuccess;
