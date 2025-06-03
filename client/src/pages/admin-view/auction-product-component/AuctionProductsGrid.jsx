import AdminAuctionProductTile from '@/components/admin-view/AdminAuctionProductTile';
import NoItemFound from '@/components/common/no-item-found';

const AuctionProductsGrid = ({ products, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return <NoItemFound />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <AdminAuctionProductTile
          key={product._id}
          auctionProduct={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AuctionProductsGrid;
