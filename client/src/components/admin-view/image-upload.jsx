import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloud, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const ImageUpload = ({
	file,
	setFile,
	imageLoadingState,
	uploadedUrl,
	setUploadedUrl,
	setImageLoadingState,
	isEditMode,
}) => {
	const inputRef = useRef(null);

	const handleImageFileChange = (e) => {
		const selectedImage = e.target.files?.[0];

		if (selectedImage) {
			setFile(selectedImage);
		}
	};
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = (e) => {
		e.preventDefault();
		const droppedImage = e.dataTransfer.files?.[0];
		if (droppedImage) {
			setFile(droppedImage);
		}
	};

	const handleRemoveImage = () => {
		setFile(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const uploadImageToCloudinary = async () => {
		setImageLoadingState(true);
		const data = new FormData();
		data.append("image", file);
		const response = await axios.post(
			"http://localhost:5000/api/admin/products/upload-image",
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		if (response?.data.success) {
			setUploadedUrl(response.data.result.url);
			setImageLoadingState(false);
		}
	};

	useEffect(() => {
		if (file !== null) uploadImageToCloudinary();
	}, [file]);

	return (
		<div className="w-full max-w-md mx-auto px-5">
			<Label className="text-lg font-semibold mb-2 text-foreground block">
				Upload Image
			</Label>
			<div
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				className={`${
					isEditMode ? "opacity-50" : ""
				} text-foreground border-2 border-dashed rounded-lg p-4`}
			>
				<Input
					id="image-upload"
					type="file"
					className="hidden"
					ref={inputRef}
					onChange={handleImageFileChange}
					disabled={isEditMode}
				/>
				{!file ? (
					<Label
						htmlFor="image-upload"
						className={`${
							isEditMode ? "cursor-not-allowed" : ""
						} flex flex-col items-center justify-center h-24 cursor-pointer`}
					>
						<UploadCloud className="w-8 h-8 mb-2" />
						<span>Drag and drop or click to upload</span>
					</Label>
				) : imageLoadingState ? (
					<Skeleton className="h-10" />
				) : (
					<div className="flex items-center justify-between">
						<div className="flex itmems-center">
							<FileIcon className="w-8 h-8 text-primary mr-2" />
						</div>
						<p className="text-sm font-medium">{file.name}</p>
						<Button
							variant="ghost"
							size="icon"
							className="text-muted-foreground hover:text-foreground"
							onClick={handleRemoveImage}
						>
							<XIcon className="w-4 h-4" />
							<span className="sr-only">Remove image</span>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImageUpload;
