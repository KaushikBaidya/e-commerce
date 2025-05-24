import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrdersList from "@/components/shopping-view/orders";
import MyBids from "@/components/shopping-view/mybids";

const ShoppingAccount = () => {
	return (
		<div className="flex flex-col">
			<div className="relative h-[300px] w-full overflow-hidden">
				<img src={accImg} alt={"cover-image"} />
			</div>
			<div className="container mx-auto grid grid-cols-1 gap-8 py-8">
				<div className="flex flex-col border bg-background p-6 shadow-sm">
					<Tabs defaultValue="orders">
						<TabsList>
							<TabsTrigger value="orders">My Bids</TabsTrigger>
							{/* <TabsTrigger value="orders">Orders</TabsTrigger> */}
							<TabsTrigger value="address">Address</TabsTrigger>
						</TabsList>
						<TabsContent value="orders">
							<MyBids />
						</TabsContent>
						{/* <TabsContent value="orders">
							<ShoppingOrdersList />
						</TabsContent> */}
						<TabsContent value="address">
							<Address />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default ShoppingAccount;
