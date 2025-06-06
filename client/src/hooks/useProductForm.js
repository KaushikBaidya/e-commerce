import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { addNewProduct, editProduct, fetchAllProducts } from '@/store/admin/products-slice';

const productSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : Number(originalValue)))
    .positive('Price must be positive')
    .required('Price is required'),
  salePrice: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return null;
      }
      const numValue = Number(originalValue);
      return isNaN(numValue) ? null : numValue;
    })
    .test('sale-price-min', 'Sale price cannot be negative', function (value) {
      return value === null || (typeof value === 'number' && value >= 0);
    })
    .test('sale-price-validation', 'Sale price must be less than regular price', function (value) {
      const { price } = this.parent;
      if (value !== null && value !== undefined && value > 0 && price) {
        return value < price;
      }
      return true;
    }),
  totalStock: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : Number(originalValue)))
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
});

const initialFormData = {
  image: null,
  imagePublicId: null,
  title: '',
  description: '',
  category: '',
  price: '',
  salePrice: '',
  totalStock: '',
};

export const useProductForm = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: initialFormData,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid, isSubmitting },
  } = methods;

  const watchedValues = watch();

  const onSubmit = async (formData) => {
    const submitData = {
      ...formData,
      image: uploadedImageUrl || formData.image,
      imagePublicId: formData.imagePublicId,
    };

    try {
      if (currentEditedId !== null) {
        const data = await dispatch(editProduct({ id: currentEditedId, formData: submitData }));
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          handleCloseDialog();
          toast.success(data?.payload?.message, {
            action: { label: 'close' },
          });
        }
      } else {
        const data = await dispatch(addNewProduct(submitData));
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          handleCloseDialog();
          toast.success(data?.payload?.message, {
            action: { label: 'close' },
          });
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setCurrentEditedId(null);
    setImageFile(null);
    setUploadedImageUrl('');
    reset(initialFormData);
  };

  const handleEditProduct = (product) => {
    setCurrentEditedId(product?._id);

    reset({
      title: product?.title || '',
      description: product?.description || '',
      category: product?.category || '',
      price: product?.price || '',
      salePrice: product?.salePrice || 0,
      totalStock: product?.totalStock || '',
      image: product?.image || null,
      imagePublicId: product?.imagePublicId || null,
    });

    setUploadedImageUrl(product?.image || '');
  };

  const isFormValid = () => {
    const { title, description, category, price, totalStock } = watchedValues;
    const requiredFieldsFilled = title && description && category && price && totalStock;
    const hasImage = uploadedImageUrl || watchedValues.image;

    return requiredFieldsFilled && hasImage && !imageLoadingState && isValid;
  };

  useEffect(() => {
    if (uploadedImageUrl) {
      setValue('image', uploadedImageUrl);
    }
  }, [uploadedImageUrl, setValue]);

  return {
    methods,
    handleSubmit,
    onSubmit,
    isFormValid,
    isSubmitting,
    imageFile,
    setImageFile,
    uploadedImageUrl,
    setUploadedImageUrl,
    imageLoadingState,
    setImageLoadingState,
    currentEditedId,
    handleEditProduct,
    handleCloseDialog,
  };
};
