import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const CartItems = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  const handleUpdateQty = (getCartItem, type) => {
    if (type == 'increase') {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast('Product stock limit reached');

            return;
          }
        }
      }
    }
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity: type === 'increase' ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success('Product quantity updated', {
          action: {
            label: 'close',
          },
        });
      }
    });
  };

  const handleCartItemDelete = (getCartItem) => {
    dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })).then(
      (data) => {
        if (data?.payload?.success) {
          toast.success('Product removed from cart', {
            action: {
              label: 'close',
            },
          });
        }
      }
    );
  };

  return (
    <div className="flex items-center space-x-4">
      <img src={cartItem?.image} alt={cartItem?.title} className="w-16 h-16 rounded-full" />
      <div className="flex-1">
        <h3 className="font-medium">{cartItem?.title}</h3>
        <div className="flex items-center mt-2 gap-5">
          <Button
            variant={'outline'}
            size={'icon'}
            className={'w-8 h-8 rounded-full'}
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQty(cartItem, 'decrease')}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-medium">{cartItem?.quantity}</span>
          <Button
            variant={'outline'}
            size={'icon'}
            className={'w-8 h-8 rounded-full'}
            onClick={() => handleUpdateQty(cartItem, 'increase')}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-medium">
          ৳
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash2
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1 text-red-600"
          size={20}
        />
      </div>
    </div>
  );
};

export default CartItems;
