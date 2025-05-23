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
	const [formData, setFormData] = useState(initialFormData);
	const [imageFile, setImageFile] = useState(null);
	const [uloadedImageUrl, setUloadedImageUrl] = useState("");
	const [imageLoadingState, setImageLoadingState] = useState(false);
	const [currentEditedId, setCurrentEditedId] = useState(null);

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

	const handleDelete = (getCurrentProductId) => {
		dispatch(deleteProduct(getCurrentProductId)).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchAllProducts());
				toast.success(data?.payload?.message);
			}
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

			{/* // product list */}
			{productList && productList?.length > 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
					{productList.map((item) => (
						<AdminProductTile
							key={item._id}
							product={item}
							setFormData={setFormData}
							setOpenCrtProdDialog={setOpenCrtProdDialog}
							setCurrentEditedId={setCurrentEditedId}
							handleDelete={handleDelete}
						/>
					))}
				</div>
			) : (
				<div className="w-full h-full flex items-center justify-center">
					<NoItemFound />
				</div>
			)}

			{/* // create product dialog */}
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
		</Fragment>
	);
};

export default AdminProducts;
