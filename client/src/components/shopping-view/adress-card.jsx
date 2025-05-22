import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DeleteIcon, Edit } from "lucide-react";

const AddressCard = ({
	addressInfo,
	handleEditAddress,
	handleDeleteAddress,
	setCurrentSelectedAddress,
	selectedId,
}) => {
	return (
		<Card
			onClick={
				setCurrentSelectedAddress
					? () => setCurrentSelectedAddress(addressInfo)
					: null
			}
			className={`cursor-pointer border-red-700 ${
				selectedId?._id === addressInfo?._id
					? "border-red-900 border-[4px]"
					: "border-black"
			}`}
		>
			<CardContent className="grid pt-4 gap-y-4">
				<Label>Address: {addressInfo?.address}</Label>
				<Label>City: {addressInfo?.city}</Label>
				<Label>Pincode: {addressInfo?.pincode}</Label>
				<Label>Phone: {addressInfo?.phone}</Label>
				<Label>Notes: {addressInfo?.notes}</Label>
			</CardContent>
			<CardFooter className="flex justify-between gap-x-2">
				<Button onClick={() => handleEditAddress(addressInfo)}>
					<Edit />
					Edit
				</Button>
				<Button onClick={() => handleDeleteAddress(addressInfo)}>
					<DeleteIcon />
					Delete
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AddressCard;
