import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

const DeleteDialog = ({ openDialog, setOpenDialog, handleDelete }) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-md p-6 rounded-xl shadow-xl">
        <DialogTitle className="text-xl font-medium text-red-600">Delete Product</DialogTitle>
        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              handleDelete();
              setOpenDialog(false);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
