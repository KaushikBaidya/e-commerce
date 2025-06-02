import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { addAuctionProductElements } from '@/config';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import AdminAuctionProductTile from '@/components/admin-view/auction-product-tile';
import ImageUpload from '@/components/admin-view/image-upload';
import CommonForm from '@/components/common/form';
import NoItemFound from '@/components/common/no-item-found';

import DeleteDialog from '@/components/common/delete-dialog';
import Loading from '@/components/common/loading-component';
import { Input } from '@/components/ui/input';
import {
  addNewAuctionProduct,
  deleteAuctionProduct,
  editAuctionProduct,
  fetchAllAuctionProducts,
} from '@/store/admin/auction-products-slice';
import { Search } from 'lucide-react';

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
  isActive: false,
};

const AuctionProductsView = () => {
  const [openCrtProdDialog, setOpenCrtProdDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uloadedImageUrl, setUloadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const { auctionProductList, isLoading } = useSelector((state) => state.adminAuctionProduct);

  const dispatch = useDispatch();

  console.log('Auction Products:', auctionProductList);

  const filteredAuctionProducts = auctionProductList?.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (e) => {
    e.preventDefault();

    const payloadData = {
      ...formData,
      image: formData.image || uloadedImageUrl,
    };

    currentEditedId !== null
      ? dispatch(editAuctionProduct({ id: currentEditedId, formData: payloadData })).then(
          (data) => {
            if (data?.payload?.success) {
              dispatch(fetchAllAuctionProducts());
              setFormData(initialFormData);
              setOpenCrtProdDialog(false);
              setCurrentEditedId(null);
              toast.success(data?.payload?.message, {
                action: {
                  label: 'close',
                },
              });
            }
          }
        )
      : dispatch(addNewAuctionProduct({ ...formData, image: uloadedImageUrl })).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAuctionProducts());
            setOpenCrtProdDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast.success(data?.payload?.message, {
              action: {
                label: 'close',
              },
            });
          }
        });
  };

  const openDeleteDialog = (getCurrentProductId) => {
    setCurrentDeleteId(getCurrentProductId);
    setOpenDialog(true);
  };

  const handleDelete = () => {
    dispatch(deleteAuctionProduct(currentDeleteId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAuctionProducts());
        toast.success(data?.payload?.message, {
          action: {
            label: 'close',
          },
        });
      }
      setCurrentDeleteId(null);
    });
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every(
        (value) => value !== null && value !== undefined && value !== ''
      ) && !imageLoadingState
    );
  };

  useEffect(() => {
    if (uloadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uloadedImageUrl,
      }));
    }
  }, [uloadedImageUrl]);

  useEffect(() => {
    dispatch(fetchAllAuctionProducts());
  }, [dispatch]);

  return (
    <div className="w-full h-full">
      <div className="w-full mb-4 flex items-center justify-between gap-4 border-b rounded p-2">
        <h1 className="text-2xl text-gray-800 font-semibold">Auction Products</h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="capitalize" onClick={() => setOpenCrtProdDialog(true)}>
          Add auction product
        </Button>
      </div>

      {/* Auction Product List */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full max-h-[80vh] overflow-y-auto">
          {filteredAuctionProducts && filteredAuctionProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAuctionProducts.map((product) => (
                <AdminAuctionProductTile
                  key={product._id}
                  auctionProduct={product}
                  setFormData={setFormData}
                  setOpenCrtProdDialog={setOpenCrtProdDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  openDeleteDialog={openDeleteDialog}
                />
              ))}
            </div>
          ) : (
            <NoItemFound />
          )}
        </div>
      )}

      {/* Create Auction Product Dialog */}

      <Sheet
        open={openCrtProdDialog}
        onOpenChange={() => {
          setOpenCrtProdDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto bg-white">
          <SheetHeader>
            <SheetTitle className="text-2xl text-foreground">
              {currentEditedId ? <p>Edit Product</p> : <p>Add New Product</p>}
            </SheetTitle>
          </SheetHeader>
          <ImageUpload
            file={imageFile}
            setFile={setImageFile}
            uploadedUrl={uloadedImageUrl}
            setUploadedUrl={setUloadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
            setFormData={setFormData}
          />
          <div className="px-5 py-6 text-foreground">
            <CommonForm
              formControls={addAuctionProductElements}
              buttonText={currentEditedId ? 'Update Product' : 'Create Product'}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
      <DeleteDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default AuctionProductsView;
