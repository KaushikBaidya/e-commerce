import { AlignJustify, Bell, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { BsExclamationDiamond } from 'react-icons/bs';
import { FiCheckSquare } from 'react-icons/fi';
import { IoTrashBinOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Label } from 'recharts';

import {
  deleteAdminNotification,
  fetchAdminNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/store/admin/notification-slice';
import { logoutUser } from '@/store/auth-slice';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { notifications, isLoading } = useSelector((state) => state.adminNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth/login');
  };

  const handleNavigate = () => {
    navigate('/admin/notifications');
  };

  useEffect(() => {
    if (user !== null) dispatch(fetchAdminNotifications());
  }, [dispatch, user]);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className={'lg:hidden sm:block'}>
        <AlignJustify />
        <span className="sr-only">Admin Panel</span>
      </Button>
      <div className="flex flex-1 justify-end gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer">
              <Bell size={25} />
              <Label className="sr-only">Notifications</Label>
              {unreadCount > 0 && (
                <span className="absolute top-[-5px] right-[-10px] font-semibold text-sm bg-black text-white rounded-full px-2">
                  {unreadCount}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <div className="flex items-center justify-between px-2 py-1">
              <Button onClick={() => dispatch(markAllNotificationsAsRead())} variant={'outline'}>
                Mark all read
              </Button>
              <Button onClick={handleNavigate} variant={'link'}>
                All Notifications
              </Button>
            </div>
            {isLoading ? (
              <DropdownMenuItem>Loading...</DropdownMenuItem>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification._id}
                  className="flex flex-col gap-2 items-start text-sm group"
                >
                  <div className="w-full flex items-center justify-between">
                    <p
                      className={`flex-1 ${
                        notification.isRead ? 'text-muted-foreground' : 'font-medium'
                      }`}
                    >
                      {notification.message}
                    </p>
                    <div className="flex gap-2 items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-800"
                        title="Mark as read"
                        onClick={() => dispatch(markNotificationAsRead(notification?._id))}
                      >
                        <FiCheckSquare />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        onClick={() => dispatch(deleteAdminNotification(notification?._id))}
                      >
                        <IoTrashBinOutline />
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="flex flex-col items-center justify-center py-5 gap-2">
                <BsExclamationDiamond size={30} />
                <p>No notifications</p>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
