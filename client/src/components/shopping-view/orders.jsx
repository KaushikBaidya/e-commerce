import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/shop/order-slice';
import { View } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../common/loading-component';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ShoppingOrderDetails from './order-details';

const ShoppingOrdersList = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium pt-4 px-2">Order History</CardTitle>
      </CardHeader>
      {isLoading ? (
        <Loading />
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Id</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>@_{order?._id} </TableCell>
                    <TableCell>{order?.orderDate.split('T')[0]} </TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          order?.orderStatus === 'confirmed'
                            ? 'bg-blue-400'
                            : order?.orderStatus === 'pending'
                              ? 'bg-yellow-400'
                              : order?.orderStatus === 'in-progress'
                                ? 'bg-orange-500'
                                : order?.orderStatus === 'shipped'
                                  ? 'bg-purple-500'
                                  : order?.orderStatus === 'cancelled'
                                    ? 'bg-red-500'
                                    : order?.orderStatus === 'delivered'
                                      ? 'bg-green-500'
                                      : order?.orderStatus === 'rejected'
                                        ? 'bg-red-600'
                                        : 'bg-gray-600'
                        }`}
                      >
                        {order?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell> ৳ {order?.totalAmount} </TableCell>
                    <TableCell className="flex justify-end">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button onClick={() => handleFetchOrderDetails(order?._id)}>
                            <View className="mr-2" /> View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[90vw] sm:max-w[80vw] lg:max-w-[50vw]">
                          <DialogTitle>Order Details</DialogTitle>
                          <ShoppingOrderDetails orderDetails={orderDetails} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-10">
                    No orders found
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

export default ShoppingOrdersList;
