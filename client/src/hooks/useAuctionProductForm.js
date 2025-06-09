import {
  addNewAuctionProduct,
  editAuctionProduct,
  fetchAllAuctionProducts,
} from '@/store/admin/auction-products-slice';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const initialFormData = {
  image: null,
  imagePublicId: null,
  title: '',
  description: '',
  artist: '',
  startingBid: '',
  bidIncrement: '',
  startTime: '',
  endTime: '',
  isActive: '',
};

export const useAuctionProductForm = () => {
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();

  const methods = useForm({
    defaultValues: initialFormData,
    mode: 'onChange',
    resolver: undefined, 
    criteriaMode: 'all',
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const payloadData = {
      ...data,
      image: uploadedImageUrl,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : '',
      endTime: data.endTime ? new Date(data.endTime).toISOString() : '',
    };

    try {
      const action = currentEditedId
        ? editAuctionProduct({ id: currentEditedId, formData: payloadData })
        : addNewAuctionProduct(payloadData);

      const result = await dispatch(action);

      if (result?.payload?.success) {
        dispatch(fetchAllAuctionProducts());
        handleCloseDialog();
        toast.success(result.payload.message, {
          action: { label: 'close' },
        });
      }
    } catch (error) {
      toast.error('An error occurred while saving the product');
    }
  };

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleEditProduct = (product) => {
    setCurrentEditedId(product._id);
    setUploadedImageUrl(product.image || '');
    reset({
      title: product.title || '',
      description: product.description || '',
      artist: product.artist || '',
      startingBid: product.startingBid || '',
      bidIncrement: product.bidIncrement || '',
      startTime: formatDateTimeLocal(product.startTime),
      endTime: formatDateTimeLocal(product.endTime),
      isActive: product.isActive || '',
    });
  };

  const handleCloseDialog = () => {
    setCurrentEditedId(null);
    setImageFile(null);
    setUploadedImageUrl('');
    setImageLoadingState(false);
    reset(initialFormData);
  };

  return {
    methods,
    handleSubmit,
    onSubmit,
    isSubmitting,
    currentEditedId,
    imageFile,
    setImageFile,
    uploadedImageUrl,
    setUploadedImageUrl,
    imageLoadingState,
    setImageLoadingState,
    handleEditProduct,
    handleCloseDialog,
  };
};
