import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';

const FeedbackTable = ({ Feedbacks }) => {
  if (Feedbacks.length === 0) {
    return <p className="text-gray-500 text-center py-10">No feedback found.</p>;
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
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
          {Feedbacks.map((item) => (
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

export default FeedbackTable;
