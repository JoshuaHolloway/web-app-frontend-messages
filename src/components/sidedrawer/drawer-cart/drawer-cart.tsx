import React, { FC, useContext } from 'react';
// import { gsap } from 'gsap';
import Button from '@mui/material/Button';
import router from 'next/router';
import AuthContext from '@src/code/context/auth-context';
import CartCtx from '@src/code/context/cart-context';
import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { toDollarsAndCents } from '@src/code/functions/money/money';
import { useHttpClient } from '@src/code/hooks/http-hook';
// import { CartItem } from '@src/code/models/CartItem';
import css from './drawer-cart.module.scss';

// ==============================================

interface Props {
  // cart: CartItem[];
  // updateQuantity: (idx: number, qty: number) => void;
  // removeFromCart: (idx: number) => void;
  duration: number;
  // total: number;
}

// ==============================================

const DrawerCart: FC<Props> = (props) => {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();

  const cartCtx = useContext(CartCtx);
  const notificationCtx = useContext(NotificationContext);
  const loadingCtx = useContext(LoadingContext);
  const authCtx = useContext(AuthContext);

  // --------------------------------------------

  const deleteHandler = (idx: number) => () => cartCtx.removeFromCart(idx);

  // --------------------------------------------

  const total_div = (price: number) => {
    const [dollars, cents] = toDollarsAndCents(price);

    return (
      <>
        <span style={{ fontSize: '1.3rem' }}>${dollars}</span>.<span style={{ fontSize: '0.9rem' }}>{cents}</span>
      </>
    );
  };

  // --------------------------------------------

  const placeOrderHandler = async () => {
    if (authCtx.isLoggedIn) {
      try {
        cartCtx.hideCart();
        loadingCtx.startLoading(0.5);
        notificationCtx.begin({ message: 'opening secure order form' });

        // -Step 1: Store order in DB
        console.log('Checkout Flow Step 1: Store order in DB (status-1) -- [POST] /api/orders');
        const { order_id } = await sendRequest(
          '/api/orders',
          'POST',
          JSON.stringify({ cart: cartCtx.cart, total: cartCtx.cart_total }),
          {
            'Content-Type': 'application/json',
            Authorization: authCtx.token,
          }
        );
        // console.log('data: ', order_data);

        // Step 2: Send cart to Stripe endpoing
        console.log('Checkout Flow Step 2: Send data to Stripe -- [POST] /api/checkout');
        const data = await sendRequest(
          '/api/checkout',
          'POST',
          JSON.stringify({ cart_items: cartCtx.cart, href: window.location.href, order_id }),
          {
            'Content-Type': 'application/json',
            Authorization: authCtx.token,
          }
        );
        // console.log('data: ', data);

        // notificationCtx.endSuccess({ message: 'redirected to secure order form' });
        // loadingCtx.endLoading();

        // -redirect to order form
        window.location = data.url;
      } catch (err: any) {
        notificationCtx.endError({ message: err.message });
        loadingCtx.endLoading();
      } // try / catch
    } // if (authCtx.isLoggedIn)
    else {
      cartCtx.hideCart();
      notificationCtx.endError({ message: 'please log in' });
      router.push('/auth/login');
    }
  };

  // --------------------------------------------

  return (
    <div className={css.cart}>
      <ul className={css.cart_items}>
        {cartCtx.cart.map((cart_item, idx) => {
          return (
            <React.Fragment key={idx}>
              <li className={css.cart_item}>
                <div className={css.col1}>
                  <div className={css.img}></div>
                </div>
                <div className={css.col2}>
                  <div className={css.row1}>{cart_item.product_title}</div>
                  <div className={css.row2}>category</div>
                  <div className={css.row3}>details</div>
                </div>
                <div className={css.col3}>
                  {/* - - - - - - - - - - - - - */}

                  <div className={css.row1}>
                    <label>
                      <span>Quantity:</span>{' '}
                      <input
                        type="number"
                        value={cart_item.quantity}
                        onChange={(e) => {
                          const new_qty = Number(e.target.value);
                          cartCtx.updateQuantity(idx, new_qty);
                        }}
                      />
                    </label>
                  </div>

                  {/* - - - - - - - - - - - - - */}

                  <div className={css.row2}>{total_div(cart_item.product_price)}</div>

                  {/* - - - - - - - - - - - - - */}

                  <div
                    className={css.row3}
                    onClick={deleteHandler(idx)}
                    onKeyDown={deleteHandler(idx)}
                    tabIndex={0}
                    role="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                    <span>Remove</span>
                  </div>

                  {/* - - - - - - - - - - - - - */}
                </div>
              </li>

              <hr className={css.hr} />
            </React.Fragment>
          );
        })}
      </ul>

      <div className={css.place_order_container}>
        <div className={css.total}>Sub-Total: {total_div(cartCtx.cart_total)}</div>

        <Button variant="contained" color="error" onClick={placeOrderHandler}>
          Place Order
        </Button>
      </div>
    </div>
  );

  // --------------------------------------------
};

// ==============================================

export default DrawerCart;
