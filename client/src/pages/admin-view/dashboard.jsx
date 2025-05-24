import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Gavel, ShoppingCart, DollarSign } from "lucide-react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";

const stats = [
	{
		title: "Total Users",
		value: "1,245",
		icon: <Users className="w-6 h-6 text-blue-600" />,
	},
	{
		title: "Auction Items",
		value: "87",
		icon: <Gavel className="w-6 h-6 text-green-600" />,
	},
	{
		title: "Orders",
		value: "312",
		icon: <ShoppingCart className="w-6 h-6 text-yellow-600" />,
	},
	{
		title: "Revenue",
		value: "$48,320",
		icon: <DollarSign className="w-6 h-6 text-purple-600" />,
	},
];

const revenueData = [
	{ month: "Jan", revenue: 4200 },
	{ month: "Feb", revenue: 5300 },
	{ month: "Mar", revenue: 4800 },
	{ month: "Apr", revenue: 6100 },
	{ month: "May", revenue: 7200 },
];

const usersData = [
	{ day: "Mon", users: 120 },
	{ day: "Tue", users: 210 },
	{ day: "Wed", users: 160 },
	{ day: "Thu", users: 300 },
	{ day: "Fri", users: 250 },
	{ day: "Sat", users: 280 },
	{ day: "Sun", users: 200 },
];

const AdminDashboard = () => {
	return (
		<div className="space-y-6 px-4 py-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat, idx) => (
					<Card key={idx} className="shadow border p-4">
						<CardContent className="flex items-center justify-between">
							<div>
								<h4 className="text-muted-foreground text-sm">{stat.title}</h4>
								<p className="text-2xl font-bold">{stat.value}</p>
							</div>
							<div className="bg-muted p-2 rounded-full">{stat.icon}</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold">
							Monthly Revenue
						</CardTitle>
					</CardHeader>
					<CardContent className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={revenueData}>
								<XAxis dataKey="month" />
								<YAxis />
								<CartesianGrid strokeDasharray="3 3" />
								<Tooltip />
								<Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold">
							Daily Active Users
						</CardTitle>
					</CardHeader>
					<CardContent className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={usersData}>
								<XAxis dataKey="day" />
								<YAxis />
								<CartesianGrid strokeDasharray="3 3" />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="users"
									stroke="#22c55e"
									strokeWidth={3}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminDashboard;
