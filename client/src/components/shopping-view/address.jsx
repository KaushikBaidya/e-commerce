import { addressFormControls } from '@/config';
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses,
} from '@/store/shop/address-slice';
import { CircleSlash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import CommonForm from '../common/common-form-component';
import Loading from '../common/loading-component';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AddressCard from './adress-card';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const addressValidationSchema = Yup.object({
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  pincode: Yup.string()
    .matches(/^\d{4,10}$/, 'Pincode must be 4 to 10 digits')
    .required('Pincode is required'),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits')
    .required('Phone is required'),
  notes: Yup.string().max(200, 'Notes must be under 200 characters'),
});

const initialState = {
  address: '',
  city: '',
  phone: '',
  pincode: '',
  notes: '',
};

const Address = ({ selectedId, setCurrentSelectedAddress }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { addressList, isLoading } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();

  // Initialize react-hook-form
  const methods = useForm({
    resolver: yupResolver(addressValidationSchema),
    defaultValues: initialState,
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isValid, errors },
  } = methods;

  // Watch form values to check if form is filled
  const watchedValues = watch();
  const isFormFilled = Object.values(watchedValues).some((value) => value && value.trim() !== '');

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Check address limit for new addresses
      if (addressList.length >= 3 && currentEditId === null) {
        toast.error('You can add only 3 addresses', {
          action: { label: 'close' },
        });
        setIsSubmitting(false);
        return;
      }

      if (currentEditId !== null) {
        // Edit existing address
        const result = await dispatch(
          editAddress({
            userId: user?.id,
            addressId: currentEditId,
            formData,
          })
        );

        if (result?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          setCurrentEditId(null);
          reset(initialState);
          toast.success('Address updated successfully', {
            action: { label: 'close' },
          });
        } else {
          toast.error(result?.payload?.message || 'Failed to update address', {
            action: { label: 'close' },
          });
        }
      } else {
        // Add new address
        const result = await dispatch(addNewAddress({ ...formData, userId: user?.id }));

        if (result?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          reset(initialState);
          toast.success(result?.payload?.message || 'Address added successfully', {
            action: { label: 'close' },
          });
        } else {
          toast.error(result?.payload?.message || 'Failed to add address', {
            action: { label: 'close' },
          });
        }
      }
    } catch (error) {
      console.error('Address operation error:', error);
      toast.error('An error occurred while processing your request', {
        action: { label: 'close' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = (getCurrentAddress) => {
    setCurrentEditId(getCurrentAddress._id);
    // Reset form with current address data
    reset({
      address: getCurrentAddress?.address || '',
      city: getCurrentAddress?.city || '',
      phone: getCurrentAddress?.phone || '',
      pincode: getCurrentAddress?.pincode || '',
      notes: getCurrentAddress?.notes || '',
    });
  };

  const handleDeleteAddress = async (getCurrentAddress) => {
    try {
      const result = await dispatch(
        deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
      );

      if (result?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast.success(result?.payload?.message || 'Address deleted successfully', {
          action: { label: 'close' },
        });
      } else {
        toast.error(result?.payload?.message || 'Failed to delete address', {
          action: { label: 'close' },
        });
      }
    } catch (error) {
      console.error('Delete address error:', error);
      toast.error('An error occurred while deleting the address', {
        action: { label: 'close' },
      });
    }
  };

  const cancelEdit = () => {
    setCurrentEditId(null);
    reset(initialState);
  };

  // Debug form validation
  const onError = (errors) => {
    console.log('Form validation errors:', errors);
    Object.values(errors).forEach((error) => {
      if (error?.message) {
        toast.error(error.message, {
          action: { label: 'close' },
        });
      }
    });
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Card>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-2">
          {addressList && addressList.length > 0 ? (
            addressList.map((address, index) => (
              <AddressCard
                key={address._id || index}
                selectedId={selectedId}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                addressInfo={address}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">No addresses added yet.</div>
          )}
        </div>
      )}

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{currentEditId ? 'Edit Address' : 'Add New Address'}</CardTitle>
        {currentEditId && (
          <Button onClick={cancelEdit} variant="outline">
            <CircleSlash className="mr-1 h-4 w-4" /> Cancel
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <CommonForm
          formControls={addressFormControls}
          methods={methods}
          onSubmit={handleSubmit(onSubmit, onError)}
          buttonText={currentEditId ? 'Update Address' : 'Add New Address'}
          isBtnDisabled={!isFormFilled || isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
