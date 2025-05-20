import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DeleteIcon, Edit } from "lucide-react";

const AddressCard = ({
	addressInfo,
	handleEditAddress,
	handleDeleteAddress,
}) => {
	return (
		<Card>
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
