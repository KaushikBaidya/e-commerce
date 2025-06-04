import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  fetchAuctionProductDetails,
  resetAuctionProductDetails,
} from '@/store/shop/auction-products-slice';
import { placeAuctionBid } from '@/store/shop/auction-slice';
import { Gavel, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import AnimatedList from '../common/AnimatedList';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

const AuctionDetails = ({ open, setOpen, auctionProductDetails }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Local state to store live updates from socket
  const [liveAuction, setLiveAuction] = useState(auctionProductDetails);
  const [socket, setSocket] = useState(null);

  // Update local state when auctionProductDetails changes
  useEffect(() => {
    setLiveAuction(auctionProductDetails);
  }, [auctionProductDetails]);

  useEffect(() => {
    if (!open || !auctionProductDetails) return;

    // Connect to Socket.IO server
    const socketClient = io('http://localhost:5000', {
      withCredentials: true,
    });

    setSocket(socketClient);

    // Join auction room by auction ID
    socketClient.emit('joinAuction', auctionProductDetails._id);

    // Listen for new bids pushed from backend
    socketClient.on('newBid', (data) => {
      if (data.auctionId === auctionProductDetails._id) {
        setLiveAuction((prev) => ({
          ...prev,
          currentBid: data.currentBid,
          highestBidder: data.highestBidder,
          bidHistory: data.bidHistory,
        }));
      }
    });

    return () => {
      socketClient.disconnect();
      setSocket(null);
    };
  }, [open, auctionProductDetails]);

  const bids = liveAuction.bidHistory?.slice().reverse() || [];

  const handleBidSelect = (bid, index) => {
    console.log('Selected bid:', bid, index);
    // You can add behavior like showing more info
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(resetAuctionProductDetails());
    if (socket) socket.disconnect();
  };

  const handlePlaceBid = (productId) => {
    if (!user || user.role !== 'user') {
      return toast.error('Please login to place bid', {
        action: { label: 'close' },
      });
    }

    const item = liveAuction;
    if (!item)
      return toast.error('No auction item found', {
        action: { label: 'close' },
      });

    if (item.highestBidder === user.id) {
      return toast.error('You are already the highest bidder', {
        action: { label: 'close' },
      });
    }

    const now = new Date();
    if (new Date(item.startTime) > now)
      return toast.error("Auction hasn't started yet", {
        action: { label: 'close' },
      });
    if (new Date(item.endTime) < now)
      return toast.error('Auction has already ended', {
        action: { label: 'close' },
      });

    const nextBid = item.currentBid ? item.currentBid + item.bidIncrement : item.startingBid;

    dispatch(
      placeAuctionBid({
        userId: user.id,
        auctionId: productId,
        bidAmount: nextBid,
      })
    )
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAuctionProductDetails(productId));
          toast.success('Bid placed successfully', {
            action: { label: 'close' },
          });
        } else {
          toast.error('Failed to place bid', {
            action: { label: 'close' },
          });
        }
      })
      .catch(() =>
        toast.error('Something went wrong', {
          action: { label: 'close' },
        })
      );
  };

  if (!liveAuction) return <div className="text-center py-20">Loading...</div>;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[65vw] max-h-[80vh] overflow-y-auto">
        <div className="relative flex flex-col gap-4">
          <div className="relative w-full sm:h-80 md:h-full mt-4">
            <img
              src={liveAuction.image}
              alt={liveAuction.title}
              className="w-full h-[500px] object-cover rounded-md"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Badge
                className={
                  liveAuction?.status === 'running'
                    ? 'bg-green-500'
                    : liveAuction?.status === 'upcoming'
                      ? 'bg-yellow-500'
                      : 'bg-red-600'
                }
              >
                {liveAuction?.status?.charAt(0).toUpperCase() + liveAuction?.status?.slice(1)}
              </Badge>
              {liveAuction?.status === 'closed' && (
                <Badge className={liveAuction?.isSold === true ? 'bg-green-500' : 'bg-orange-500'}>
                  {liveAuction?.isSold ? 'Sold' : 'Unsold'}
                </Badge>
              )}
            </div>
          </div>
          <div className="px-4 md:px-0">
            {liveAuction?.status === 'running' && (
              <Button
                onClick={() => handlePlaceBid(liveAuction._id)}
                disabled={!user}
                className="w-full"
              >
                <Gavel />
                {user ? `Place Bid` : `Register to Bid`}
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <DialogTitle className="text-2xl md:text-3xl font-semibold">
              {liveAuction.title}
            </DialogTitle>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{liveAuction.artist}</span>
            </div>
          </div>

          <p className="text-sm text-gray-700">{liveAuction.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500">Starting Bid</span>
              <span className="font-semibold text-lg text-primary">
                ৳ {liveAuction.startingBid}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Current Bid</span>
              <span className="font-semibold text-lg text-primary">৳ {liveAuction.currentBid}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500">Bid Increment</span>
              <span className="font-semibold text-lg text-primary">
                ৳ {liveAuction.bidIncrement}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-medium mb-2">Bid History</h3>
            {bids.length ? (
              <AnimatedList
                items={bids}
                onItemSelect={handleBidSelect}
                showGradients={true}
                className="max-w-full"
                itemClassName="!bg-gray-100 hover:!bg-gray-200"
                displayScrollbar={true}
                // Optional: initialSelectedIndex={0}
              />
            ) : (
              <p className="text-gray-500 text-sm italic">No bids yet</p>
            )}
          </div>
          {/* <div>
            <h3 className="text-base md:text-lg font-medium mb-2">Bid History</h3>
            {liveAuction.bidHistory.length ? (
              <ul className="divide-y text-sm border rounded-md bg-gray-50 h-[300px] overflow-y-auto">
                {liveAuction.bidHistory
                  .slice()
                  .reverse()
                  .map((bid) => (
                    <li key={bid._id} className="flex justify-between items-center px-3 py-2">
                      <span>Bidder: {bid.bidder.slice(-6)}</span>
                      <span className="font-medium">৳ {bid.amount}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">No bids yet</p>
            )}
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionDetails;
