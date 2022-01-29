import { useState, useEffect, createContext } from 'react';
import { CartItem } from '@src/code/types/CartItem';
import { Product } from '@src/code/types/Product';

// ==============================================

export interface CartContextInterface {
  cart: CartItem[];
  cart_total: number;
  show_cart: boolean;
  addToCart: (p: Product) => void;
  updateQuantity: (n: number, q: number) => void;
  removeFromCart: (n: number) => void;
  resetCart: () => void;
  hideCart: () => void;
  showCart: () => void;
}

// ==============================================

const CartCtx = createContext<CartContextInterface>({
  cart: [],
  cart_total: 0,
  show_cart: false,
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  resetCart: () => {},
  hideCart: () => {},
  showCart: () => {},
});

// ==============================================

type Props = {
  children: JSX.Element;
};
const CartCtxProvider = ({ children }: Props) => {
  // --------------------------------------------

  const [show_cart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cart_total, setCartTotal] = useState(0);

  // --------------------------------------------

  // -Do Update of Cart (After Page Load)
  useEffect(() => {
    if (cart.length > 0) {
      let total = 0;
      cart.forEach((cart_item) => {
        total += cart_item.product_price * cart_item.quantity;
      });

      setCartTotal(total);
    } else {
      setCartTotal(0);
      setShowCart(false);
    }

    // console.log('cart: ', cart);
  }, [cart]);

  // --------------------------------------------

  // -Do On Page Load
  useEffect(() => {
    // Get cart from local-storage
    const ls_cart = localStorage.getItem('cart');
    if (ls_cart) {
      setCart(JSON.parse(ls_cart));
    }
  }, []);

  // --------------------------------------------

  const addToCart = (product: Product) => {
    // -Step 0: Display cart inside navdrawer
    setShowCart(true);

    // setCart(new_cart);
    setCart((prev_cart: CartItem[]) => {
      // -Step 1: Check if item is already in cart.
      const already_in_cart_idx = prev_cart.findIndex((cart_item) => {
        return cart_item.product_id === product.id;
      });

      // -Step 2: If item not in cart, then add to cart, else, increase quantity.
      let new_cart: CartItem[];
      if (already_in_cart_idx === -1) {
        // -Item is not already in cart => Add item to cart!
        new_cart = [
          ...prev_cart,
          {
            product_id: product.id,
            quantity: 1,
            product_price: product.price,
            product_title: product.title,
          },
        ];
      } else {
        // -Item is already in cart => Increase quantity by one.
        new_cart = [...prev_cart];
        ++new_cart[already_in_cart_idx].quantity;
      }

      localStorage.setItem('cart', JSON.stringify(new_cart));
      return new_cart;
    });
  };

  // --------------------------------------------

  const updateQuantity = (cart_idx: number, new_quantity: number) => {
    if (new_quantity < 1) {
      removeFromCart(cart_idx);
    } else {
      setCart((prev_cart: CartItem[]) => {
        // -Update quantity of a single cart item.
        const new_cart = [...prev_cart];
        // debugger;
        new_cart[cart_idx].quantity = new_quantity;
        localStorage.setItem('cart', JSON.stringify(new_cart));
        return new_cart;
      });
    }
  };

  // --------------------------------------------

  const removeFromCart = (cart_idx: number) => {
    setCart((prev_cart: CartItem[]) => {
      const cart_item = prev_cart[cart_idx];
      const updated_cart = prev_cart.filter((filter_item) => filter_item.product_id !== cart_item.product_id);
      localStorage.setItem('cart', JSON.stringify(updated_cart));
      return updated_cart;
    });
  };

  // --------------------------------------------

  const resetCart = () => {
    console.log('resetting cart');
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };
  const showCart = () => setShowCart(true);
  const hideCart = () => setShowCart(false);

  // --------------------------------------------

  const context: CartContextInterface = {
    cart,
    cart_total,
    addToCart,
    updateQuantity,
    removeFromCart,
    resetCart,
    show_cart,
    showCart,
    hideCart,
  };

  // --------------------------------------------

  return <CartCtx.Provider value={context}>{children}</CartCtx.Provider>;

  // --------------------------------------------
};

// ==============================================

export { CartCtxProvider };
export default CartCtx;

// ==============================================
