import { Card, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedbackList from './feedback-components/FeedbackList';
import UserMessages from './feedback-components/UserMessages';

const Feedbacks = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle className="text-xl font-medium mt-4 ml-4">User Feedbacks</CardTitle>
      </Card>
      <div>
        <div className="flex flex-col border bg-background p-2 md:p-6 shadow-sm">
          <Tabs defaultValue="feedback" className="rounded-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="message">User Message</TabsTrigger>
            </TabsList>
            <TabsContent value="feedback">
              <div>
                <FeedbackList />
              </div>
            </TabsContent>
            <TabsContent value="message">
              <div>
                <UserMessages />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
