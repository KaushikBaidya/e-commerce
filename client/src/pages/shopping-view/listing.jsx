import ProductFilter from "@/components/shopping-view/filter";
import ShopProductTile from "@/components/shopping-view/shop-product-tile";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const createSearchParamsHelper = (filterParams) => {
	const queryParams = [];

	for (const [key, value] of Object.entries(filterParams)) {
		if (Array.isArray(value) && value.length > 0) {
			const paramValue = value.join(",");
			queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
		}
	}

	return queryParams.join("&");
};

const ShoppingListing = () => {
	const [filters, setFilters] = useState({});
	const [sort, setSort] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch = useDispatch();
	const { productList } = useSelector((state) => state.shopProducts);

	const handleSort = (value) => {
		setSort(value);
	};

	const handleFilter = (getSectionId, getCurrentOption) => {
		let copyFilters = { ...filters };
		const indexOfCurrentSection =
			Object.keys(copyFilters).indexOf(getSectionId);
		if (indexOfCurrentSection === -1) {
			copyFilters[getSectionId] = [getCurrentOption];
		} else {
			const indexOfCurrentOption =
				copyFilters[getSectionId].indexOf(getCurrentOption);
			if (indexOfCurrentOption === -1) {
				copyFilters[getSectionId].push(getCurrentOption);
			} else {
				copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
			}
		}
		setFilters(copyFilters);
		sessionStorage.setItem("filters", JSON.stringify(copyFilters));
	};

	useEffect(() => {
		setSort("price-lowtohigh");
		setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
	}, []);

	useEffect(() => {
		if (filters && Object.keys(filters).length > 0) {
			const createQueryString = createSearchParamsHelper(filters);
			setSearchParams(new URLSearchParams(createQueryString));
		}
	}, [filters]);

	useEffect(() => {
		if (filters !== null && sort !== null)
			dispatch(
				fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
			);
	}, [dispatch, sort, filters]);

	console.log(searchParams, "search params");

	return (
		<div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
			<ProductFilter filters={filters} handleFilter={handleFilter} />
			<div className="bg-background w-full rounded-lg shadow-sm">
				<div className="p-4 border-b flex items-center justify-between">
					<h2 className="text-lg font-semibold">All Products</h2>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground block">
							{productList?.length} Products
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<span className="flex items-center gap-2 border rounded-md px-2 py-1">
									<ArrowUpDownIcon className="h-4 w-4" />
									<span>Sort by</span>
								</span>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[200px]">
								<DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
									{sortOptions.map((sortItem) => (
										<DropdownMenuRadioItem
											key={sortItem.id}
											value={sortItem.id}
										>
											{sortItem.label}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
					{productList && productList?.length > 0
						? productList.map((item) => (
								<ShopProductTile key={item._id} product={item} />
						  ))
						: null}
				</div>
			</div>
		</div>
	);
};

export default ShoppingListing;
