import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
	addNewAddress,
	deleteAddress,
	editAddress,
	fetchAllAddresses,
} from "@/store/shop/address-slice";
import { toast } from "sonner";
import AddressCard from "./adress-card";
import { Button } from "../ui/button";
import { CircleSlash, XIcon } from "lucide-react";

import * as Yup from "yup";
import Loading from "../common/loading-component";

const addressValidationSchema = Yup.object({
	address: Yup.string().required("Address is required"),
	city: Yup.string().required("City is required"),
	pincode: Yup.string()
		.matches(/^\d{4,10}$/, "Pincode must be 4 to 10 digits")
		.required("Pincode is required"),
	phone: Yup.string()
		.matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
		.required("Phone is required"),
	notes: Yup.string().max(200, "Notes must be under 200 characters"),
});

const initialState = {
	address: "",
	city: "",
	phone: "",
	pincode: "",
	notes: "",
};

const Address = ({ selectedId, setCurrentSelectedAddress }) => {
	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentEditId, setCurrentEditId] = useState(null);
	const { user } = useSelector((state) => state.auth);
	const { addressList, isLoading } = useSelector((state) => state.shopAddress);
	const dispatch = useDispatch();

	const onSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			await addressValidationSchema.validate(formData, { abortEarly: false });
			setErrors({});

			if (addressList.length >= 3 && currentEditId === null) {
				setFormData(initialState);
				toast.error("You can add only 3 addresses", {
					action: { label: <XIcon /> },
				});
				setIsSubmitting(false);
				return;
			}

			if (currentEditId !== null) {
				dispatch(
					editAddress({
						userId: user?.id,
						addressId: currentEditId,
						formData,
					})
				).then((data) => {
					setIsSubmitting(false);
					if (data?.payload?.success) {
						dispatch(fetchAllAddresses(user?.id));
						setCurrentEditId(null);
						setFormData(initialState);
						toast.success("Address updated successfully", {
							action: { label: <XIcon /> },
						});
					}
				});
			} else {
				dispatch(addNewAddress({ ...formData, userId: user?.id })).then(
					(data) => {
						setIsSubmitting(false);
						if (data?.payload?.success) {
							dispatch(fetchAllAddresses(user?.id));
							setFormData(initialState);
							toast.success(data?.payload?.message, {
								action: { label: "X" },
							});
						}
					}
				);
			}
		} catch (validationError) {
			setIsSubmitting(false);
			if (validationError.inner) {
				const formattedErrors = {};
				validationError.inner.forEach((err) => {
					formattedErrors[err.path] = err.message;
					toast.error(err.message);
				});
				setErrors(formattedErrors);
			}
		}
	};

	const isFormValid = () => {
		return Object.values(formData).every((val) => val !== "");
	};

	const handleEditAddress = (getCurrentAddress) => {
		setCurrentEditId(getCurrentAddress._id);
		setFormData({
			address: getCurrentAddress?.address,
			city: getCurrentAddress?.city,
			phone: getCurrentAddress?.phone,
			pincode: getCurrentAddress?.pincode,
			notes: getCurrentAddress?.notes,
		});
		setErrors({});
	};

	const handleDeleteAddress = (getCurrentAddress) => {
		dispatch(
			deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
		).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchAllAddresses(user?.id));
				toast.success(data?.payload?.message, {
					action: { label: <XIcon /> },
				});
			}
		});
	};

	const cancelEdit = () => {
		setCurrentEditId(null);
		setFormData(initialState);
		setErrors({});
	};

	useEffect(() => {
		dispatch(fetchAllAddresses(user?.id));
	}, [dispatch]);

	return (
		<Card>
			{isLoading ? (
				<Loading />
			) : (
				<div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-2">
					{addressList && addressList.length > 0 ? (
						addressList.map((address, index) => (
							<AddressCard
								key={index}
								selectedId={selectedId}
								setCurrentSelectedAddress={setCurrentSelectedAddress}
								addressInfo={address}
								handleDeleteAddress={handleDeleteAddress}
								handleEditAddress={handleEditAddress}
							/>
						))
					) : (
						<div>No addresses added yet.</div>
					)}
				</div>
			)}

			<CardHeader className="flex items-center justify-between">
				<CardTitle>
					{currentEditId ? "Edit Address" : "Add New Address"}
				</CardTitle>
				{currentEditId && (
					<Button onClick={cancelEdit}>
						<CircleSlash className="mr-1" /> Cancel
					</Button>
				)}
			</CardHeader>

			<CardContent className="space-y-4">
				<CommonForm
					formControls={addressFormControls}
					formData={formData}
					setFormData={setFormData}
					onSubmit={onSubmit}
					buttonText={currentEditId ? "Edit Address" : "Add New Address"}
					isBtnDisabled={!isFormValid() || isSubmitting}
					errors={errors}
				/>
			</CardContent>
		</Card>
	);
};

export default Address;
