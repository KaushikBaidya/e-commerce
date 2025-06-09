import ImageUpload from '@/components/admin-view/image-upload';
import CommonForm from '@/components/common/common-form-component';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addProductFormElements } from '@/config';

const ProductDialog = ({
  open,
  onClose,
  currentEditedId,
  methods,
  handleSubmit,
  onSubmit,
  isSubmitting,
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
}) => {
  const { setValue } = methods;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="overflow-auto bg-white">
        <SheetHeader>
          <SheetTitle className="text-2xl text-foreground">
            {currentEditedId ? 'Edit Product' : 'Create New Product'}
          </SheetTitle>
        </SheetHeader>
        <div className="px-5">
          <ImageUpload
            file={imageFile}
            setFile={setImageFile}
            uploadedUrl={uploadedImageUrl}
            setUploadedUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
            setFormData={(data) => {
              Object.keys(data).forEach((key) => {
                setValue(key, data[key]);
              });
            }}
          />
        </div>
        <div className="px-5 py-6 text-foreground">
          <CommonForm
            formControls={addProductFormElements}
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
            isBtnDisabled={isSubmitting}
            buttonText={
              isSubmitting
                ? currentEditedId
                  ? 'Updating...'
                  : 'Creating...'
                : currentEditedId
                  ? 'Update Product'
                  : 'Create Product'
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDialog;
