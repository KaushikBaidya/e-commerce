import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import { toast } from "sonner";
import AddressCard from "./adress-card";

const initialState = {
	address: "",
	city: "",
	phone: "",
	pincode: "",
	notes: "",
};
const Address = () => {
	const [formData, setFormData] = useState(initialState);
	const { user } = useSelector((state) => state.auth);
	const { addressList } = useSelector((state) => state.shopAddress);
	const dispatch = useDispatch();

	const onSubmit = (event) => {
		event.preventDefault();
		dispatch(addNewAddress({ ...formData, userId: user?.id })).then((data) => {
			console.log(data);
			if (data?.payload?.success) {
				dispatch(fetchAllAddresses(user?.id));
				setFormData(initialState);
				toast.success(data?.payload?.message, {
					action: {
						label: "X",
					},
				});
			}
		});
	};

	const isFormValid = () => {
		return Object.keys(formData)
			.map((key) => formData[key] !== "")
			.every((item) => item);
		// .map((key) => formData[key].trim() !== "") if needed will add later
	};

	useEffect(() => {
		dispatch(fetchAllAddresses(user?.id));
	}, [dispatch]);

	return (
		<Card>
			<div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
				{addressList && addressList.length > 0 ? (
					addressList.map((address, index) => (
						<AddressCard key={index} addressInfo={address} />
					))
				) : (
					<></>
				)}
			</div>
			<CardHeader>
				<CardTitle>Add New Address</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<CommonForm
					formControls={addressFormControls}
					formData={formData}
					setFormData={setFormData}
					onSubmit={onSubmit}
					buttonText={"Save Address"}
					isBtnDisabled={!isFormValid()}
				/>
			</CardContent>
		</Card>
	);
};

export default Address;
