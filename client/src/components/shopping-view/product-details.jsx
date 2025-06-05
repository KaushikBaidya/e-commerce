import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { setProductDetails } from '@/store/shop/products-slice';
import { addReview, getReviews } from '@/store/shop/review-slice';

import { CircleAlert, Send, ShoppingCartIcon } from 'lucide-react';

import StarRating from '../common/star-rating';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

import * as Yup from 'yup';

const reviewSchema = Yup.object().shape({
  reviewMessage: Yup.string()
    .trim()
    .min(5, 'Review must be at least 5 characters')
    .required('Review is required'),
  reviewValue: Yup.number().min(1, 'Rating must be at least 1 star').required('Rating is required'),
});

const ProductDetails = ({ open, setOpen, productDetails }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      reviewMessage: '',
      reviewValue: 0,
    },
  });

  const reviewMessage = watch('reviewMessage');
  const reviewValue = watch('reviewValue');

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    if (user === null)
      return toast.error('Please login to add this product to cart', {
        action: {
          label: 'close',
        },
      });

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock)
          return toast.error('Product stock limit reached', {
            action: {
              label: 'close',
            },
          });
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success('Product is added to cart', {
          action: {
            label: 'close',
          },
        });
      }
    });
  };

  const onSubmitReview = async (formData) => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: formData.reviewMessage,
        reviewValue: formData.reviewValue,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        reset();
        dispatch(getReviews(productDetails?._id));
        toast.success('Review added successfully', {
          action: {
            label: 'close',
          },
        });
      } else {
        toast.error(data?.payload?.message, {
          action: {
            label: 'close',
          },
        });
      }
    });
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    reset();
  };

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[65vw] overflow-y-auto max-h-[95vh]">
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-auto aspect-square object-cover"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <DialogTitle className="text-2xl sm:text-3xl font-semibold uppercase">
              {productDetails?.title}
            </DialogTitle>
            <p className="text-muted-foreground text-base sm:text-xl mt-2">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xl font-medium">
            <p className={`${productDetails?.salePrice > 0 ? 'line-through' : ''} text-primary`}>
              ৳ {productDetails?.price.toLocaleString()}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-muted-foreground">৳ {productDetails?.salePrice}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-base">
            <StarRating rating={averageReview} />
            <span className="text-muted-foreground">{averageReview.toFixed(1)}</span>
          </div>

          <div className="my-2">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
            ) : (
              <Button
                onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                className="w-full"
              >
                <ShoppingCartIcon />
                Add to cart
              </Button>
            )}
          </div>

          <Separator />

          {/* Reviews */}
          <div className="flex-1 overflow-auto max-h-[300px]">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Reviews</h2>

            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="grid gap-4 mb-4">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 border-2 font-medium">
                      <AvatarFallback>{review.userName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{review.userName}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.reviewValue} />
                      </div>
                      <p className="text-sm text-muted-foreground">{review.reviewMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <CircleAlert size={36} color="#d82929" />
                <p className="text-sm">No reviews available</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmitReview)} className="mt-6 flex flex-col gap-2.5">
            <Label>Write a review</Label>

            <div className="flex gap-1">
              <Controller
                name="reviewValue"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <StarRating
                    rating={value}
                    handleRatingChange={(rating) => {
                      onChange(rating);
                    }}
                  />
                )}
              />
              {errors.reviewValue && (
                <p className="text-sm text-red-500">{errors.reviewValue.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Controller
                name="reviewMessage"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Write a review..." />}
              />
              {errors.reviewMessage && (
                <p className="text-sm text-red-500">{errors.reviewMessage.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || reviewMessage?.trim() === '' || reviewValue === 0}
            >
              <Send className="w-5 h-5 mr-1" />
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
