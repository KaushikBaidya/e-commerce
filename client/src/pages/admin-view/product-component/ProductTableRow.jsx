import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';

const ProductTableRow = ({ product, onEdit, onDelete }) => {
  return (
    <TableRow className="hover:bg-gray-100">
      <TableCell>
        <img
          src={product?.image}
          alt={product?.title}
          className="w-16 h-16 object-cover rounded"
          loading="lazy"
        />
      </TableCell>
      <TableCell>{product?.title}</TableCell>
      <TableCell>{product?.category}</TableCell>
      <TableCell className={product?.salePrice > 0 ? 'line-through text-muted-foreground' : ''}>
        ৳ {product?.price}
      </TableCell>
      <TableCell>{product?.salePrice > 0 ? `৳ ${product?.salePrice}` : '—'}</TableCell>
      <TableCell>{product?.totalStock}</TableCell>
      <TableCell className="flex justify-end gap-2 mt-4">
        <Button size="sm" onClick={() => onEdit(product)}>
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(product?._id)}>
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
