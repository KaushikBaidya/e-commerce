import { format } from 'date-fns';
import { CalendarDays, Clock, Edit, Trash2, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';

const AdminAuctionProductTile = ({
  auctionProduct,
  onEdit, // New prop for edit callback
  onDelete, // New prop for delete callback
  // Legacy props (keeping for backward compatibility if needed)
  setFormData,
  setOpenCrtProdDialog,
  setCurrentEditedId,
  openDeleteDialog,
}) => {
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleEdit = () => {
    // Use new modular approach if onEdit prop is provided
    if (onEdit) {
      onEdit(auctionProduct);
    }
    // Fallback to legacy approach for backward compatibility
    else if (setFormData && setOpenCrtProdDialog && setCurrentEditedId) {
      setOpenCrtProdDialog(true);
      setCurrentEditedId(auctionProduct?._id);
      setFormData({
        ...auctionProduct,
        startTime: formatDateTimeLocal(auctionProduct.startTime),
        endTime: formatDateTimeLocal(auctionProduct.endTime),
      });
    }
  };

  const handleDelete = () => {
    // Use new modular approach if onDelete prop is provided
    if (onDelete) {
      onDelete(auctionProduct?._id);
    }
    // Fallback to legacy approach for backward compatibility
    else if (openDeleteDialog) {
      openDeleteDialog(auctionProduct?._id);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-md">
      <div>
        <div className="relative">
          <img
            src={auctionProduct?.image}
            alt={auctionProduct?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>

        <CardContent className="p-4 space-y-4">
          <h2 className="text-2xl font-semibold">{auctionProduct?.title}</h2>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="font-medium">{auctionProduct?.artist}</span>
            </span>
            <span className="flex items-center gap-1">
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
              <Badge className={auctionProduct?.isSold === true ? 'bg-green-500' : 'bg-orange-500'}>
                {auctionProduct?.isSold ? 'Sold' : 'Unsold'}
              </Badge>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Starting Bid</span>
              <span className="font-medium text-lg">৳ {auctionProduct?.startingBid}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Current Bid</span>
              <span className="font-medium text-lg">
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
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              End Time
            </span>
            <span>{format(new Date(auctionProduct?.endTime), 'PPP p')}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between px-4 pb-4">
          <Button onClick={handleEdit}>
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default AdminAuctionProductTile;
