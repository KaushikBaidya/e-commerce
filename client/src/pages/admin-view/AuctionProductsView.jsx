import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DeleteDialog from '@/components/common/delete-dialog';
import Loading from '@/components/common/loading-component';

import { useAuctionProductActions } from '@/hooks/useAuctionProductActions';
import { useAuctionProductForm } from '@/hooks/useAuctionProductForm';
import { fetchAllAuctionProducts } from '@/store/admin/auction-products-slice';

import AuctionProductDialog from './auction-product-component/AuctionProductDialog';
import AuctionProductsGrid from './auction-product-component/AuctionProductsGrid';
import AuctionProductsHeader from './auction-product-component/AuctionProductsHeader';

const AuctionProductsView = () => {
  const [openCrtProdDialog, setOpenCrtProdDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { auctionProductList, isLoading } = useSelector((state) => state.adminAuctionProduct);
  const dispatch = useDispatch();

  const productForm = useAuctionProductForm();
  const productActions = useAuctionProductActions();

  const filteredAuctionProducts = useMemo(() => {
    if (!auctionProductList) return [];

    return auctionProductList.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [auctionProductList, searchTerm]);

  const handleOpenCreateDialog = () => {
    setOpenCrtProdDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCrtProdDialog(false);
    productForm.handleCloseDialog();
  };

  const handleEditProduct = (product) => {
    productForm.handleEditProduct(product);
    setOpenCrtProdDialog(true);
  };

  useEffect(() => {
    dispatch(fetchAllAuctionProducts());
  }, [dispatch]);

  return (
    <div className="w-full h-full">
      <AuctionProductsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddProduct={handleOpenCreateDialog}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full max-h-[80vh] overflow-y-auto">
          <AuctionProductsGrid
            products={filteredAuctionProducts}
            onEdit={handleEditProduct}
            onDelete={productActions.openDeleteDialog}
          />
        </div>
      )}

      <AuctionProductDialog
        open={openCrtProdDialog}
        onClose={handleCloseDialog}
        currentEditedId={productForm.currentEditedId}
        methods={productForm.methods}
        handleSubmit={productForm.handleSubmit}
        onSubmit={productForm.onSubmit}
        imageFile={productForm.imageFile}
        setImageFile={productForm.setImageFile}
        uploadedImageUrl={productForm.uploadedImageUrl}
        setUploadedImageUrl={productForm.setUploadedImageUrl}
        imageLoadingState={productForm.imageLoadingState}
        setImageLoadingState={productForm.setImageLoadingState}
      />

      <DeleteDialog
        openDialog={productActions.openDialog}
        setOpenDialog={productActions.setOpenDialog}
        handleDelete={productActions.handleDelete}
      />
    </div>
  );
};

export default AuctionProductsView;
