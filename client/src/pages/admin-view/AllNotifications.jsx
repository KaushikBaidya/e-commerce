import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  deleteAllAdminNotifications,
  fetchAdminNotifications,
  markAllNotificationsAsRead,
} from '@/store/admin/notification-slice';
import { useEffect } from 'react';
import { FaBell, FaCheckCircle, FaInbox } from 'react-icons/fa';
import { MdMarkEmailRead } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const AllNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, isLoading } = useSelector((state) => state.adminNotifications);

  const handleDeleteAllNotifications = () => {
    dispatch(deleteAllAdminNotifications())
      .then(() => {
        toast.success('All notifications deleted successfully!', { action: { label: 'close' } });
      })
      .catch((error) => {
        console.error('Failed to delete all notifications:', error);
      });
    dispatch(fetchAdminNotifications());
  };

  useEffect(() => {
    if (user !== null) dispatch(fetchAdminNotifications());
  }, [dispatch, user]);

  return (
    <div>
      <Card className="py-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FaBell /> All Notifications
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => dispatch(markAllNotificationsAsRead())}
              variant={'outline'}
              className="flex items-center gap-2"
            >
              <MdMarkEmailRead />
              Mark all read
            </Button>
            <Button
              variant={'destructive'}
              onClick={handleDeleteAllNotifications}
              className="flex items-center gap-2"
            >
              Delete All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center text-center text-muted-foreground">
              <FaInbox className="text-4xl mb-2" />
              <p>No notifications to show.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-start justify-between bg-muted p-3 rounded-md"
              >
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.isRead ? (
                      <span className="inline-flex items-center text-green-600">
                        <FaCheckCircle className="mr-1" /> Read
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">Unread</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllNotifications;
