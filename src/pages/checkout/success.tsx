import { useEffect, useContext } from 'react';
// import Button from '@mui/material/Button';
// import router from 'next/router';
import AuthContext from '@src/code/context/auth-context';
import CartCtx from '@src/code/context/cart-context';
// import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
// import { toDollarsAndCents } from '@src/code/functions/money/money';
import { useHttpClient } from '@src/code/hooks/http-hook';

// ==============================================

export default function OrderPlacedPage() {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();

  const cartCtx = useContext(CartCtx);
  const notificationCtx = useContext(NotificationContext);
  // const loadingCtx = useContext(LoadingContext);
  const authCtx = useContext(AuthContext);

  // --------------------------------------------

  useEffect(() => {
    // -Step 1: Grab session_id from query search params
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log('params: ', params);
    // console.log('params.session_id: ', params['session_id']);

    const { session_id, order_id } = params;

    cartCtx.resetCart();

    try {
      (async () => {
        // -Update order status (stage-1 -> stage-2)
        // -Update number of products sold today
        await sendRequest(
          '/api/checkout/success',
          'POST',
          JSON.stringify({ cart: cartCtx.cart, session_id, order_id }),
          {
            'Content-Type': 'application/json',
            Authorization: authCtx.token,
          }
        );
      })();
    } catch (err: any) {
      notificationCtx.endError({ message: err.message });
    }
  }, []);

  // --------------------------------------------

  return (
    <>
      <h1>ORDER PLACED!</h1>
      <p>
        Your kids are starving. Carl's Jr. believes no child should go hungry. You are an unfit mother. Your children
        will be placed in the custody of Carl's Jr.
      </p>
      <h6>Carl's Jr., fuck you, I'm eating.</h6>
    </>
  );

  // --------------------------------------------
}

// ==============================================
