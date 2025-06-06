import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getFeedbacks } from '@/store/admin/feedback-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FeedbackList = () => {
  const dispatch = useDispatch();
  const { feedbacks } = useSelector((state) => state.adminFeedback);
  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="flex items-center justify-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell className="capitalize">{item.feedbackType}</TableCell>
              <TableCell>{item.rating} ★</TableCell>
              <TableCell>{item.createdAt.split('T')[0]}</TableCell>
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

export default FeedbackList;
