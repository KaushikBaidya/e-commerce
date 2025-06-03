import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const AuctionProductsHeader = ({ searchTerm, onSearchChange, onAddProduct }) => {
  return (
    <div className="w-full mb-4 flex items-center justify-between gap-4 border-b rounded p-2">
      <h1 className="text-2xl text-gray-800 font-medium">Auction Products</h1>
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button className="capitalize" onClick={onAddProduct}>
        Add auction product
      </Button>
    </div>
  );
};

export default AuctionProductsHeader;
