import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import { useDispatch, useSelector } from 'react-redux';

import { getAllOrdersByUserId } from '@/store/shop/auction-checkout-slice';
import { fetchAllAuctionProducts } from '@/store/shop/auction-products-slice';
import { fetchAuctionItems } from '@/store/shop/auction-slice';
import { CircleCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loading from '../common/loading-component';
import { Button } from '../ui/button';

const MyBids = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { auctionItems } = useSelector((state) => state.shopAuction);
  const { auctionProductList } = useSelector((state) => state.shopAuctionProducts);
  const { orderList, isLoading } = useSelector((state) => state.auctionCheckout);

  const canCheckout = (auctionItemId) => {
    const product = auctionProductList.find((p) => p._id === auctionItemId);
    if (!product) return false;

    const auctionEnded = new Date(product.endTime) < new Date();
    const isWinner = product.highestBidder === user?.id;

    return auctionEnded && isWinner;
  };

  const hasPaidForAuction = (auctionProductId) => {
    if (!orderList || !user) return false;

    return orderList.some(
      (order) =>
        order.productId === auctionProductId &&
        order.userId === user.id &&
        order.paymentStatus === 'paid'
    );
  };

  const handleNavigate = (id) => {
    navigate(`/auction/checkout/${id}`);
  };

  useEffect(() => {
    dispatch(fetchAuctionItems(user?.id));
    dispatch(getAllOrdersByUserId(user?.id));
    dispatch(fetchAllAuctionProducts());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium pt-4 px-2">My Bid History</CardTitle>
      </CardHeader>
      {isLoading ? (
        <Loading />
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artwork</TableHead>
                <TableHead>Your Bid</TableHead>
                <TableHead>Current Bid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctionItems.length ? (
                auctionItems.map((item) => {
                  const isLeading = item.userBid >= item.currentBid;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-10 w-10 object-cover rounded-md border"
                        />
                        <span>{item.title}</span>
                      </TableCell>
                      <TableCell>৳ {item.userBid.toLocaleString()}</TableCell>
                      <TableCell>৳ {item.currentBid.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${isLeading ? 'text-green-600' : 'text-red-500'}`}
                        >
                          {isLeading ? 'Leading' : 'Outbid'}
                        </span>
                      </TableCell>
                      <TableCell className="flex justify-end">
                        {(() => {
                          const product = auctionProductList.find((p) => p._id === item.id);
                          const auctionEnded = product && new Date(product.endTime) < new Date();
                          const isWinner = product && product.highestBidder === user?.id;
                          const hasPaid = hasPaidForAuction(item.id);

                          if (isWinner && auctionEnded && !hasPaid) {
                            return (
                              <Button onClick={() => handleNavigate(item.id)}>
                                <CircleCheckBig className="mr-1" /> Checkout
                              </Button>
                            );
                          } else if (isWinner && auctionEnded && hasPaid) {
                            return <span className="text-green-600 font-medium my-4">Paid</span>;
                          } else if (!isWinner && auctionEnded) {
                            return <span className="text-red-500 font-medium my-4">Sold Out</span>;
                          } else {
                            return null;
                          }
                        })()}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-10">
                    You haven't placed any bids yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

export default MyBids;
