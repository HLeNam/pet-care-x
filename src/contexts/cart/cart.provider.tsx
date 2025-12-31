import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { CartContext } from './cart.context';
import type { Cart, CartItem } from '~/types/cart.type';

const CART_STORAGE_KEY = 'pet-care-x-cart';

const getInitialCart = (): Cart => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return {
        items: parsed.items || [],
        totalItems: parsed.totalItems || 0,
        totalPrice: parsed.totalPrice || 0
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }

  return {
    items: [],
    totalItems: 0,
    totalPrice: 0
  };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart>(getInitialCart);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Calculate total items and total price
  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItems, totalPrice };
  };

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.productId === newItem.productId && item.branchId === newItem.branchId
      );

      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Item already exists, update quantity
        updatedItems = [...prevCart.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + (newItem.quantity || 1);

        // Check if new quantity exceeds max stock
        if (newQuantity > existingItem.maxStock) {
          toast.warning(`Cannot add more items. Maximum stock is ${existingItem.maxStock}`);
          return prevCart;
        }

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };
      } else {
        // New item, add to cart
        updatedItems = [
          ...prevCart.items,
          {
            ...newItem,
            quantity: newItem.quantity || 1
          }
        ];
      }

      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  const removeFromCart = (productId: string, branchId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter(
        (item) => !(item.productId === productId && item.branchId === branchId)
      );

      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  const updateQuantity = (productId: string, branchId: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) => {
        if (item.productId === productId && item.branchId === branchId) {
          // Validate quantity
          if (quantity < 1) return item;
          if (quantity > item.maxStock) {
            toast.warning(`Maximum stock is ${item.maxStock}`);
            return item;
          }

          return {
            ...item,
            quantity
          };
        }
        return item;
      });

      const { totalItems, totalPrice } = calculateTotals(updatedItems);

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
  };

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
