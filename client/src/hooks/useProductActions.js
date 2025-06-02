import { deleteProduct, fetchAllProducts } from '@/store/admin/products-slice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export const useProductActions = () => {
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  const openDeleteDialog = (productId) => {
    setCurrentDeleteId(productId);
    setOpenDialog(true);
  };

  const handleDelete = () => {
    dispatch(deleteProduct(currentDeleteId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success(data?.payload?.message, {
          action: { label: 'close' },
        });
      }
      setCurrentDeleteId(null);
    });
  };

  return {
    currentDeleteId,
    openDialog,
    setOpenDialog,
    openDeleteDialog,
    handleDelete,
  };
};
