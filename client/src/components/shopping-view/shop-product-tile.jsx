import { categoryOptionsMap } from '@/config';
import { ShoppingCartIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';

const ShopProductTile = ({ product, handleGetProductDetails, handleAddToCart }) => {
  return (
    <Card className="w-full max-w-sm mx-auto shadow-sm">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-48 md:h-56 lg:h-72 object-cover rounded-t-lg"
          />

          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-700 text-sm">Out Of Stock</Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 text-sm">
              Only {product?.totalStock} left
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-orange-500 text-sm">Sale</Badge>
          ) : null}
        </div>

        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg md:text-xl font-medium">{product?.title}</h2>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{categoryOptionsMap[product?.category]}</span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`${
                product?.salePrice > 0 ? 'line-through' : ''
              } text-base font-medium text-primary`}
            >
              ৳ {product?.price}
            </span>

            {product?.salePrice > 0 && (
              <span className="text-base font-medium text-primary">৳ {product?.salePrice}</span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button>
        ) : (
          <Button
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShopProductTile;
