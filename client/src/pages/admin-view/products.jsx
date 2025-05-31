import React, { useEffect, useState } from "react";
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
import ImageUpload from "@/components/admin-view/image-upload";
import NoItemFound from "@/components/common/no-item-found";

import {
	addNewProduct,
	deleteProduct,
	editProduct,
	fetchAllProducts,
} from "@/store/admin/products-slice";

import DeleteDialog from "@/components/common/delete-dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Search } from "lucide-react";
import Loading from "@/components/common/loading-component";

const initialFormData = {
	image: null,
	imagePublicId: null,
	title: "",
	description: "",
	category: "",
	price: "",
	salePrice: "",
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

	const [searchTerm, setSearchTerm] = useState("");

	const { productList, isLoading } = useSelector(
		(state) => state.adminProducts
	);

	const dispatch = useDispatch();

	const filteredProducts = productList?.filter((product) =>
		product.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

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
							toast.success(data?.payload?.message, {
								action: {
									label: "close",
								},
							});
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
							toast.success(data?.payload?.message, {
								action: {
									label: "close",
								},
							});
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
				toast.success(data?.payload?.message, {
					action: {
						label: "close",
					},
				});
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
		<div className="w-full h-full">
			<div className="w-full mb-4 flex items-center justify-between gap-4 border-b rounded p-2">
				<h1 className="text-2xl text-gray-800 font-semibold">Products</h1>
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
				<Button onClick={() => setOpenCrtProdDialog(true)}>
					Add new product
				</Button>
			</div>

			{/*  product list */}
			{isLoading ? (
				<Loading />
			) : (
				<div className="w-full max-h-[80vh] overflow-y-auto">
					{filteredProducts && filteredProducts.length > 0 ? (
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead>Image</TableHead>
									<TableHead>Title</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Sale Price</TableHead>
									<TableHead>Stock</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredProducts.map((product, index) => (
									<TableRow key={index} className="hover:bg-gray-100">
										<TableCell>
											<img
												src={product?.image}
												alt={product?.title}
												className="w-16 h-16 object-cover rounded"
											/>
										</TableCell>
										<TableCell>{product?.title}</TableCell>
										<TableCell>{product?.category}</TableCell>
										<TableCell
											className={
												product?.salePrice > 0
													? "line-through text-muted-foreground"
													: ""
											}
										>
											৳ {product?.price}
										</TableCell>
										<TableCell>
											{product?.salePrice > 0 ? `৳ ${product?.salePrice}` : "—"}
										</TableCell>
										<TableCell>{product?.totalStock}</TableCell>
										<TableCell className="flex justify-end gap-2 mt-4">
											<Button
												size="sm"
												onClick={() => {
													setOpenCrtProdDialog(true);
													setCurrentEditedId(product?._id);
													setFormData(product);
												}}
											>
												<Edit className="w-4 h-4 mr-1" />
												Edit
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => openDeleteDialog(product?._id)}
											>
												<Trash2 className="w-4 h-4 mr-1" />
												Delete
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<NoItemFound />
					)}
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
						setFormData={setFormData}
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
			<DeleteDialog
				openDialog={openDialog}
				setOpenDialog={setOpenDialog}
				handleDelete={handleDelete}
			/>
		</div>
	);
};

export default AdminProducts;
