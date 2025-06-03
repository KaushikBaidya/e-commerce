import {
  deleteAuctionProduct,
  fetchAllAuctionProducts,
} from '@/store/admin/auction-products-slice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export const useAuctionProductActions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);

  const dispatch = useDispatch();

  const openDeleteDialog = (productId) => {
    setCurrentDeleteId(productId);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      const result = await dispatch(deleteAuctionProduct(currentDeleteId));

      if (result?.payload?.success) {
        dispatch(fetchAllAuctionProducts());
        toast.success(result.payload.message, {
          action: { label: 'close' },
        });
      }
    } catch (error) {
      toast.error('An error occurred while deleting the product');
    } finally {
      setCurrentDeleteId(null);
      setOpenDialog(false);
    }
  };

  return {
    openDialog,
    setOpenDialog,
    handleDelete,
    openDeleteDialog,
  };
};
