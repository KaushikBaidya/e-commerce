import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import AdminHeader from './header';
import AdminSidebar from './sidebar';

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="flex min-h-screen w-full text-foreground">
      {/* Sidebar */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex flex-col bg-muted/40 p-4 md:p-6 max-h-[90vh] overflow-y-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
