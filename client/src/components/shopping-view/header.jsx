import { LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.png';
import { shoppingViewHeaderMenuItems } from '@/config';
import { logoutUser } from '@/store/auth-slice';
import { fetchCartItems } from '@/store/shop/cart-slice';

import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import CartWrapper from './cart-wrapper';

const MenuItems = ({ setOpen }) => {
  const navigate = useNavigate();

  const handleNavigate = (getCurrentItem) => {
    sessionStorage.removeItem('filters');

    const currentFilter =
      getCurrentItem.id !== 'home' &&
      getCurrentItem.id !== 'products' &&
      getCurrentItem.id !== 'auction' &&
      getCurrentItem.id !== 'search'
        ? { category: [getCurrentItem.id] }
        : null;

    sessionStorage.setItem('filters', JSON.stringify(currentFilter));

    // Always construct the URL with query params if it's a filter
    if (
      getCurrentItem.id !== 'home' &&
      getCurrentItem.id !== 'products' &&
      getCurrentItem.id !== 'auction' &&
      getCurrentItem.id !== 'search'
    ) {
      navigate(`/shop/listing?category=${getCurrentItem.id}`);
    } else {
      navigate(getCurrentItem.path);
    }
  };

  return (
    <nav className="flex flex-col lg:flex-row mb-3 lg:mb-0 lg:items-center gap-5 p-6">
      {shoppingViewHeaderMenuItems.map((item) => (
        <Label
          onClick={() => {
            handleNavigate(item);
            if (setOpen) setOpen(false);
          }}
          key={item.id}
          className="text-base cursor-pointer"
        >
          <span>{item.label}</span>
        </Label>
      ))}
    </nav>
  );
};

const HeaderRightContent = ({ setOpen }) => {
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    if (setOpen) setOpen(false);

    setTimeout(() => {
      navigate('/auth/login');
    }, 100);
  };

  useEffect(() => {
    if (user !== null) dispatch(fetchCartItems(user?.id));
  }, [dispatch, user]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-6 p-6">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <div
          onClick={() => setOpenCartSheet(true)}
          className="relative cursor-pointer w-10 lg:w-full"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute top-[-15px] right-[-15px] font-semibold text-sm bg-red-500 text-white rounded-full px-2">
              {cartItems?.items?.length}
            </span>
          )}
          <span className="sr-only">cart</span>
        </div>
        <CartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []
          }
        />
      </Sheet>
      {user === null ? (
        <Link to="/auth/login">
          <Button variant="outline">Login</Button>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="bg-black">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName
                  ? user.userName[0].toUpperCase()
                  : user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              Logged in as <span className="font-semibold uppercase">{user?.userName}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigate('/shop/account');
                if (setOpen) setOpen(false);
              }}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex gap-2" onClick={() => handleLogout()}>
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

const ShoppingHeader = ({ open, setOpen }) => {
  return (
    <header className="fixed top-0 z-40 w-full bg-background border-b">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
        <div className="w-full flex items-center justify-between">
          <Link to="/">
            <div className="flex flex-row items-center justify-start gap-2">
              <img src={logo} alt="logo" className="h-10" />
            </div>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
              <span className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </span>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <MenuItems setOpen={setOpen} />
              <HeaderRightContent setOpen={setOpen} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent setOpen={setOpen} />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
