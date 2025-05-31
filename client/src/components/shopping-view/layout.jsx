import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './footer';
import ShoppingHeader from './header';

const ShoppingLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      <ShoppingHeader open={openSidebar} setOpen={setOpenSidebar} />
      <main className="flex flex-col w-full py-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingLayout;
