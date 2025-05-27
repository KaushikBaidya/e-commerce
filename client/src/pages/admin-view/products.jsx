import React, { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import { addProductFormElements } from "@/config";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import CommonForm from "@/components/common/form";
import AdminProductTile from "@/components/admin-view/product-tile";
import ImageUpload from "@/components/admin-view/image-upload";

import {
	addNewProduct,
	deleteProduct,
	editProduct,
	fetchAllProducts,
} from "@/store/admin/products-slice";
import NoItemFound from "@/components/common/no-item-found";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const initialFormData = {
	image: null,
	title: "",
	description: "",
	category: "",
	brand: "",
	price: "",
	totalStock: "",
};

const AdminProducts = () => {
	const [openCrtProdDialog, setOpenCrtProdDialog] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [imageFile, setImageFile] = useState(null);
	const [uloadedImageUrl, setUloadedImageUrl] = useState("");
	const [imageLoadingState, setImageLoadingState] = useState(false);
	const [currentEditedId, setCurrentEditedId] = useState(null);
	const [currentDeleteId, setCurrentDeleteId] = useState(null);

	const { productList } = useSelector((state) => state.adminProducts);
	const dispatch = useDispatch();

	const onSubmit = (e) => {
		e.preventDefault();

		currentEditedId !== null
			? dispatch(editProduct({ id: currentEditedId, formData })).then(
					(data) => {
						if (data?.payload?.success) {
							dispatch(fetchAllProducts());
							setFormData(initialFormData);
							setOpenCrtProdDialog(false);
							setCurrentEditedId(null);
							toast.success(data?.payload?.message);
						}
					}
			  )
			: dispatch(addNewProduct({ ...formData, image: uloadedImageUrl })).then(
					(data) => {
						if (data?.payload?.success) {
							dispatch(fetchAllProducts());
							setOpenCrtProdDialog(false);
							setImageFile(null);
							setFormData(initialFormData);
							toast.success(data?.payload?.message);
						}
					}
			  );
	};

	const openDeleteDialog = (getCurrentProductId) => {
		setCurrentDeleteId(getCurrentProductId);
		setOpenDialog(true);
	};

	const handleDelete = () => {
		dispatch(deleteProduct(currentDeleteId)).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchAllProducts());
				toast.success(data?.payload?.message);
			}
			setCurrentDeleteId(null);
		});
	};

	const isFormValid = () => {
		return (
			Object.values(formData).every(
				(value) => value !== null && value !== undefined && value !== ""
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
		dispatch(fetchAllProducts());
	}, [dispatch]);

	return (
		<Fragment>
			<div className="w-full mb-5 flex justify-between border rounded p-4">
				<h1 className="text-3xl text-gray-800 font-bold">Products</h1>
				<Button onClick={() => setOpenCrtProdDialog(true)}>
					Add new product
				</Button>
			</div>

			{/*  product list */}
			{productList && productList?.length > 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
					{productList.map((item) => (
						<AdminProductTile
							key={item._id}
							product={item}
							setFormData={setFormData}
							setOpenCrtProdDialog={setOpenCrtProdDialog}
							setCurrentEditedId={setCurrentEditedId}
							openDeleteDialog={openDeleteDialog}
						/>
					))}
				</div>
			) : (
				<div className="w-full h-full flex items-center justify-center">
					<NoItemFound />
				</div>
			)}

			{/* create product dialog */}
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
							{currentEditedId ? (
								<p>Edit Product</p>
							) : (
								<p>Create New Product</p>
							)}
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
					/>
					<div className="px-5 py-6 text-foreground">
						<CommonForm
							formControls={addProductFormElements}
							buttonText={currentEditedId ? "Update Product" : "Create Product"}
							formData={formData}
							setFormData={setFormData}
							onSubmit={onSubmit}
							isBtnDisabled={!isFormValid()}
						/>
					</div>
				</SheetContent>
			</Sheet>
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="sm:max-w-md p-6 rounded-xl shadow-xl">
					<DialogTitle className="text-xl font-semibold text-red-600">
						Delete Product
					</DialogTitle>
					<p className="text-sm text-gray-600 mt-2">
						Are you sure you want to delete this product? This action cannot be
						undone.
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
		</Fragment>
	);
};

export default AdminProducts;
