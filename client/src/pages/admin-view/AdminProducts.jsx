import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DeleteDialog from '@/components/common/delete-dialog';
import Loading from '@/components/common/loading-component';
import { Button } from '@/components/ui/button';

import { fetchAllProducts } from '@/store/admin/products-slice';

import { useProductActions } from '@/hooks/useProductActions';
import { useProductForm } from '@/hooks/useProductForm';
import ProductDialog from './product-component/ProductDialog';
import ProductSearch from './product-component/ProductSearch';
import ProductTable from './product-component/ProductTable';

const AdminProducts = () => {
  const [openCrtProdDialog, setOpenCrtProdDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { productList, isLoading } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  const productForm = useProductForm();
  const productActions = useProductActions();

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    if (!productList) return [];

    return productList.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productList, searchTerm]);

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
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <div className="w-full h-full">
      <div className="w-full mb-4 flex items-center justify-between gap-4 border-b rounded p-2">
        <h1 className="text-2xl text-gray-800 font-medium">Products</h1>
        <ProductSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <Button onClick={handleOpenCreateDialog}>Add new product</Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full max-h-[80vh] overflow-y-auto">
          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={productActions.openDeleteDialog}
          />
        </div>
      )}

      <ProductDialog
        open={openCrtProdDialog}
        onClose={handleCloseDialog}
        currentEditedId={productForm.currentEditedId}
        methods={productForm.methods}
        handleSubmit={productForm.handleSubmit}
        onSubmit={productForm.onSubmit}
        isFormValid={productForm.isFormValid}
        isSubmitting={productForm.isSubmitting}
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

export default AdminProducts;
