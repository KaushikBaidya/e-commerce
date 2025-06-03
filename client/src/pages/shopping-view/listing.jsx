import Loading from '@/components/common/loading-component';
import ProductFilter from '@/components/shopping-view/filter';
import ProductDetails from '@/components/shopping-view/product-details';
import ShopProductTile from '@/components/shopping-view/shop-product-tile';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sortOptions } from '@/config';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  resetProducts,
} from '@/store/shop/products-slice';
import { ArrowUpDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',');
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join('&');
};

const ShoppingListing = () => {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [page, setPage] = useState(1);
  const [lazyProducts, setLazyProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { productList, productDetails, isLoading } = useSelector((state) => state.shopProducts);

  const categorySearchParam = searchParams.get('category');

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (getSectionId, getCurrentOption) => {
    let copyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      copyFilters[getSectionId] = [getCurrentOption];
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        copyFilters[getSectionId].push(getCurrentOption);
      } else {
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(copyFilters);
    sessionStorage.setItem('filters', JSON.stringify(copyFilters));
  };

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

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

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight + 100 >= fullHeight && hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(resetProducts());
      setPage(1);
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
          page: 1,
          limit: 12,
        })
      );
    }
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-background w-full rounded-lg shadow-sm">
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="text-lg font-medium">All Products</h2>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground block">{productList?.length} Products</span>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="flex items-center gap-2 border rounded-md px-2 py-1">
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {productList && productList?.length > 0
              ? productList.map((item) => (
                  <ShopProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    key={item._id}
                    product={item}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      )}
      {productDetails !== null ? (
        <ProductDetails
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      ) : null}
    </div>
  );
};

export default ShoppingListing;
