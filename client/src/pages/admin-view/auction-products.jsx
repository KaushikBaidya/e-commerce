import React, { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import { addAuctionProductElements } from "@/config";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import CommonForm from "@/components/common/form";
import ImageUpload from "@/components/admin-view/image-upload";
import AdminAuctionProductTile from "@/components/admin-view/auction-product-tile";
import NoItemFound from "@/components/common/no-item-found";

import {
	addNewAuctionProduct,
	fetchAllAuctionProducts,
	deleteAuctionProduct,
	editAuctionProduct,
} from "@/store/admin/auction-products-slice";

const initialFormData = {
	image: null,
	title: "",
	description: "",
	artist: "",
	startingBid: "",
	bidIncrement: "",
	startTime: "",
	endTime: "",
	isActive: false,
};

const AuctionProductsView = () => {
	const [openCrtProdDialog, setOpenCrtProdDialog] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [imageFile, setImageFile] = useState(null);
	const [uloadedImageUrl, setUloadedImageUrl] = useState("");
	const [imageLoadingState, setImageLoadingState] = useState(false);
	const [currentEditedId, setCurrentEditedId] = useState(null);

	const { auctionProductList } = useSelector(
		(state) => state.adminAuctionProduct
	);
	const dispatch = useDispatch();

	const onSubmit = (e) => {
		e.preventDefault();

		const payloadData = {
			...formData,
			image: formData.image || uloadedImageUrl,
		};

		currentEditedId !== null
			? dispatch(
					editAuctionProduct({ id: currentEditedId, formData: payloadData })
			  ).then((data) => {
					if (data?.payload?.success) {
						dispatch(fetchAllAuctionProducts());
						setFormData(initialFormData);
						setOpenCrtProdDialog(false);
						setCurrentEditedId(null);
						toast.success(data?.payload?.message);
					}
			  })
			: dispatch(
					addNewAuctionProduct({ ...formData, image: uloadedImageUrl })
			  ).then((data) => {
					if (data?.payload?.success) {
						dispatch(fetchAllAuctionProducts());
						setOpenCrtProdDialog(false);
						setImageFile(null);
						setFormData(initialFormData);
						toast.success(data?.payload?.message);
					}
			  });
	};

	const handleDelete = (getCurrentProductId) => {
		dispatch(deleteAuctionProduct(getCurrentProductId)).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchAllAuctionProducts());
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
		dispatch(fetchAllAuctionProducts());
	}, [dispatch]);

	return (
		<Fragment>
			<div className="w-full mb-5 flex justify-between border rounded p-4">
				<h1 className="text-3xl text-gray-800 font-bold">Auction Products</h1>
				<Button
					className="capitalize"
					onClick={() => setOpenCrtProdDialog(true)}
				>
					Add auction product
				</Button>
			</div>

			{/* Auction Product List */}
			{auctionProductList && auctionProductList.length > 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{auctionProductList.map((product) => (
						<AdminAuctionProductTile
							key={product._id}
							auctionProduct={product}
							setFormData={setFormData}
							setOpenCrtProdDialog={setOpenCrtProdDialog}
							setCurrentEditedId={setCurrentEditedId}
							handleDelete={handleDelete}
						/>
					))}
				</div>
			) : (
				<NoItemFound />
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
					/>
					<div className="px-5 py-6 text-foreground">
						<CommonForm
							formControls={addAuctionProductElements}
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

export default AuctionProductsView;
