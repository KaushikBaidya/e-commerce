import { useSelector } from 'react-redux';

const ShoppingOrderDetails = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full capitalize space-y-6">
      <div className="grid grid-cols-12 gap-4 bg-white p-5 rounded-xl shadow-sm border">
        <div className="col-span-6 space-y-3">
          <h2 className="text-lg font-medium text-foreground">Order Summary</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <p className="font-medium">Order ID</p>
            <span className="text-foreground font-medium"># {orderDetails?._id}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <p className="font-medium">Order Date</p>
            <span>{orderDetails?.orderDate.split('T')[0]}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <p className="font-medium">Order Price</p>
            <span className="text-primary font-medium">৳ {orderDetails?.totalAmount}</span>
          </div>
        </div>

        <div className="col-span-1 flex justify-center">
          <div className="w-0.5 h-full bg-gray-200" />
        </div>

        <div className="col-span-5 space-y-3">
          <h2 className="text-lg font-medium text-foreground">Status</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <p className="font-medium">Order Status</p>
            <span
              className={`rounded-full text-white text-xs font-medium px-3 py-1 ${
                orderDetails?.orderStatus === 'confirmed'
                  ? 'bg-blue-500'
                  : orderDetails?.orderStatus === 'pending'
                    ? 'bg-yellow-500'
                    : orderDetails?.orderStatus === 'in-progress'
                      ? 'bg-orange-500'
                      : orderDetails?.orderStatus === 'shipped'
                        ? 'bg-purple-500'
                        : orderDetails?.orderStatus === 'cancelled'
                          ? 'bg-red-500'
                          : orderDetails?.orderStatus === 'delivered'
                            ? 'bg-green-500'
                            : orderDetails?.orderStatus === 'rejected'
                              ? 'bg-red-600'
                              : 'bg-gray-600'
              }`}
            >
              {orderDetails?.orderStatus}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <p className="font-medium">Payment Status</p>
            <span className="text-foreground font-medium">{orderDetails?.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="text-lg font-medium mb-4 text-foreground">Items</h2>
        <div className="grid grid-cols-3 gap-3 font-medium border-b pb-2 text-sm text-muted-foreground">
          <span className="text-center">Product</span>
          <span className="text-center">Quantity</span>
          <span className="text-center">Price</span>
        </div>
        <ul className="grid gap-2 py-2 max-h-44 overflow-y-auto">
          {orderDetails?.cartItems?.length > 0 ? (
            orderDetails.cartItems.map((item, index) => (
              <li
                key={index}
                className="grid grid-cols-3 justify-items-center text-sm py-2 border-b text-foreground"
              >
                <span className="capitalize">{item.title}</span>
                <span>{item.quantity}</span>
                <span>৳ {item.price}</span>
              </li>
            ))
          ) : (
            <li className="col-span-3 text-center text-gray-500">No items found.</li>
          )}
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border space-y-2">
        <h2 className="text-lg font-medium text-foreground">Shipping Address</h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <span className="lowercase">{user?.email}</span>
          <span>{orderDetails?.addressInfo?.address}</span>
          <span>{orderDetails?.addressInfo?.city}</span>
          <span>{orderDetails?.addressInfo?.pincode}</span>
          <span>{orderDetails?.addressInfo?.phone}</span>
          <span>{orderDetails?.addressInfo?.notes}</span>
        </div>
      </div>
    </div>
  );
};

export default ShoppingOrderDetails;
