import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getAllUsers } from "@/store/admin/order-slice";
import { useDispatch, useSelector } from "react-redux";

const AdminUsers = () => {
	const { userList } = useSelector((state) => state.adminOrder);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllUsers());
	}, [dispatch]);

	// Filter only users with role "user"
	const filteredUsers = userList?.filter((user) => user.role === "user") || [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold pt-4 px-2">
					Users List
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>User ID</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user, index) => (
								<TableRow key={user._id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{user.userName || "N/A"}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell className="capitalize">{user.role}</TableCell>
									<TableCell>{user._id}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-4">
									No users found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default AdminUsers;
