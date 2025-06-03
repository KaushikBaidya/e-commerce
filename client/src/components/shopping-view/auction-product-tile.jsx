import { format } from 'date-fns';
import { CalendarDays, Clock, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const AuctionProductTile = ({ auctionProduct, handleGetProductDetails }) => {
  return (
    <Card
      className="w-full max-w-sm mx-auto shadow-md cursor-pointer transition hover:shadow-lg"
      onClick={() => handleGetProductDetails(auctionProduct?._id)}
    >
      <div className="relative">
        <img
          src={auctionProduct?.image}
          alt={auctionProduct?.title}
          className="w-full h-[250px] sm:h-[300px] object-cover rounded-t-lg"
        />
      </div>

      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl sm:text-2xl font-medium leading-snug">{auctionProduct?.title}</h2>

        <div className="flex flex-wrap justify-between items-center text-muted-foreground gap-2">
          <span className="text-sm flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-medium">{auctionProduct?.artist}</span>
          </span>
          <span className="flex items-center gap-2">
            <Badge
              className={
                auctionProduct?.status === 'running'
                  ? 'bg-green-500'
                  : auctionProduct?.status === 'upcoming'
                    ? 'bg-yellow-500'
                    : 'bg-red-600'
              }
            >
              {auctionProduct?.status?.charAt(0).toUpperCase() + auctionProduct?.status?.slice(1)}
            </Badge>
            {auctionProduct?.status === 'closed' && (
              <Badge className={auctionProduct?.isSold === true ? 'bg-green-500' : 'bg-orange-500'}>
                {auctionProduct?.isSold ? 'Sold' : 'Unsold'}
              </Badge>
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Starting Bid</span>
            <span className="font-medium text-base sm:text-lg">
              ৳ {auctionProduct?.startingBid}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Current Bid</span>
            <span className="font-medium text-base sm:text-lg">
              ৳ {auctionProduct?.currentBid || auctionProduct?.startingBid}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground">Bid Increment</span>
            <span className="font-medium">৳ {auctionProduct?.bidIncrement}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              Start Time
            </span>
            <span>{format(new Date(auctionProduct?.startTime), 'PPP p')}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              End Time
            </span>
            <span>{format(new Date(auctionProduct?.endTime), 'PPP p')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionProductTile;
