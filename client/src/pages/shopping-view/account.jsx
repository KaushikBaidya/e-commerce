import Address from '@/components/shopping-view/address';
import Feedback from '@/components/shopping-view/feedback';
import MyBids from '@/components/shopping-view/mybids';
import ShoppingOrdersList from '@/components/shopping-view/orders';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import accImg from '../../assets/account.jpg';

const ShoppingAccount = () => {
  return (
    <div className="flex flex-col">
      <div className="relative h-48 lg:h-80 w-full overflow-hidden">
        <img src={accImg} alt={'cover-image'} />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-4 lg:py-8">
        <div className="flex flex-col border bg-background p-2 md:p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="mybids">My Bids</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrdersList />
            </TabsContent>
            <TabsContent value="mybids">
              <MyBids />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
            <TabsContent value="feedback">
              <Feedback />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
