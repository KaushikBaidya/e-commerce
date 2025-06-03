import ImageUpload from '@/components/admin-view/image-upload';
import CommonForm from '@/components/common/common-form-component';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { addAuctionProductElements } from '@/config';

const AuctionProductDialog = ({
  open,
  onClose,
  currentEditedId,
  methods,
  handleSubmit,
  onSubmit,
  isFormValid,
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
}) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="overflow-auto bg-white">
        <SheetHeader>
          <SheetTitle className="text-2xl text-foreground">
            {currentEditedId ? 'Edit Product' : 'Add New Product'}
          </SheetTitle>
        </SheetHeader>

        <ImageUpload
          file={imageFile}
          setFile={setImageFile}
          uploadedUrl={uploadedImageUrl}
          setUploadedUrl={setUploadedImageUrl}
          imageLoadingState={imageLoadingState}
          setImageLoadingState={setImageLoadingState}
          isEditMode={currentEditedId !== null}
          setFormData={() => {}} // This might need adjustment based on your ImageUpload component
        />

        <div className="px-5 py-6 text-foreground">
          <CommonForm
            formControls={addAuctionProductElements}
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
            isBtnDisabled={!isFormValid}
            buttonText={currentEditedId ? 'Update Product' : 'Create Product'}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuctionProductDialog;
