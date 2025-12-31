import { createContext } from 'react';
import type { Cart, CartItem } from '~/types/cart.type';

export interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string, branchId: string) => void;
  updateQuantity: (productId: string, branchId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
