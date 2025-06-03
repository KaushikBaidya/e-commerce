import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import ProductDetails from '@/components/shopping-view/product-details';
import ShopProductTile from '@/components/shopping-view/shop-product-tile';

import Loading from '@/components/common/loading-component';
import { Input } from '@/components/ui/input';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { fetchProductDetails } from '@/store/shop/products-slice';
import { getSearchResults, resetSearchResults } from '@/store/shop/search-slice';
import { Search } from 'lucide-react';

function SearchProducts() {
  const [keyword, setKeyword] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    if (keyword && keyword.trim() !== '' && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error('Product stock limit reached', {
            action: {
              label: 'close',
            },
          });

          return;
        }
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
  }

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen">
      {/* Loading State */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Search Input */}
          <section className="flex justify-center mb-10">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <Input
                  value={keyword}
                  name="keyword"
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Search Products..."
                  className="pl-12 py-6 text-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search />
                </div>
              </div>
            </div>
          </section>

          {/* No Results */}
          {!searchResults.length && keyword.trim() ? (
            <div className="text-center mt-10">
              <h2 className="text-2xl md:text-4xl font-medium text-gray-600">
                No results found for "<span className="italic">{keyword}</span>"
              </h2>
            </div>
          ) : null}

          {/* Products Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {searchResults.map((item) => (
              <ShopProductTile
                key={item._id || item.id || item.title}
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </section>
        </>
      )}

      {/* Product Details Modal */}
      {productDetails && (
        <ProductDetails
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      )}
    </div>
  );
}

export default SearchProducts;
