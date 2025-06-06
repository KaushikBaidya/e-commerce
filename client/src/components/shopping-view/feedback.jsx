import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUserFeedbacks } from '@/store/shop/feedback-slice';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FeedbackForm from './FeedbackForm';
import FeedbackTable from './FeedbackTable';

const Feedback = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { feedbacks } = useSelector((state) => state.shopFeedback);
  const dispatch = useDispatch();
  const userId = user?.id;

  useEffect(() => {
    if (user !== null) dispatch(getUserFeedbacks(userId));
  }, [dispatch, userId]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="grid gap-6 md:gap-8 max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[60vw] overflow-y-auto max-h-[95vh]">
            <DialogTitle>Add Feedback</DialogTitle>
            <FeedbackForm userId={userId} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <FeedbackTable Feedbacks={feedbacks} />
    </div>
  );
};

export default Feedback;
