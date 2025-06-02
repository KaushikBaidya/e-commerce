import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AuctionWinners = () => {
  return (
    <Card>
      <CardHeader className="mt-4">
        <CardTitle>Auction Winners</CardTitle>
        <CardDescription className="hidden">List of auction winners</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default AuctionWinners;
