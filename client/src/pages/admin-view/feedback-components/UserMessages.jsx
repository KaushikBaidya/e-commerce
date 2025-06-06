import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getUserMessages } from '@/store/admin/feedback-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UserMessages = () => {
  const dispatch = useDispatch();
  const { userMessage } = useSelector((state) => state.adminFeedback);
  useEffect(() => {
    dispatch(getUserMessages());
  }, [dispatch]);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="flex items-center justify-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userMessage.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.message}</TableCell>
              <TableCell className="flex justify-center">
                <Button>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserMessages;
