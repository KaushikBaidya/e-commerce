import { Gem, LayoutDashboard, LayoutList, ShoppingBag, Trophy, User } from 'lucide-react';
import { Fragment } from 'react';
import { AiOutlineProduct } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings, MdOutlineFeedback } from 'react-icons/md';
import { RiAuctionLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

const adminSidebarLinks = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/admin/dashboard',
    icons: <LayoutDashboard />,
  },
  {
    id: 'users',
    name: 'Users',
    path: '/admin/users',
    icons: <User />,
  },
  {
    id: 'winners',
    name: 'Auction Winners',
    path: '/admin/auction-winners',
    icons: <Trophy color="#e78529" />,
  },
  {
    id: 'auction-products',
    name: 'Auction Products',
    path: '/admin/auction-products',
    icons: <Gem color="#e7cb29" />,
  },
  {
    id: 'products',
    name: 'Products',
    path: '/admin/products',
    icons: <AiOutlineProduct size={25} />,
  },
  {
    id: 'auction-orders',
    name: 'Auction Orders',
    path: '/admin/auction-orders',
    icons: <RiAuctionLine />,
  },
  {
    id: 'orders',
    name: 'Orders',
    path: '/admin/orders',
    icons: <LayoutList />,
  },
  {
    id: 'features',
    name: 'Features',
    path: '/admin/features',
    icons: <ShoppingBag />,
  },
  {
    id: 'feedback',
    name: 'Feedback',
    path: '/admin/feedbacks',
    icons: <MdOutlineFeedback size={25} />,
  },
];

const MenuItems = ({ setOpen }) => {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarLinks.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 rounded-md px-4 py-2 cursor-pointer hover:bg-[#fffbe2] text-gray-500 hover:text-gray-800"
          onClick={() => {
            navigate(item.path);
            setOpen ? setOpen(false) : null;
          }}
        >
          {item.icons}
          <span>{item.name}</span>
        </div>
      ))}
    </nav>
  );
};

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-80">
          <div className="h-full flex flex-col bg-white text-foreground">
            <SheetHeader className="border-b">
              <SheetTitle className="flex items-center gap-2 text-2xl font-medium">
                <MdOutlineAdminPanelSettings size={30} />
                <span>Admin Pannel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 max-h-[95vh] overflow-y-auto flex-col border-r bg-background p-4 lg:flex">
        <div
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <MdOutlineAdminPanelSettings size={30} />
          <h2 className="text-2xl font-medium">Admin Pannel</h2>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
};

export default AdminSidebar;
