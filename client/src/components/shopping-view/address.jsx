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
import { current } from "@reduxjs/toolkit";
import { Button } from "../ui/button";
import { CircleSlash } from "lucide-react";

const initialState = {
	address: "",
	city: "",
	phone: "",
	pincode: "",
	notes: "",
};
const Address = ({ selectedId, setCurrentSelectedAddress }) => {
	const [formData, setFormData] = useState(initialState);
	const [currentEditId, setCurrentEditId] = useState(null);
	const { user } = useSelector((state) => state.auth);
	const { addressList } = useSelector((state) => state.shopAddress);
	const dispatch = useDispatch();

	const onSubmit = (event) => {
		event.preventDefault();
		if (addressList.length >= 3 && currentEditId === null) {
			setFormData(initialState);
			toast.error("You can add only 3 addresses");

			return;
		}

		currentEditId !== null
			? dispatch(
					editAddress({
						userId: user?.id,
						addressId: currentEditId,
						formData,
					})
			  ).then((data) => {
					if (data?.payload?.success) {
						dispatch(fetchAllAddresses(user?.id));
						setCurrentEditId(null);
						setFormData(initialState);
						toast.success("Address updated successfully");
					}
			  })
			: dispatch(addNewAddress({ ...formData, userId: user?.id })).then(
					(data) => {
						if (data?.payload?.success) {
							dispatch(fetchAllAddresses(user?.id));
							setFormData(initialState);
							toast.success(data?.payload?.message, {
								action: {
									label: "X",
								},
							});
						}
					}
			  );
	};

	const isFormValid = () => {
		return Object.keys(formData)
			.map((key) => formData[key] !== "")
			.every((item) => item);
		// .map((key) => formData[key].trim() !== "") if needed will add later
	};

	const handleEditAddress = (getCurrentAddress) => {
		setCurrentEditId(getCurrentAddress._id);
		setFormData({
			...formData,
			address: getCurrentAddress?.address,
			city: getCurrentAddress?.city,
			phone: getCurrentAddress?.phone,
			pincode: getCurrentAddress?.pincode,
			notes: getCurrentAddress?.notes,
		});
	};

	const handleDeleteAddress = (getCurrentAddress) => {
		dispatch(
			deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
		).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchAllAddresses(user?.id));
				toast.success(data?.payload?.message, {
					action: {
						label: "X",
					},
				});
			}
		});
	};

	const cancelEdit = () => {
		setCurrentEditId(null);
		setFormData(initialState);
	};

	useEffect(() => {
		dispatch(fetchAllAddresses(user?.id));
	}, [dispatch]);

	return (
		<Card>
			<div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
					<div></div>
				)}
			</div>
			<CardHeader className={"flex items-center justify-between"}>
				<CardTitle>
					{currentEditId ? "Edit Address" : "Add New Address"}
				</CardTitle>
				{currentEditId && (
					<Button onClick={() => cancelEdit()}>
						<CircleSlash /> Cancel
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
					isBtnDisabled={!isFormValid()}
				/>
			</CardContent>
		</Card>
	);
};

export default Address;
